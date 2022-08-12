// const { contextBridge } = require('electron');
const { contextBridge, ipcRenderer } = require("electron");
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
// const { download } = require('electron-dl');

// 
// const API = {
//   exec: exec('./assets/PowershellScripts/excelToMatlab.ps1', { 'shell':'powershell.exe'}, (error, stdout, stderr)=> { })
// }
// 
// contextBridge.exposeInMainWorld('api', API);
// const win = new BrowserView.getFocusedWindow();

contextBridge.exposeInMainWorld("ipcRenderer", {
  ipcRenderer,
  exec: () => // u need to change directory of matlab file for production
    exec('matlab -nosplash -nodesktop -r "run(\'' + process.cwd() + '\\resources\\app\\build\\assets\\matlabScripts\\ExportToSTK.m\'); exit;"', { 'shell': 'powershell.exe' },
      (error, stdout, stderr) => { }),
  send: (payload) => fs.writeFile('C:\\temp\\UpdateSatData.csv', payload, function (err) {
    if (err) console.log(payload);
  })
  // download: (url) => download(win, url, { directory: "C:\\Users\\1170692\\Downloads"})
  // C:\Users\1170692\Desktop\electronTest\src\assets\matlabScripts\ExportToSTK.m
});

