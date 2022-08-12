import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { SAT } from '../SAT';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent implements OnInit {
  sat: SAT[] = []; // raw data un modified dont mess with this
  companys: SAT[] = [];
  companysOnPage: SAT[] = [];
  tooUpdate: SAT[] = [];

  tooUpdateUndefinedCheck: number = 0;
  tooUpdateSize: number = 0;
  satSize: number = 0;
  totalCountryCount: number = 0;
  totalSystemCount: number = 0;
  reversed: number = 0;
  pageNumber: number = 0;
  DisplayPageNumber: number = 0;
  itemsPerPage: number = 18;
  numberOfPages: number = 100;
  displayNumberOfPages: number = 1;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getAllSats();
    this.getUpdateSats();
  }

  getCompanysAndSystemsPerSat() {
    this.apiService.readParams("SELECT DISTINCT(Company) FROM satcat").subscribe((sats: SAT[]) => {
      for (var item in sats) {
        if (sats[item].Company == null) {
          sats[item].Company = "Others";
        }
        this.companys.push(sats[item]);
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
      // this.reversed = 1;
    }
    //country count
    let str = "";
    this.totalCountryCount = 0;
    for (var item in this.sat) {
      if (this.sat[item].COUNTRY_CODE != null) {
        if (str == "") {
          str = str.concat(this.sat[item].COUNTRY_CODE);
          this.totalCountryCount = 1;
        } else if (!(str.includes(this.sat[item].COUNTRY_CODE))) {
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
    for (var item in this.apiService.globalSats) {
      this.sat.push(this.apiService.globalSats[item]);
      this.satSize++;
    }
    if (this.satSize == 0) {
      setTimeout(()=>this.wait(), 5000);
    }
    if (this.satSize == 0) {
      this.apiService.LaunchSort().subscribe((sats: SAT[]) => {
        this.apiService.globalSats = [];
        for (var item in sats) {
          this.apiService.globalSats.push(sats[item]);
        }
        for (var item in this.apiService.globalSats) {
          this.sat.push(this.apiService.globalSats[item]);
          this.satSize++;
        }
      })
    }
   
    this.getCompanysAndSystemsPerSat();
  }

  wait() {
    // alert("New data pull. Please Wait.");
  }

  getUpdateSats() {
    this.tooUpdateSize = 0;
    this.apiService.readParams('SELECT * FROM spaceship.update ORDER BY LAUNCH_DATE DESC LIMIT 8;').subscribe((sats: SAT[]) => {
      for (var item in sats) {
        this.tooUpdate.push(sats[item]);
        this.tooUpdateSize++;
      }
      this.tooUpdateUndefinedCheck = 1;
      this.getCompanysAndSystemsPerSat();
    })
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
    this.numberOfPages = this.companys.length / this.itemsPerPage;
    this.numberOfPages = Math.trunc(this.numberOfPages);
    this.displayNumberOfPages = this.numberOfPages + 1;
  }

}
