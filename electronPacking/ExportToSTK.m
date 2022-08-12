%% Export User Selected Data to STK
% Jacob Lackey
% 14 July 2022

% User selected data is exported from the database and then inserted into 
%    STK using this program.
% Required Helper Functions: readCsvToStruct.m
% Required files: ExportSatData.csv, ExportFile.txt
clear
clc

% Get name of file user wants to import into
% scenarioFile = fileread('ExportFile.txt');
% Get data of satellites user wants to import
satData = readCsvToStruct("C:\temp\UpdateSatData.csv");

% % Check input data for empty
% if ismissing(scenarioFile)
%     fprintf('Error: No scenario file given.\n')
%     % Exit running script, return control to user
%     return
% elseif isempty(satData)
%     fprintf('Error: No data given.\n')
%     return
% end

%% Start STK
% Open with STK engine
% uiapp = actxserver('STKX12.application');
% root = actxserver('AgStkObjects12.AgStkObjectRoot');
% -OR- Use running STK GUI
uiapp = actxGetRunningServer('STK12.Application');
uiapp.Visible = 1;
root = uiapp.Personality2;

% Catch error in loading scenario file
% if contains(scenarioFile, ".sc")
%     try
%         root.LoadScenario(scenarioFile);
%     catch
%         fprintf('Error: Could not load file: %s\n', scenarioFile);
%         return
%     end
% elseif contains(scenarioFile, ".vdf")
%     try
%         root.LoadVDF(scenarioFile, '');
%     catch
%         fprintf('Error: Could not load file: %s\n', scenarioFile);
%         return
%     end
%     fprintf('Warning: Editing a .vdf will create extra folders, .sc is recommended.\n')
% else
%     fprintf('Error: Incorrect File Type. "%s" \nExpected .vdf or .sc', scenarioFile)
%     return
% end
scenario = root.CurrentScenario;

% Set distance units to km, will NOT override units set in scenario
root.ExecuteCommand('Units_set * Connect Distance "Kilometers"');
% Set angle units, WILL override units set in scenario
root.ExecuteCommand('Units_set * All Angle "Degrees"');

%% Get data for all satellites in scenario
% Find out how many satellites are currently in scenario
numberOfSats = scenario.Children.GetElements('eSatellite').Count;
% Initalize struct
if numberOfSats > 0
    satellite(numberOfSats).index = [];
else
    satellite = struct.empty();
end
% Get data for each satellite in scenario
for ii = 1 : numberOfSats
    % Indices in STK start at 0
    satellite(ii).index = int32(ii - 1);
    satellite(ii).object = scenario.Children.GetElements('eSatellite').Item(satellite(ii).index);
    satellite(ii).name = satellite(ii).object.InstanceName;
    % If satellite isn't propagated with SGP4, skip it
    if satellite(ii).object.PropagatorType ~= "ePropagatorSGP4"
        satellite(ii).epoch = 0;
        satellite(ii).noradID = 0;
        satellite(ii).intlID = 0;
        satellite(ii).sensor = getSensorData(satellite(ii));
    else
        % If propagator is SGP4, get most recent segment data (TLE data)
        prop = satellite(ii).object.Propagator;
        numberOfSegs = prop.Segments.Count;
        % Index starts at 0, get last seg
        segment = prop.Segments.Item(int32(numberOfSegs - 1));
        satellite(ii).epoch = segment.Epoch;
        satellite(ii).meanMotion = segment.MeanMotion;
        satellite(ii).ecc = segment.Eccentricity;
        satellite(ii).inc = segment.Inclination;
        satellite(ii).argOfPeri = segment.ArgOfPerigee;
        satellite(ii).raan = segment.RAAN;
        satellite(ii).meanAnom = segment.MeanAnomaly;
        satellite(ii).noradID = str2double(segment.SSCNum);
        % Remove extra space at end of intl (sometimes appears)
        satellite(ii).intlID = replace(segment.IntlDesignator, ' ', '');
        satellite(ii).sensor = getSensorData(satellite(ii));
    end
end

%% Compare data of scenario and database
% Look at each satellite in the scenario and see if it matches a
% satellite in the update data
for ii = 1 : length(satData)
    % Reset foundSat to default
    foundSat = false;
    for jj = 1 : length(satellite)
        % If names, NORAD IDs, or International IDs match, satellite is found
        %   (STK is inconsistent with providing the Intl ID. It is either
        %    YY##### or YYYY-#####. Both must be searched for.)
        %   (A satellite's NORAD ID defaults to 99999 if not set. It cannot
        %    be set by this system. Ignore those.)
        if strcmp(satellite(jj).name, satData(ii).stkName) ...
        || strcmp(satellite(jj).intlID, satData(ii).intlID) ...
        || strcmp(satellite(jj).intlID, satData(ii).stkIntlID) ...
        || (satellite(jj).noradID == satData(ii).noradID && satellite(jj).noradID ~= "99999")
            foundSat = true;
            % If a satellite has an epoch of 0, it is not propagated with
            %   SGP4. This is a user choice and the satellite will not be
            %   changed.
            if satellite(jj).epoch == 0
                fprintf("Warning: %s does not use SGP4. It will not be updated.\n", ...
                satellite(jj).object.InstanceName)
            % If the satellite has a decay date (is not missing)
            elseif ~isempty(satData(ii).decayDate)
                % Remove satellite satellite
                scenario.Children.Unload('eSatellite', satellite(jj).name)
            % If satellite is not decayed and the scenario TLE does not match the database
            elseif compareSatData(satellite(jj), satData(ii)) == false
                % Update satellite (User function)
                setSatellite(satellite(jj), satData(ii))
            end
            % If the sensor data does not match
            if ~compareSensorData(satellite(jj), satData(ii))
                % Update sensor (User function)
                setSensor(satellite(jj), satData(ii))
            end
            break
        end
    end
    % If the satellite is not found in the scenario and has no decay date
    if foundSat == false && isempty(satData(ii).decayDate)
        % Add satellite to scenario
        satellite(end + 1).object = scenario.Children ...
                 .New('eSatellite', satData(ii).stkName);
        satellite(end).object.SetPropagatorType('ePropagatorSGP4');
        % Set propagator time step as 60 sec
        satellite(end).object.Propagator.Step = 60;
        % Set Satellite orbit color in hexidecimal
        satellite(end).object.Graphics.SetAttributesType('eAttributesBasic');
        satellite(end).object.Graphics.Attributes.Color = 0xFFFF00;
        % Set satellite data (User made function)
        setSatellite(satellite(end), satData(ii))
        satellite(end).name = satData(ii).stkName;
        satellite(end).index = int32(length(satellite) - 1);
        % Read back satellite data
        prop = satellite(end).object.Propagator;
        numberOfSegs = prop.Segments.Count;
        % Index starts at 0, get last seg
        segment = prop.Segments.Item(int32(numberOfSegs - 1));
        satellite(end).epoch = segment.Epoch;
        satellite(end).meanMotion = segment.MeanMotion;
        satellite(end).ecc = segment.Eccentricity;
        satellite(end).inc = segment.Inclination;
        satellite(end).argOfPeri = segment.ArgOfPerigee;
        satellite(end).raan = segment.RAAN;
        satellite(end).meanAnom = segment.MeanAnomaly;
        satellite(end).noradID = str2double(segment.SSCNum);
        % Remove extra space at end of intl (sometimes appears)
        satellite(end).intlID = replace(segment.IntlDesignator, ' ', '');
        % Add sensor
        setSensor(satellite(end), satData(ii))
        % Read sensor data back
        satellite(end).sensor = getSensorData(satellite(end));
    end
end

% root.SaveAs(scenarioFile)
% root.CloseScenario()

%% User Defined Functions
function sensorData = getSensorData(satellite)
% Read through all sensors attached to satellite and get their settings
% Inputs: Row of satellite struct
% Return: Cell array
    numberOfSensors = satellite.object.Children.GetElements('eSensor').Count;
    sensorData = cell(numberOfSensors, 1);
    for ii = 1 : numberOfSensors
        sensor = satellite.object.Children.GetElements('eSensor').Item(int32(ii - 1));
        sensorData{ii}.name = sensor.InstanceName;
        sensorData{ii}.patternType = sensor.PatternType;
        sensorData{ii}.color = sensor.Graphics.Color;
        switch sensor.PatternType
            case 'eSnRectangular'
                sensorData{ii}.angleRes = sensor.Pattern.AngularResolution;
                sensorData{ii}.horzHalfAngle = sensor.Pattern.HorizontalHalfAngle;
                sensorData{ii}.vertHalfAngle = sensor.Pattern.VerticalHalfAngle;
            case 'eSnSimpleConic'
                sensorData{ii}.angleRes = sensor.Pattern.AngularResolution;
                sensorData{ii}.coneAngle = sensor.Pattern.ConeAngle;
        end
        sensorData{ii}.pointing = sensor.PointingType;
        switch sensor.PointingType
            case 'eSnPtFixed'
                orientArray = sensor.Pointing.Orientation.QueryAzElArray;
                sensorData{ii}.orientation = [orientArray{1}, orientArray{2}, orientArray{3}];
        end
    end
end

function setSensor(satellite, satData)
% Add sensors to satellite if it does not already have then
% Inputs: Row of struct of scenario data, Row of struct of database data
% Return: void
    % If sensor field does not yet exist
    if ~isfield(satellite, 'sensor')
        satellite.sensor = string.empty;
    end
    % Check if sensor name matches any sensors on satellite
    % (Leave any user-added sensors)
    for ii = 1 : length(satData.sensor)
        foundSensor = false;
        for jj = 1 : length(satellite.sensor)
            % If satellite has sensor with the same name as a sensor in the database
            if strcmp(satData.sensor{ii}.name, satellite.sensor{jj}.name)
                foundSensor = true;
                break
            end
        end
        sensorData = satData.sensor{ii};
        % If sensor doesn't exist on satellite, create it
        if foundSensor == false
            stkSensor = satellite.object.Children.New('eSensor', sensorData.name);
        else
            stkSensor = satellite.object.Children.Item(int32(jj - 1));
        end
        % Set / Reset sensor data to match database
        stkSensor.SetPatternType(sensorData.patternType);
        switch sensorData.patternType
            case 'eSnRectangular'
                stkSensor.CommonTasks.SetPatternRectangular(sensorData.vertHalfAngle, sensorData.horzHalfAngle);
            case 'eSnimpleConic'
                stkSensor.CommonTasks.SetPatternSimpleConic(sensorData.coneAngle, sensorData.angleRes);
        end
        % Pointing type is always 'Fixed' frame
        stkSensor.SetPointingType('eSnPtFixed');
        % Set to point Nadir. Can make this user adjustable in the future
        stkSensor.CommonTasks.SetPointingFixedAzEl(0, 90, 1);
        stkSensor.Graphics.Color = sensorData.color;
    end
end

function check = compareSensorData(satellite, satData)
% Check if data for sensors in scenario match database. The scenario should
%   contain every sensor that is in the database, but is permitted to 
%   contain addional sensors not in the database.
% Inputs: Row of satellite struct, Row of satData struct
% Return: Bool
    % Initalize check as true. If any checks in the loop fail, it will be
    %   set to false
    check = true;
    % Search for each sensor in database
    for ii = 1 : length(satData.sensor)
        dataSensor = satData.sensor{ii};
        foundSensor = false;
        for jj = 1 : length(satellite.sensor)
            stkSensor = satellite.sensor{jj};
            if strcmp(stkSensor.name, dataSensor.name)
                foundSensor = true;
                break
            end
        end
        % If sensor from database is found in the model, check if data is correct
        if foundSensor == true
            % Check if orientation matches (remove this?)
            %   or if pattern type matches
            if ~strcmp(stkSensor.patternType, dataSensor.patternType)
            % || ~isequal(stkSensor.orientation, dataSensor.orientation)
                check = false;
            else
                % Check properties for each pattern type
                switch stkSensor.patternType
                    case 'eSnRectangular'
                        if stkSensor.vertHalfAngle ~= dataSensor.vertHalfAngle ...
                        || stkSensor.horzHalfAngle ~= dataSensor.horzHalfAngle
                            check = false;
                        end
                    case 'eSnSimpleConic'
                        if stkSensor.coneAngle ~= dataSensor.coneAngle ...
                        || stkSensor.angleRes ~= dataSensor.angleRes
                            check = false;
                        end
                end
            end
        % If sensor from database is not found in the model
        else
            check = false;
        end
    end
end

function setSatellite(satellite, satData)
% Sets a satellite in an STK scenario with the given data
% Inputs: Row of satellite struct, Row of satData struct
% Return: Void
    seg = satellite.object.Propagator.Segments.AddSeg();
    seg.Epoch = satData.stkEpoch;
    seg.MeanMotion = satData.meanMotion;
    seg.Eccentricity = satData.ecc;
    seg.Inclination = satData.inc;
    seg.ArgOfPerigee = satData.argOfPeri;
    seg.RAAN = satData.raan;
    seg.MeanAnomaly = satData.meanAnom;
    seg.BStar = satData.bStar;
    seg.Classification = satData.class;
    seg.RevNumber = satData.revs;
    seg.IntlDesignator = satData.stkIntlID;

    satellite.object.Propagator.Propagate;
end

function check = compareSatData(satellite, satData)
% Checks the data between the database and the scenario to see if they are the
    % same
% Inputs: Row of satellite struct, Row of satData struct
% Return: Bool
    % If difference is larger than machine precision
    if abs(satellite.epoch - satData.stkEpoch) < 1e-10 ...
    && abs(satellite.meanMotion - satData.meanMotion) < 1e-10 ...
    && abs(satellite.ecc - satData.ecc) < 1e-10 ...
    && abs(satellite.inc - satData.inc) < 1e-10 ...
    && abs(satellite.argOfPeri - satData.argOfPeri) < 1e-10 ...
    && abs(satellite.raan - satData.raan) < 1e-10 ...
    && abs(satellite.meanAnom - satData.meanAnom) < 1e-10
        check = 1;
    else
        check = 0;
    end
end
