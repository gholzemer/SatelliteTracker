import { Component, OnInit } from '@angular/core';
import { SAT } from '../SAT';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-manual-update-layout',
  templateUrl: './manual-update-layout.component.html',
  styleUrls: ['./manual-update-layout.component.css']
})
export class ManualUpdateLayoutComponent implements OnInit {
  sat: SAT[] = [];
  satOnPage: SAT[] = [];
  satellitesDeleted: SAT[] = [];

  tooUpdateSize: number = 0;
  firstOrbitalSort: number = 0;
  pageNumber: number = 0;
  itemsPerPage: number = 28;
  numberOfPages: number = 100;
  displayNumberOfPages: number = this.numberOfPages + 1;
  DisplayPageNumber: number = 1;
  

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getUpdateSats();
  }

  updateAllSats() {
    alert("Updating " + this.tooUpdateSize + " Satellites.");
    for (let i = 0; i < this.sat.length; i++) {
       this.insertOneSat(this.sat[i]);
       this.deleteSat(this.sat[i]);
    }
    this.satOnPage = [];
    this.sat = [];
    this.getUpdateSats();
  }




  deleteSat(data: SAT) {
    this.apiService.overrideSatellite(
      "DELETE FROM `update` WHERE NORAD_CAT_ID = "+data.NORAD_CAT_ID+";"
    ).subscribe((sats: any) => {
      // console.log(sats);
    })
  }

  insertOneSat(data: SAT) {
    this.apiService.overrideSatellite(
      // "INSERT INTO spaceship.satcat (`S_No`, `OBJECT_NAME`, `NORAD_CAT_ID`,`OBJECT_ID`,`ORBIT`,`EPOCH`,`INCLINATION`,`RA_OF_ASC_NODE`,`MEAN_ANOMALY`,`DECAY_DATE`,`REV_AT_EPOCH`,`BSTAR`,`MEAN_MOTION_DOT`,`MEAN_MOTION_DDOT`,`SEMIMAJOR_AXIS`,`PERIOD`,`APOAPSIS`,`PERIAPSIS`, `OBJECT_TYPE`,`RCS_SIZE`,`COUNTRY_CODE`,`LAUNCH_DATE`,`SITE`,`CLASSIFICATION_TYPE`,`GP_ID`,`TLE_LINE0`,`TLE_LINE1`,`TLE_LINE2`,`Sensor`,`RandomINT`,`EPHEMERIS_TYPE`,`ELEMENT_SET_NO`,`CCSDS_OMM_VERS`,`COMMENT`,`CREATION_DATE`,`ORIGINATOR`,`CENTER_NAME`,`REF_FRAME`,`TIME_SYSTEM`,`MEAN_ELEMENT_THEORY`,`FILE`,`Company`,`System`) VALUES (1 , 'ObjectNAME', -2, 'OBJECTID', 'orbit', 'epoch', 1233.123, 123.123, 123123.2, 'Decay Date', 123.1, 0, 123.123, 123.123, 123.123, 123.123, 23123.123, 123.123, 'OBJECTTYPE', 'RCS_SIZE', 'US', 'LaunchDate', 'SITE', 'CLASSIFICATION_TYPE', 2222222, 'TLELINE0', 'TLELINE1', 'TLELINE2','SENSOR', 0239485, 0, 999, 2, 'Comment', 'CREATION DATE', 'ORGINATOR', 'CENTER NAME', 'REF FRAME', 'TIMESYSTEM', 'MEAN ELEMENT THEORY', 0987234, 'Company', 'System');"
         "INSERT INTO spaceship.satcat (`ARG_OF_PERICENTER`, `MEAN_MOTION`, `ECCENTRICITY`,`S_No`, `OBJECT_NAME`, `NORAD_CAT_ID`,`OBJECT_ID`,`ORBIT`,`EPOCH`,`INCLINATION`,`RA_OF_ASC_NODE`,`MEAN_ANOMALY`,`DECAY_DATE`,`REV_AT_EPOCH`,`BSTAR`,`MEAN_MOTION_DOT`,`MEAN_MOTION_DDOT`,`SEMIMAJOR_AXIS`,`PERIOD`,`APOAPSIS`,`PERIAPSIS`,`OBJECT_TYPE`,`RCS_SIZE`, `COUNTRY_CODE`,`LAUNCH_DATE`,`SITE`,`CLASSIFICATION_TYPE`,`GP_ID`,`TLE_LINE0`,`TLE_LINE1`,`TLE_LINE2`,`Sensor`,`RandomINT`,`EPHEMERIS_TYPE`,`ELEMENT_SET_NO`,`CCSDS_OMM_VERS`,`COMMENT`,`CREATION_DATE`,`ORIGINATOR`,`CENTER_NAME`,`REF_FRAME`,`TIME_SYSTEM`,`MEAN_ELEMENT_THEORY`,`FILE`,`Company`,`System`) VALUES ( "+data.ARG_OF_PERICENTER+", "+data.MEAN_MOTION+", "+data.ECCENTRICITY+", NULL,'" + data.OBJECT_NAME + "', "+data.NORAD_CAT_ID+", '" + data.OBJECT_ID + "', '" + data.ORBIT + "', '" + data.EPOCH + "', " + data.INCLINATION + ", " + data.RA_OF_ASC_NODE + ", " + data.MEAN_ANOMALY + ", '" + data.DECAY_DATE + "', " + data.REV_AT_EPOCH + ", " + data.BSTAR + ", " + data.MEAN_MOTION_DOT + ", " + data.MEAN_MOTION_DDOT + ", " + data.SEMIMAJOR_AXIS + ", " + data.PERIOD + ", " + data.APOAPSIS + ", " + data.PERIAPSIS + ", '" + data.OBJECT_TYPE + "', '" + data.RCS_SIZE + "', '" + data.COUNTRY_CODE + "', '" + data.LAUNCH_DATE + "', '" + data.SITE + "', '" + data.CLASSIFICATION_TYPE + "', " + data.GP_ID + ", '" + data.TLE_LINE0 + "', '" + data.TLE_LINE1 + "', '" + data.TLE_LINE2 + "', '" + data.Sensor + "', " + data.RandomINT + ", 0, " + data.ELEMENT_SET_NO + ", " + data.CCSDS_OMM_VERS + ", '" + data.COMMENT + "', '" + data.CREATION_DATE + "', '" + data.ORIGINATOR + "', '" + data.CENTER_NAME + "', '" + data.REF_FRAME + "', '" + data.TIME_SYSTEM + "', '" + data.MEAN_ELEMENT_THEORY + "', " + data.FILE + ", '" + data.Company + "', '" + data.System + "');"
    ).subscribe((sats: any) => {
      // console.log(sats);
    })
  }

  onUpdateClick() {
    for (let i = 0; i < this.sat.length; i++) {
      if (this.sat[i].ELEMENT_SET_NO != "999") {
        this.insertOneSat(this.sat[i]);
        this.deleteSat(this.sat[i]);
      } 
    }
    this.satOnPage = [];
    this.sat = [];
    this.getUpdateSats();
  }

  getUpdateSats() {
    this.tooUpdateSize = 0;
    this.sat = [];
    this.satOnPage = [];
    this.apiService.readParams('SELECT * FROM spaceship.`update` ORDER BY LAUNCH_DATE DESC;').subscribe((sats: SAT[]) => {
      for (var item in sats) {
        this.sat.push(sats[item]);
        this.tooUpdateSize++;
      }
      this.slicePerPage();
    })
  }

  slicePerPage() {
    for (let i = this.pageNumber * this.itemsPerPage;
      i < (this.pageNumber * this.itemsPerPage) + this.itemsPerPage;
      i++) {
      if (this.sat[i] == undefined) {
        break;
      }
      this.satOnPage.push(this.sat[i]);

    }
    this.numberOfPages = this.sat.length / this.itemsPerPage;
    this.numberOfPages = Math.trunc(this.numberOfPages);
    this.displayNumberOfPages = this.numberOfPages + 1;
  }

  click1() {
    this.pageNumber = 0;
    this.DisplayPageNumber = 1;
    this.satOnPage = [];
    this.slicePerPage();
  }

  click2() {
    if (this.pageNumber >= this.numberOfPages - 10) {
      this.pageNumber = this.numberOfPages;
      alert("Cannot Exceed Final Page \nPage: " + this.DisplayPageNumber);
    } else {
      this.pageNumber = this.pageNumber + 10;
    }
    this.DisplayPageNumber = this.pageNumber + 1;
    this.satOnPage = [];
    this.slicePerPage();
  }

  clickLast() {
    this.numberOfPages = this.sat.length / this.itemsPerPage;
    this.numberOfPages = Math.trunc(this.numberOfPages);
    this.pageNumber = this.numberOfPages;
    this.DisplayPageNumber = this.pageNumber + 1;
    this.satOnPage = [];
    this.slicePerPage();
  }

  clickPrevious() {
    if (this.pageNumber <= 0) { }
    else {
      this.pageNumber--;
      this.DisplayPageNumber--;
      this.satOnPage = [];
      this.slicePerPage();
    }
  }

  clickNext() {
    if (this.pageNumber >= this.numberOfPages) {
      this.pageNumber = this.numberOfPages;
      this.DisplayPageNumber = this.pageNumber + 1;
      alert("Cannot Exceed Final Page \nPage: " + this.DisplayPageNumber);
    } else {
      this.pageNumber++;
      this.DisplayPageNumber++;
    }
    this.satOnPage = [];
    this.slicePerPage();
  }

  clearPageV2() {
    this.satOnPage = [];
    // this.sat = [];
  }


}
