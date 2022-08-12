import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { SAT } from '../SAT';
import { NgForm } from '@angular/forms';
import { downloadService } from '../download.service';
import { Router } from '@angular/router';
import { electronService } from '../electron.service';
// import { exec } from 'child_process';
// const powershell = window.require('node-powershell');
// import { PowerShell } from 'node-powershell';

@Component({
  selector: 'app-sat-detail-layout',
  templateUrl: './sat-detail-layout.component.html',
  styleUrls: ['./sat-detail-layout.component.css']
})
export class SatDetailLayoutComponent implements OnInit {
  noModfullSatData: SAT[] = [];
  sat: SAT[] = [];
  satOnPage: SAT[] = [];
  tempForSearch: SAT[] = [];
  noModCompanys: SAT[] = [];
  companys: SAT[] = [];
  companysOnPage: SAT[] = [];
  initialSatelliteSetBeforeOrbitalSorting: SAT[] = [];

  orbitRealmChecks: (boolean | string)[][] =
    [
      [false, "LEO"],
      [false, "MEO"],
      [false, "GEO"],
      [false, "HEO"],
      [false, "SuperSync"],
      [false, "Circ"],
      [false, "Polar"],
      [false, "SSO"],
      [false, "Tundra"],
      [false, "Molniya"]
    ];

  firstOrbitalSort: number = 0;
  pageNumber: number = 0;
  itemsPerPage: number = 18;
  numberOfPages: number = 100;
  displayNumberOfPages: number = this.numberOfPages + 1;
  DisplayPageNumber: number = 1;
  requestLimit: number = 0;
  satSize: number = -1;
  reversed: number = 0; // this is used in one method sortingCompaniesAndSatellites() and is for making sure companys is only reversed once
  sortSWITCH: number = 0; // used in all sorting methods to switch sorting in multiple directions
  totalSystemCount: number = 0;
  totalCountryCount: number = 0;
  globalVar: number = 0;

  constructor(private apiService: ApiService,
    private appService: downloadService,
    private route: Router,
    private electronService: electronService
  ) { }

  ngOnInit(): void {
    this.getAllSats();
    this.globalVar = this.apiService.getglobalvar();
  }

  test() {
    console.log(this.electronService.getIpcRenderer());
  }
  // ERROR ON RESET WIERD STUFF WITH SATELLITES HAPPENS

  getCompanysAndSystemsPerSat() {
    this.apiService.readCompanysParams("SELECT DISTINCT(Company) FROM satcat").subscribe((sats: SAT[]) => {
      for (var item in sats) {
        if (sats[item].Company == null) {
          sats[item].Company = "Others";
        }
        this.companys.push(sats[item]);
        this.noModCompanys.push(sats[item]);
      }
      this.sortingCompaniesAndSatellites();
    })
  }
  
  sortingCompaniesAndSatellites() {
    this.totalSystemCount = 0;
    for (var i in this.companys) {
      let satPerCompanyCount = 0;
      let systemPerCompany = 0;
      let temp = 0;
      for (var p in this.sat) {
        if (this.sat[p].Company != null) { temp++; }
        if (this.companys[i].Company == this.sat[p].Company) { // count sats per company
          this.companys[i].NORAD_CAT_ID = this.sat[p].NORAD_CAT_ID; // data binding accordion 
          satPerCompanyCount++;
          this.companys[i].COMMENT = satPerCompanyCount.toString();
          this.companys[i].COUNTRY_CODE = this.sat[p].COUNTRY_CODE;
          if (this.sat[p].System != null) {
            if (this.companys[i].System == null) {
              this.companys[i].System = this.sat[p].System;
              systemPerCompany = 1;
              this.companys[i].CENTER_NAME = systemPerCompany.toString();
              this.totalSystemCount++;
            } else if (!(this.companys[i].System.includes(this.sat[p].System))) {
              let str = this.companys[i].System;
              str = str.concat(", ", this.sat[p].System);
              this.companys[i].System = str;
              systemPerCompany++;
              this.companys[i].CENTER_NAME = systemPerCompany.toString()
              this.totalSystemCount++;
            }
          } else {
            // USSR bug where company is filled out but no system
            // or OTHERS
          }
        }
      }
      if (this.companys[i].Company.includes("Others")) {
        this.companys[i].COMMENT = (this.sat.length - temp).toString();
      }
    }
    if (this.reversed == 0) {
      this.companys.reverse(); // Otherwise "Others" would be on top
      this.companysOnPage.reverse();
      let satholder = this.companys[this.companys.length-1];
      this.companys.pop();
      this.sortSWITCH == 0 ? this.companys.sort((a, b) => ((a.Company) > (b.Company)) ? 1 : -1) :
        this.companys.sort((a, b) => ((a.Company) > (b.Company)) ? 1 : -1);
      this.companys.push(satholder); 
    }

    //country count
    let str = "";
    this.totalCountryCount = 0;
    for (var item in this.sat) {
      if (this.sat[item].COUNTRY_CODE != null) {
        if (str == "") {
          str = str.concat(this.sat[item].COUNTRY_CODE);
          this.totalCountryCount = 1;
        } else if(!(str.includes(this.sat[item].COUNTRY_CODE))) {
          str = str.concat(", ", this.sat[item].COUNTRY_CODE);
          this.totalCountryCount++;
        }
      }
    }
    this.slicePerPage();
  }

  getAllSats() {
    this.sat = [];
    this.satSize = 0;
    this.noModfullSatData = [];
    for (var item in this.apiService.globalSats) {
      this.sat.push(this.apiService.globalSats[item]);
      this.noModfullSatData.push(this.apiService.globalSats[item]);
      this.satSize++;
    }
      this.getCompanysAndSystemsPerSat();
  }

  reset() {
    this.pageNumber = 0;
    this.satSize = 0;
    this.DisplayPageNumber = 1;
    this.tempForSearch = [];
    this.clearSAT();
    this.clearPage();
    for (let i = 0; i < this.orbitRealmChecks.length; i++) {
      this.orbitRealmChecks[i][0] = false;
    }
    this.getAllSats();
  }

  clearSAT() {
    this.sat = [];
  }
  // sets companysOnPage and companys to undefined
  clearPage() {
    this.satOnPage = [];
    this.companysOnPage = [];
    this.companys = [];
  }

  IDSort() {
    this.clearPage();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? this.sat.sort((a, b) => (parseInt(a.NORAD_CAT_ID) > parseInt(b.NORAD_CAT_ID)) ? 1 : -1) :
      this.sat.sort((a, b) => (parseInt(a.NORAD_CAT_ID) < parseInt(b.NORAD_CAT_ID)) ? 1 : -1);
    this.getCompanysAndSystemsPerSat();
 
  } 

  NameSort() {
    this.clearPage();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? this.sat.sort((a, b) => (a.OBJECT_NAME > b.OBJECT_NAME) ? 1 : -1) :
      this.sat.sort((a, b) => (a.OBJECT_NAME < b.OBJECT_NAME) ? 1 : -1);
    this.getCompanysAndSystemsPerSat();
  }

  LaunchSort() {
    this.clearPage();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? this.sat.sort((a, b) => (a.LAUNCH_DATE > b.LAUNCH_DATE) ? 1 : -1) :
      this.sat.sort((a, b) => (a.LAUNCH_DATE < b.LAUNCH_DATE) ? 1 : -1);
    this.getCompanysAndSystemsPerSat();
  }

  CountrySort() {
    this.clearPage();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? (this.sat.sort((a, b) => (a.COUNTRY_CODE > b.COUNTRY_CODE) ? 1 : -1)) :
      this.sat.sort((a, b) => (a.COUNTRY_CODE < b.COUNTRY_CODE) ? 1 : -1); 
    this.getCompanysAndSystemsPerSat();
  }

  apoapsisSort() {
    this.clearPage();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? this.sat.sort((a, b) => (parseInt(a.APOAPSIS) > parseInt(b.APOAPSIS)) ? 1 : -1) :
      this.sat.sort((a, b) => (parseInt(a.APOAPSIS) < parseInt(b.APOAPSIS)) ? 1 : -1);
    this.getCompanysAndSystemsPerSat();
  }

  argOfPericenterSort() {
    this.clearPage();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? this.sat.sort((a, b) => (parseFloat(a.ARG_OF_PERICENTER) > parseFloat(b.ARG_OF_PERICENTER)) ? 1 : -1) :
      this.sat.sort((a, b) => (parseFloat(a.ARG_OF_PERICENTER) < parseFloat(b.ARG_OF_PERICENTER)) ? 1 : -1);
    this.getCompanysAndSystemsPerSat();
  }

  eccentricitySort() {
    this.clearPage();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? this.sat.sort((a, b) => (parseFloat(a.ECCENTRICITY) > parseFloat(b.ECCENTRICITY)) ? 1 : -1) :
      this.sat.sort((a, b) => (parseFloat(a.ECCENTRICITY) < parseFloat(b.ECCENTRICITY)) ? 1 : -1);
    this.getCompanysAndSystemsPerSat();
  }

  inclinationSort() {
    this.clearPage();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? this.sat.sort((a, b) => (parseFloat(a.INCLINATION) > parseFloat(b.INCLINATION)) ? 1 : -1) :
      this.sat.sort((a, b) => (parseFloat(a.INCLINATION) < parseFloat(b.INCLINATION)) ? 1 : -1);
    this.getCompanysAndSystemsPerSat();
  }

  meanAnomalySort() {
    this.clearPage();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? this.sat.sort((a, b) => (parseFloat(a.MEAN_ANOMALY) > parseFloat(b.MEAN_ANOMALY)) ? 1 : -1) :
      this.sat.sort((a, b) => (parseFloat(a.MEAN_ANOMALY) < parseFloat(b.MEAN_ANOMALY)) ? 1 : -1);
    this.getCompanysAndSystemsPerSat();
  }

  periapsisSort() {
    this.clearPage();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? this.sat.sort((a, b) => (parseFloat(a.PERIAPSIS) > parseFloat(b.PERIAPSIS)) ? 1 : -1) :
      this.sat.sort((a, b) => (parseFloat(a.PERIAPSIS) < parseFloat(b.PERIAPSIS)) ? 1 : -1);
    this.getCompanysAndSystemsPerSat();
  }

  revAtEpochSort() {
    this.clearPage();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? this.sat.sort((a, b) => (parseFloat(a.REV_AT_EPOCH) > parseFloat(b.REV_AT_EPOCH)) ? 1 : -1) :
      this.sat.sort((a, b) => (parseFloat(a.REV_AT_EPOCH) < parseFloat(b.REV_AT_EPOCH)) ? 1 : -1);
    this.getCompanysAndSystemsPerSat();
  }

  semiMajorAxisSort() {
    this.clearPage();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? this.sat.sort((a, b) => (parseFloat(a.SEMIMAJOR_AXIS) > parseFloat(b.SEMIMAJOR_AXIS)) ? 1 : -1) :
      this.sat.sort((a, b) => (parseFloat(a.SEMIMAJOR_AXIS) < parseFloat(b.SEMIMAJOR_AXIS)) ? 1 : -1);
    this.getCompanysAndSystemsPerSat();
  }

  minMaxInc(min: number, max: number, val: number) {
    if (val >= min && val <= max) { 
      this.satSize++;
      return 1;
    } else {
      return 0;
    }
  }

  minMaxAlgo(min: number, max: number, i: number) {
    this.satSize = 0;
    for (var item in this.sat) {
      this.tempForSearch.push(this.sat[item]);
    }
    this.sat = [];
    for (var item in this.tempForSearch) {
      if (i == 0) {
        if (this.minMaxInc(min, max, parseFloat(this.tempForSearch[item].PERIAPSIS)) == 1) {
          this.sat.push(this.tempForSearch[item]);
        }
      } else if (i == 1) {
        if (this.minMaxInc(min, max, parseFloat(this.tempForSearch[item].INCLINATION)) == 1) {
          this.sat.push(this.tempForSearch[item]);
        }
      } else if (i == 2) {
        if (this.minMaxInc(min, max, parseFloat(this.tempForSearch[item].ECCENTRICITY)) == 1) {
          this.sat.push(this.tempForSearch[item]);
        }
      } else if (i == 3) {
        if (this.minMaxInc(min, max, parseFloat(this.tempForSearch[item].SEMIMAJOR_AXIS)) == 1) {
          this.sat.push(this.tempForSearch[item]);
        }
      } else if (i == 4) {
        if (this.minMaxInc(min, max, parseFloat(this.tempForSearch[item].APOAPSIS)) == 1) {
          this.sat.push(this.tempForSearch[item]);
        }
      } else if (i == 5) {
        if (this.minMaxInc(min, max, parseFloat(this.tempForSearch[item].ARG_OF_PERICENTER)) == 1) {
          this.sat.push(this.tempForSearch[item]);
        }
      } else if (i == 6) {
        if (this.minMaxInc(min, max, parseFloat(this.tempForSearch[item].REV_AT_EPOCH)) == 1) {
          this.sat.push(this.tempForSearch[item]);
        }
      } else if (i == 7) {
        if (this.minMaxInc(min, max, parseFloat(this.tempForSearch[item].MEAN_ANOMALY)) == 1) {
          this.sat.push(this.tempForSearch[item]);
        }
      } 
    }
    this.tempForSearch = [];
  }

  minMaxSorting(data: NgForm) {
    if (data == null) {
      return;
    }
    this.clearPage();
    if (data.value.periapsisMin != null || data.value.periapsisMax != null) {
      if (data.value.periapsisMin == null) { data.value.periapsisMin = 0; }         //          Wierd NgForm bug where the first submission of the form is 
      if (data.value.periapsisMax == null) { data.value.periapsisMax = 100000000; } //          blank ("") and anything after the first submission is (null)
      if (data.value.periapsisMax.length != 0 || data.value.periapsisMin.length != 0) {  //     Hint why if periapsis null set big int
          this.minMaxAlgo(data.value.periapsisMin, data.value.periapsisMax, 0);
      }
    }
    if (data.value.inclinationMax != null || data.value.inclinationMin != null) {
      if (data.value.inclinationMin == null) { data.value.inclinationMin = 0; }
      if (data.value.inclinationMax == null) { data.value.inclinationMax = 100000000; } 
      if (data.value.inclinationMax.length != 0 || data.value.inclinationMin.length != 0) {
          this.minMaxAlgo(data.value.inclinationMin, data.value.inclinationMax, 1);
      }
    }
    if (data.value.eccentricityMax != null || data.value.eccentricityMin != null) {
      if (data.value.eccentricityMin == null) { data.value.eccentricityMin = 0; }
      if (data.value.eccentricityMax == null) { data.value.eccentricityMax = 100000000; } 
      if (data.value.eccentricityMax.length != 0 || data.value.eccentricityMin.length != 0) {
        this.minMaxAlgo(data.value.eccentricityMin, data.value.eccentricityMax, 2);
      }
    }
    if (data.value.semimajorAxisMax != null || data.value.semimajorAxisMin != null) {
      if (data.value.semimajorAxisMin == null) { data.value.semimajorAxisMin = 0; }
      if (data.value.semimajorAxisMax == null) { data.value.semimajorAxisMax = 100000000; } 
      if (data.value.semimajorAxisMax.length != 0 || data.value.semimajorAxisMin.length != 0) {
        this.minMaxAlgo(data.value.semimajorAxisMin, data.value.semimajorAxisMax, 3);
      }
    }
    if (data.value.apoapsisMax != null || data.value.apoapsisMin != null) {
      if (data.value.apoapsisMin == null) { data.value.apoapsisMin = 0; }
      if (data.value.apoapsisMax == null) { data.value.apoapsisMax = 100000000; } 
      if (data.value.apoapsisMax.length != 0 || data.value.apoapsisMin.length != 0) {
        this.minMaxAlgo(data.value.apoapsisMin, data.value.apoapsisMax, 4);
      }
    }
    if (data.value.argOfPericenterMax != null || data.value.argOfPericenterMin != null) {
      if (data.value.argOfPericenterMin == null) { data.value.argOfPericenterMin = 0; }
      if (data.value.argOfPericenterMax == null) { data.value.argOfPericenterMax = 100000000; } 
      if (data.value.argOfPericenterMax.length != 0 || data.value.argOfPericenterMin.length != 0) {
        this.minMaxAlgo(data.value.argOfPericenterMin, data.value.argOfPericenterMax, 5);
      }
    }
    if (data.value.revAtEpochMax != null || data.value.revAtEpochMin != null) {
      if (data.value.revAtEpochMin == null) { data.value.revAtEpochMin = 0; }
      if (data.value.revAtEpochMax == null) { data.value.revAtEpochMax = 100000000; } 
      if (data.value.revAtEpochMax.length != 0 || data.value.revAtEpochMin.length != 0) {
        this.minMaxAlgo(data.value.revAtEpochMin, data.value.revAtEpochMax, 6);
      }
    }
    if (data.value.meanAnomalyMax != null || data.value.meanAnomalyMin != null) {
      if (data.value.meanAnomalyMin == null) { data.value.meanAnomalyMin = 0; }
      if (data.value.meanAnomalyMax == null) { data.value.meanAnomalyMax = 100000000; } 
      if (data.value.meanAnomalyMax.length != 0 || data.value.meanAnomalyMin.length != 0) {
        this.minMaxAlgo(data.value.meanAnomalyMin, data.value.meanAnomalyMax, 7);
      }
    }
    this.getCompanysAndSystemsPerSat();
    data.resetForm();
  }

  orbitalCategorySorting(category: string) {
    if (this.firstOrbitalSort == 0) { // saving the state of the set before orbital parameters
      for (var item in this.sat) {
        this.initialSatelliteSetBeforeOrbitalSorting.push(this.sat[item]);
        this.firstOrbitalSort = 1;
      }
    }
    let booleanCount = 0
    this.clearPage();
    this.satSize = 0;
    for (var item in this.sat) {
      this.tempForSearch.push(this.sat[item]);
    }
    this.sat = [];
    this.satSize = 0;
    this.sat = [];
    this.satOnPage = [];
    for (let p = 0; p < this.orbitRealmChecks.length; p++) {
      // var str = this.orbitRealmChecks[p][1].toString(); var bool = this.orbitRealmChecks[p][0];
      if (this.orbitRealmChecks[p][0] == true) {
        booleanCount++;
        for (var item in this.initialSatelliteSetBeforeOrbitalSorting) {
          if (this.initialSatelliteSetBeforeOrbitalSorting[item].ORBIT.includes(this.orbitRealmChecks[p][1].toString())) {
            this.sat.push(this.initialSatelliteSetBeforeOrbitalSorting[item]);
            this.satSize++;
          }
        }
      }
    }
    // Condition for all unchecked or all checked
    if (booleanCount == 0 || booleanCount == 10) {
      if (this.satSize == 0 && (booleanCount != 0)){
        this.sat = [];
        this.satSize = 0;
        this.firstOrbitalSort = 1;
        this.getCompanysAndSystemsPerSat();
        return;
      }
      for (var item in this.initialSatelliteSetBeforeOrbitalSorting) {
        this.sat.push(this.initialSatelliteSetBeforeOrbitalSorting[item]);
        this.satSize++;
      }
      this.initialSatelliteSetBeforeOrbitalSorting = [];
      this.firstOrbitalSort = 0;
    } else { // probably added duplicates 
      // Remove duplicates 
      this.sat = [...this.sat.reduce((map, obj) => map.set(parseInt(obj.NORAD_CAT_ID), obj), new Map()).values()];
      this.satSize = this.sat.length;
    }
    this.tempForSearch = [];
    this.getCompanysAndSystemsPerSat();
  }

  search(data: NgForm) {
    if (data.value.search == null || data.value.search == " ") {
      return;
    }
    this.clearPage();
    var str = data.value.search;
    if (str.includes(",")) {
      let arr = str.split(",");
      for (var item in arr) {
        arr[item] = arr[item].trim();
      }
      this.findMultiples(arr);
    } else {
      this.findName(data.value.search);
    }

    // this.slicePerPage();
    data.resetForm();
  }

  isNumeric(num: number) {
    return !isNaN(num)
   }

  findMultiples(arr: string[]) {
    this.satSize = 0;
    this.sat = [];

    for (var p in arr) {
      for (var item in this.noModfullSatData) {
        if (this.isNumeric(parseInt(arr[p]))==true) {
          if (arr[p] == this.noModfullSatData[item].NORAD_CAT_ID) {
            this.satSize++;
            this.sat.push(this.noModfullSatData[item]);
          } 
        } else { // a system
          arr[p] = arr[p].toLowerCase();
          if (this.noModfullSatData[item].OBJECT_NAME.toLowerCase().includes(arr[p])) {
            this.satSize++;
            this.sat.push(this.noModfullSatData[item]);
          }
        }
      }
    }

    this.getCompanysAndSystemsPerSat();
  }

  findName(str: string) {
    this.satSize = 0;
    str = str.toLowerCase();
    this.sat = [];
    if (this.isNumeric(parseInt(str)) != false) {
      for (var item in this.noModfullSatData) {
        if (parseInt(this.noModfullSatData[item].NORAD_CAT_ID) == parseInt(str)) {
          this.sat.push(this.noModfullSatData[item]);
          this.satSize++;
        }
      }
    } else {
      for (var item in this.noModfullSatData) {
        if (this.noModfullSatData[item].OBJECT_NAME.toLowerCase().includes(str)) {
          this.sat.push(this.noModfullSatData[item]);
          this.satSize++;
          continue;
        } else if (this.noModfullSatData[item].System != null) {
          if (this.noModfullSatData[item].System.toLowerCase().includes(str)) {
            this.sat.push(this.noModfullSatData[item]);
            this.satSize++;
            continue;
          }
        }
        //ability to search by launch date has yet to be implemented
        // error on isNumeric check concating ####-##-## assuming ####
        // thinking launch date is a number
        // else if (this.noModfullSatData[item].LAUNCH_DATE.includes(str)) {
          // this.sat.push(this.noModfullSatData[item]);
          // this.satSize++;
        // }
      }
    }
    this.getCompanysAndSystemsPerSat();
    this.tempForSearch = [];
  }

  slicePerPage() {
      for (let i = this.pageNumber * this.itemsPerPage;
        i < (this.pageNumber * this.itemsPerPage) + this.itemsPerPage;
        i++) {
        if (this.companys[i] == undefined) {
          break;
        }
        this.companysOnPage.push(this.companys[i]);
      }

    for (var item in this.sat) {
      this.satOnPage.push(this.sat[item]);
    }
    this.numberOfPages = this.companys.length / this.itemsPerPage;
    this.numberOfPages = Math.trunc(this.numberOfPages);
    this.displayNumberOfPages = this.numberOfPages + 1;
  }

  click1() {
    this.pageNumber = 0;
    this.DisplayPageNumber = 1;
    this.companysOnPage = [];
    this.slicePerPage();
  }

  click2() {
    if (this.pageNumber >= this.numberOfPages-10) {
      this.pageNumber = this.numberOfPages;
      alert("Cannot Exceed Final Page \nPage: " + this.DisplayPageNumber);
    } else {
      this.pageNumber = this.pageNumber + 10;
    }
    this.DisplayPageNumber = this.pageNumber + 1;
    this.companysOnPage = [];
    this.slicePerPage();
  }

  clickLast() {
    this.numberOfPages = this.companys.length / this.itemsPerPage;
    this.numberOfPages = Math.trunc(this.numberOfPages);
    this.pageNumber = this.numberOfPages;
    this.DisplayPageNumber = this.pageNumber + 1;
    this.companysOnPage = [];
    this.slicePerPage();
  }

  clickPrevious() {
    if (this.pageNumber <= 0) { }
    else {
      this.pageNumber--;
      this.DisplayPageNumber--;
      this.companysOnPage = [];
      this.slicePerPage();
    }
  }

  clickNext() {
    if (this.pageNumber >= this.numberOfPages) {
      this.pageNumber = this.numberOfPages;
      this.DisplayPageNumber = this.pageNumber + 1;
      alert("Cannot Exceed Final Page \nPage: " +this.DisplayPageNumber);
    } else {
      this.pageNumber++;
      this.DisplayPageNumber++;
    }
    this.companysOnPage = [];
    this.slicePerPage();
  }

  clearPageV2() {
    this.companysOnPage = [];
    this.sat = [];
  }

  download(str: string) {
    // this.clearPage();
    // let temp = this.itemsPerPage;
    // this.itemChange(this.satSize);
    // this.slicePerPage();
    if (str == 'csv') {
      this.appService.downloadFile(this.sat, this.satSize + " - " + Date());
    } else if (str == 'json') {
      this.appService.downloadJson(this.sat, this.satSize + " - " + Date());
    } else if (str == 'text') {
      this.appService.downloadText(this.sat, this.satSize + " - " + Date());
    } else if (str == 'stk') {
      alert("Do you want STK to load the export?");
      this.appService.downloadFileForSTK(this.sat, "UpdateSatData");
      this.powershelSpawn();
    }
    // this.clearPage();
    // this.itemChange(temp);
    // this.slicePerPage();
    // temp = 0;
  }

  createRouteToEdit() {
    if (this.globalVar != 1) { return }
   var result = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for (var i = 0; i < 1000; i++) {
     result += characters.charAt(Math.floor(Math.random() *
       charactersLength));
    }

   this.route.navigate(['EditCriteria/' + result]);
   // this.route.navigate(['EditCriteria']);
  }

  // C:\\Users\\1170692\\Documents\\excelToMatlab.ps1
  powershelSpawn() {
   /* var s = require("child_process")
    var child;
    child = s.spawn("powershell.exe", ["C:\\Users\\1170692\\Documents\\excelToMatlab.ps1"]);
    child.stdout.on("data", function (data: string) {
      console.log("Powershell Data: " + data);
    });
    child.stderr.on("data", function (data: string) {
      console.log("Powershell Errors: " + data);
    });
    child.on("exit", function () {
      console.log("Powershell Script finished");
    });
    child.stdin.end(); //end input
    */
    // const  exec  = require('child_process').exec;
    // exec('C:\\Users\\1170692\\Documents\\excelToMatlab.ps1', { 'shell': 'powershell.exe' }, (error: any, stdout: any, stderr: any) => {
      // do whatever with stdout
      
    // })
    // console.log(fetch("C:/Users/1170692/source/repos/AngularWorkspace/testing-project/src/app/BackEnd/api/PowershellCommand/powershell-matlab.php"));
    // console.log(this.apiService.powershellMatlabCommand());
    this.electronService.powershellMatlabCommand();
  }

} 
