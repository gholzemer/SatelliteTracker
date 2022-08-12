import { Injectable } from '@angular/core';
import { SAT } from './SAT';
// import { PowerShell } from 'node-powershell';
// import { exec } from 'node:child_process';
// const fs = require('fs');

@Injectable({
  providedIn: 'root'
})
export class electronService {

  constructor() { }

  getIpcRenderer() {
    return (<any>window).ipcRenderer;
  }

  powershellMatlabCommand() {
    // console.log(win.api);
    //  return this.httpClient.get<any>(`/assets/PowershellScripts/powershell-matlab.php`);
    (<any>window).ipcRenderer.exec();
    return;
  }

  downloadURL(data: SAT[], csv: string) {
    (<any>window).ipcRenderer.send(csv);
  }

}

