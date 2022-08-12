import { Injectable } from '@angular/core';
import { electronService } from './electron.service';
import { SAT } from './SAT';


@Injectable({
  providedIn: 'root'
})
export class downloadService {

  constructor(private es: electronService) {

  }

  downloadFile(data: SAT[], filename = 'data') {
    let csvData = this.ConvertToCSV(data, [
      'PERIAPSIS',
      'CENTER_NAME',
      'SEMIMAJOR_AXIS',
      'MEAN_MOTION_DOT',
      'CLASSIFICATION_TYPE',
      'TLE_LINE0',
      'FILE',
      'ECCENTRICITY',
      'ELEMENT_SET_NO',
      'COMMENT',
      'TIME_SYSTEM',
      'RA_OF_ASC_NODE',
      'GP_ID',
      'EPHEMERIS_TYPE',
      'RCS_SIZE',
      'OBJECT_NAME',
      'REF_FRAME',
      'COUNTRY_CODE',
      'OBJECT_TYPE',
      'DECAY_DATE',
      'ORIGINATOR',
      'TLE_LINE2',
      'TLE_LINE1',
      'ARG_OF_PERICENTER',
      'MEAN_MOTION',
      'MEAN_MOTION_DDOT',
      'PERIOD',
      'CREATION_DATE',
      'MEAN_ANOMALY',
      'EPOCH',
      'MEAN_ELEMENT_THEORY',
      'SITE',
      'BSTAR',
      'NORAD_CAT_ID',
      'INCLINATION',
      'REV_AT_EPOCH',
      'CCSDS_OMM_VERS',
      'APOAPSIS',
      'LAUNCH_DATE',
      'System',
      'Company',
      'ORBIT',
      'Sensor',
      'OBJECT_ID'
    ]);

    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    // dwldLink.style.visibility = "hidden";
    
    document.body.appendChild(dwldLink);
    // console.log(dwldLink.getAttribute("download"));
    // console.log(dwldLink.toString());
    let str: string = "";
    let str2 = dwldLink.getAttribute("href") + "/" + dwldLink.getAttribute("download");
    str = str.concat(url);
    str = str.concat("/");
    str = str.concat(filename + ".csv");
    document.body.appendChild(dwldLink);
    // How the user is prompted to download
    dwldLink.click();

    // this.es.downloadURL(data, csvData);

    // console.log(str2);
    // this.es.downloadURL(data);
    // this.es.downloadURL(str2, "./Downloads");
    document.body.removeChild(dwldLink);
  }

  downloadFileForSTK(data: SAT[], filename = 'data') {
    let csvData = this.ConvertToCSV(data, [
      'PERIAPSIS',
      'CENTER_NAME',
      'SEMIMAJOR_AXIS',
      'MEAN_MOTION_DOT',
      'CLASSIFICATION_TYPE',
      'TLE_LINE0',
      'FILE',
      'ECCENTRICITY',
      'ELEMENT_SET_NO',
      'COMMENT',
      'TIME_SYSTEM',
      'RA_OF_ASC_NODE',
      'GP_ID',
      'EPHEMERIS_TYPE',
      'RCS_SIZE',
      'OBJECT_NAME',
      'REF_FRAME',
      'COUNTRY_CODE',
      'OBJECT_TYPE',
      'DECAY_DATE',
      'ORIGINATOR',
      'TLE_LINE2',
      'TLE_LINE1',
      'ARG_OF_PERICENTER',
      'MEAN_MOTION',
      'MEAN_MOTION_DDOT',
      'PERIOD',
      'CREATION_DATE',
      'MEAN_ANOMALY',
      'EPOCH',
      'MEAN_ELEMENT_THEORY',
      'SITE',
      'BSTAR',
      'NORAD_CAT_ID',
      'INCLINATION',
      'REV_AT_EPOCH',
      'CCSDS_OMM_VERS',
      'APOAPSIS',
      'LAUNCH_DATE',
      'System',
      'Company',
      'ORBIT',
      'Sensor',
      'OBJECT_ID'
    ]);

    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    // dwldLink.style.visibility = "hidden";

    document.body.appendChild(dwldLink);
    // console.log(dwldLink.getAttribute("download"));
    // console.log(dwldLink.toString());
    let str: string = "";
    let str2 = dwldLink.getAttribute("href") + "/" + dwldLink.getAttribute("download");
    str = str.concat(url);
    str = str.concat("/");
    str = str.concat(filename + ".csv");
    document.body.appendChild(dwldLink);
    // How the user is prompted to download
    // dwldLink.click();

    this.es.downloadURL(data, csvData);

    // console.log(str2);
    // this.es.downloadURL(data);
    // this.es.downloadURL(str2, "./Downloads");
    document.body.removeChild(dwldLink);
  }

  downloadJson(data: SAT[], filename = 'data') {
    var objectAsJson = JSON.stringify(data);
    let blob = new Blob(['\ufeff' + objectAsJson], { type: 'text/json;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".json");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  downloadText(data: SAT[], filename = 'data') {
    var objectAsJson = JSON.stringify(data);
    let blob = new Blob(['\ufeff' + objectAsJson], { type: 'text/json;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".txt");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray: SAT[], headerList: string[]) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';

    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = (i + 1) + '';
      for (let index in headerList) {
        let head = headerList[index];
        line += ',' + array[i][head];
      }
      str += line + '\r\n';
    }
    return str;
  }
}
