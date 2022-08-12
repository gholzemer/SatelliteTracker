%% Function: Read Satellite csv File and Import to Struct
% Jacob Lackey
% 29 June 2022

% Works only with json file of satellite data formated in the same manner
% as Space-Track.org

% Inputs: File name/path of json file
% Outputs: Struct of satellite data

function finalData = readCsvToStruct(fileName)
    % Read in data
    dataTable = readtable(fileName);
    % Set NULL characters to missing
    dataTable = standardizeMissing(dataTable, {'\N', 'null', 'NULL'});
    %test = dataTable.NORAD_CAT_ID(0);
    % disp(dataTable);
    % Clean data, form struct
    for ii = 1 : height(dataTable.NORAD_CAT_ID)
        finalData(ii).noradID = dataTable.NORAD_CAT_ID(ii);
        finalData(ii).intlID = dataTable.OBJECT_ID{ii};
        finalData(ii).stkIntlID = replace(finalData(ii).intlID(3 : end), '-', '');
        % finalData(ii).systemID = dataTable.S_No(ii);
        % Remove illegal charaters, set name in same format as STK
        finalData(ii).objectName = dataTable.OBJECT_NAME{ii};
        finalData(ii).stkName = replace(dataTable.OBJECT_NAME(ii), ...
                                   {' ', '(', ')', '/'}, {'_', '', '', '_'}) ...
                                   + "_" + num2str(finalData(ii).noradID);
        % finalData(ii).orbit = dataTable.ORBIT{ii};
        finalData(ii).country = dataTable.COUNTRY_CODE{ii};
        finalData(ii).class = dataTable.CLASSIFICATION_TYPE{ii};
        % Set as Datetime type
        finalData(ii).epoch = datetime(dataTable.EPOCH(ii), ...
                              'Format','dd MMM yyyy HH:mm:ss.SSSSSS');
        finalData(ii).stkEpoch = str2double(dataTable.TLE_LINE1{ii}(19:32));
        finalData(ii).sma = dataTable.SEMIMAJOR_AXIS(ii);
        finalData(ii).ecc = dataTable.ECCENTRICITY(ii);
        finalData(ii).inc = dataTable.INCLINATION(ii);
        finalData(ii).argOfPeri = dataTable.ARG_OF_PERICENTER(ii);
        finalData(ii).raan = dataTable.RA_OF_ASC_NODE(ii);
        finalData(ii).meanAnom = dataTable.MEAN_ANOMALY(ii);
        % Convert rev/day to deg/sec
        finalData(ii).meanMotion = dataTable.MEAN_MOTION(ii) * 360 / 86400;
        finalData(ii).period = dataTable.PERIOD(ii); 
        finalData(ii).periapsis = dataTable.PERIAPSIS(ii);
        finalData(ii).apoapsis = dataTable.APOAPSIS(ii);
        finalData(ii).bStar = dataTable.BSTAR(ii);
        finalData(ii).revs = dataTable.REV_AT_EPOCH(ii);
        finalData(ii).launchDate = dataTable.LAUNCH_DATE(ii);
        finalData(ii).decayDate = string(dataTable.DECAY_DATE(ii));
%         % Replace missing string with empty string
         if ismissing(finalData(ii).decayDate)
             finalData(ii).decayDate = string.empty;
         end
        finalData(ii).sensor = parseSensorString(dataTable.Sensor(ii));
        finalData(ii).tle0 = dataTable.TLE_LINE0{ii};
        finalData(ii).tle1 = dataTable.TLE_LINE1{ii};
        finalData(ii).tle2 = dataTable.TLE_LINE2{ii};
    end

 %% Helper Function
    function sensorData = parseSensorString(sensorString)
    % Parse through the string containing the sensor data and convert the
    %   string into a cell array of structs. Each struct is one sensor, the
    %   cell array contains all the sensors for the satellite
    % Inputs: String (Sensor string from database)
    % Return: Cell array of structs
        % Remove semicolon from end of string if it has it (will cause
        %   issues with split function
        if ~isempty(sensorString{1}) && sensorString{1}(end) == ";"
            % sensorString = all but last character
            sensorString{1} = sensorString{1}(1 : end - 1);
        end
        % If string is not empty
        if ~isempty(sensorString{1})
            sensorString = split(sensorString, {'; ', ';'});
            sensorString = cellstr(sensorString);
            stringData = cell(length(sensorString), 1);
            for jj = 1 : length(sensorString)
                sensorString{jj} = split(sensorString{jj}, {', ', ','});
                for kk = 1 : length(sensorString{jj})
                    sensorString{jj}{kk} = split(sensorString{jj}{kk}, {': ', ':'});
                    stringData{jj, 1}{kk, 1} = sensorString{jj}{kk}{1};
                    stringData{jj, 1}{kk, 2} = sensorString{jj}{kk}{2};
                end
            end
            
            sensorData = cell(length(sensorString), 1);
            for jj = 1 : length(sensorString)
                for kk = 1 : length(stringData{jj})
                    switch stringData{jj}{kk, 1}
                        case 'NAME'
                            sensorData{jj}.name = stringData{jj}{kk, 2};
                        case 'PATTERN'
                            sensorData{jj}.patternType = stringData{jj}{kk, 2};
                        case 'CONE_ANGLE'
                            sensorData{jj}.coneAngle = str2double(stringData{jj}{kk, 2});
                        case 'ANGLE_RES'
                            sensorData{jj}.angleRes = str2double(stringData{jj}{kk, 2});
                        case 'HORZ_HALF_ANGLE'
                            sensorData{jj}.horzHalfAngle = str2double(stringData{jj}{kk, 2});
                        case 'VERT_HALF_ANGLE'
                            sensorData{jj}.vertHalfAngle = str2double(stringData{jj}{kk, 2});
                        case 'ORIENTATION'
                            orientString = split(stringData{jj}{kk, 2}, ' ');
                            sensorData{jj}.orientation = [str2double(orientString{1}), str2double(orientString{2}), str2double(orientString{3})];
                        case 'COLOR'
                            sensorData{jj}.color = hex2dec(stringData{jj}{kk, 2});
                    end
                end
            end
        % If there is no sensor data
        else
            sensorData = string.empty();
        end
    end
end
