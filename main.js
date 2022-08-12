const { app, BrowserWindow, nativeTheme, ipcMain } = require('electron');
var path = require('path');
const url = require("url");
const fs = require("fs");
// const download = require('electron-dl');
// const ObjectsToCSV = require('objects-to-csv');

let win;
function createWindow() {
  // Create the browser window.
  nativeTheme.themeSource = 'dark';
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    // icon: `file://${__dirname}/dist/assets/rtxLOGO.png`,
    darkTheme: true,
    backgroundColor: '#303030',
    // asar: false,
    // webPreferences: { webSecurity: false },
    webPreferences: {
      // nodeIntegration: true,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'electronPacking/preload.js')
    }
  });


  win.autoHideMenuBar = true;


  // const startUrl = path.resolve('index.html');
  // win.loadUrl(startUrl);

  // When watching for changes (such as what ng serve does) run loadURL() localhost

  // win.loadURL("http://localhost:4200/");

  // production
  win.loadURL(url.format({
    pathname: path.resolve(__dirname, './build/index.html'),
    protocol: "file",
    slashes: true
  }));

  // web dev tools
  // win.webContents.openDevTools();

  ipcMain.on("download", (payload) => {  
    // directory: "C:/Users/1170692/Downloads"
    // const object = payload.data;
    // console.log(payload);
    //  console.log(payload.csv.toString());
    // const csv = new ObjectsToCSV(object);
    fs.writeFile('C:\\temp\\UpdateSatData.csv', payload, function (err) {
      if (err) console.log(payload);
    });
    // csv.toDisk('./test.csv');
    // download(BrowserWindow.getFocusedWindow(), payload.url, { saveAs: true });
  });

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
}

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})
