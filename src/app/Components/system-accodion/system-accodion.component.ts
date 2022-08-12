import { Component, OnInit, Input } from '@angular/core';
import { SAT } from '../../SAT';
import { ApiService } from '../../api.service';
import { NgForm } from '@angular/forms';
import { downloadService } from '../../download.service';

@Component({
  selector: 'app-system-accodion',
  templateUrl: './system-accodion.component.html',
  styleUrls: ['./system-accodion.component.css']
})
export class SystemAccodionComponent implements OnInit {
  @Input("data")
    data: any;
  @Input("fullSatData")
    fullSatData!: SAT[];
  @Input("system")
    system!: string;

  dataSetThroughComponent: SAT[] = [];
  satOnPage: SAT[] = [];
  tempForSearch: SAT[] = [];
  satBySystem: SAT[] = [];

  satellitesPerSystem: number = 0;
  randomNumber: number = 0;
  pageNumber: number = 0;
  itemsPerPage: number = 20;
  numberOfPages: number = 100;
  displayNumberOfPages: number = 0;
  DisplayPageNumber: number = 1;
  requestLimit: number = 0;
  satSize: number = -1;
  sortSWITCH: number = 0;

  constructor(private apiService: ApiService, private appService: downloadService) { }

  ngOnInit(): void {
    this.randomNumber = Math.floor(Math.random() * 10000000);
    this.systemMatch();
    this.slicePerPage();
    // this.LaunchSort();
  }

  // Matches Company of component given with fulldata set
  // Pushes the matches top dataSetThroughComponent
  // dataSetThroughComponent pushes to satOnPage for display
  systemMatch() {
    for (var item in this.fullSatData) {
      if (this.data.Company != 'Others') {
        if (this.fullSatData[item].System != null) {
          if (this.fullSatData[item].System.includes(this.system)) {
            this.dataSetThroughComponent.push(this.fullSatData[item]);
            this.satellitesPerSystem++;
          }
        }
      } else {
        if ((this.fullSatData[item].System == null) && this.fullSatData[item].Company == null) {
          this.dataSetThroughComponent.push(this.fullSatData[item]);
          this.satellitesPerSystem++;
        }
      }
    }
  }

  getAllSats() {
    this.satSize = 0;
    this.satellitesPerSystem = 0;
    this.apiService.readSats().subscribe((sats: SAT[]) => {
      for (var item in sats) {
        this.dataSetThroughComponent.push(sats[item]);
        this.satSize++;
      }
      this.slicePerPage();
    })
  }

  reset() {
    this.pageNumber = 0;
    this.satellitesPerSystem = 0;
    this.DisplayPageNumber = 1;
    this.itemsPerPage = 20;
    this.tempForSearch = [];
    this.dataSetThroughComponent = [];
    this.systemMatch();
    this.clearPage();
    this.slicePerPage();
    // this.LaunchSort();
    // this.getAllSats();
  }

  itemChange(num: number) {
    this.itemsPerPage = num;
  }

  clearSAT() {
    this.dataSetThroughComponent = [];
  }

  clearPage() {
    this.satOnPage = [];
  }

  clearFullSatData() {
    this.fullSatData = [];
  }

  // all sorting functions with parseInt() (all integer sorting)
  // does not account for 4th and sometimes 3rd decimal places in the comparison
  // I believe its something to do with parseInt()
  // lol duh use parseFloat

  IDSort() {
    this.satSize = 0;
    // this.satellitesPerSystem = 0;
    // this.clearSAT();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? (this.dataSetThroughComponent.sort((a, b) => (parseFloat(a.NORAD_CAT_ID) > parseFloat(b.NORAD_CAT_ID)) ? 1 : -1)) :
      this.dataSetThroughComponent.sort((a, b) => (parseFloat(a.NORAD_CAT_ID) < parseFloat(b.NORAD_CAT_ID)) ? 1 : -1); 
    // this.systemMatch();
    this.clearPage();
    this.slicePerPage();
  }

  NameSort() {
    this.satSize = 0;
    // this.satellitesPerSystem = 0;
    // this.clearSAT();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? (this.dataSetThroughComponent.sort((a, b) => (a.OBJECT_NAME > b.OBJECT_NAME) ? 1 : -1)) :
      this.dataSetThroughComponent.sort((a, b) => (a.OBJECT_NAME < b.OBJECT_NAME) ? 1 : -1);
    // this.systemMatch();
    this.clearPage();
    this.slicePerPage();
    
  }

  LaunchSort() {
    this.satSize = 0;
    // this.satellitesPerSystem = 0;
    // this.clearSAT();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? (this.dataSetThroughComponent.sort((a, b) => (a.LAUNCH_DATE) > (b.LAUNCH_DATE) ? 1 : -1)) :
      this.dataSetThroughComponent.sort((a, b) => (a.LAUNCH_DATE < b.LAUNCH_DATE) ? 1 : -1);
    // this.systemMatch();
    this.clearPage();
    this.slicePerPage();
  }

  CountrySort() {
    this.satSize = 0;
    this.satellitesPerSystem = 0;
    // this.clearSAT();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? (this.dataSetThroughComponent.sort((a, b) => (a.COUNTRY_CODE) > (b.COUNTRY_CODE) ? 1 : -1)) :
      this.dataSetThroughComponent.sort((a, b) => (a.COUNTRY_CODE < b.COUNTRY_CODE) ? 1 : -1);
    // this.systemMatch();
    this.clearPage();
    this.slicePerPage();
  }

  apoapsisSort() {
    this.satSize = 0;
    // this.satellitesPerSystem = 0;
    // this.clearSAT();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? (this.dataSetThroughComponent.sort((a, b) => (parseFloat(a.APOAPSIS) > parseFloat(b.APOAPSIS)) ? 1 : -1)) :
      this.dataSetThroughComponent.sort((a, b) => (parseFloat(a.APOAPSIS) < parseFloat(b.APOAPSIS)) ? 1 : -1);
    // this.systemMatch();
    this.clearPage();
    this.slicePerPage();
  }

  argOfPericenterSort() {
    this.satSize = 0;
    // this.satellitesPerSystem = 0;
    // this.clearSAT();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? (this.dataSetThroughComponent.sort((a, b) => (parseFloat(a.ARG_OF_PERICENTER) > parseFloat(b.ARG_OF_PERICENTER)) ? 1 : -1)) :
      this.dataSetThroughComponent.sort((a, b) => (parseFloat(a.ARG_OF_PERICENTER) < parseFloat(b.ARG_OF_PERICENTER)) ? 1 : -1);
    // this.systemMatch();
    this.clearPage();
    this.slicePerPage();
  }

  eccentricitySort() {
    this.satSize = 0;
    // this.satellitesPerSystem = 0;
    // this.clearSAT();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? (this.dataSetThroughComponent.sort((a, b) => (parseFloat(a.ECCENTRICITY) > parseFloat(b.ECCENTRICITY)) ? 1 : -1)) :
      this.dataSetThroughComponent.sort((a, b) => (parseFloat(a.ECCENTRICITY) < parseFloat(b.ECCENTRICITY)) ? 1 : -1);
    // this.systemMatch();
    this.clearPage();
    this.slicePerPage();
  }

  inclinationSort() {
    this.satSize = 0;
    // this.satellitesPerSystem = 0;
    // this.clearSAT();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? (this.dataSetThroughComponent.sort((a, b) => (parseFloat(a.INCLINATION) > parseFloat(b.INCLINATION)) ? 1 : -1)) :
      this.dataSetThroughComponent.sort((a, b) => (parseFloat(a.INCLINATION) < parseFloat(b.INCLINATION)) ? 1 : -1);
    // this.systemMatch();
    this.clearPage();
    this.slicePerPage();
  }

  meanAnomalySort() {
    this.satSize = 0;
    // this.satellitesPerSystem = 0;
    // this.clearSAT();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? (this.dataSetThroughComponent.sort((a, b) => (parseFloat(a.MEAN_ANOMALY) > parseFloat(b.MEAN_ANOMALY)) ? 1 : -1)) :
      this.dataSetThroughComponent.sort((a, b) => (parseFloat(a.MEAN_ANOMALY) < parseFloat(b.MEAN_ANOMALY)) ? 1 : -1);
    // this.systemMatch();
    this.clearPage();
    this.slicePerPage();
  }

  periapsisSort() {
    this.satSize = 0;
    // this.satellitesPerSystem = 0;
    // this.clearSAT();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? (this.dataSetThroughComponent.sort((a, b) => (parseFloat(a.PERIAPSIS) > parseFloat(b.PERIAPSIS)) ? 1 : -1)) :
      this.dataSetThroughComponent.sort((a, b) => (parseFloat(a.PERIAPSIS) < parseFloat(b.PERIAPSIS)) ? 1 : -1);
    // this.systemMatch();
    this.clearPage();
    this.slicePerPage();
  }

  revAtEpochSort() {
    this.satSize = 0;
    // this.satellitesPerSystem = 0;
    // this.clearSAT();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? (this.dataSetThroughComponent.sort((a, b) => (parseFloat(a.REV_AT_EPOCH) > parseFloat(b.REV_AT_EPOCH)) ? 1 : -1)) :
      this.dataSetThroughComponent.sort((a, b) => (parseFloat(a.REV_AT_EPOCH) < parseFloat(b.REV_AT_EPOCH)) ? 1 : -1);
    // this.systemMatch();
    this.clearPage();
    this.slicePerPage();
  }

  semiMajorAxisSort() {
    this.satSize = 0;
    // this.satellitesPerSystem = 0;
    // this.clearSAT();
    this.sortSWITCH == 0 ? this.sortSWITCH = 1 : this.sortSWITCH = 0;
    this.sortSWITCH == 0 ? (this.dataSetThroughComponent.sort((a, b) => (parseFloat(a.SEMIMAJOR_AXIS) > parseFloat(b.SEMIMAJOR_AXIS)) ? 1 : -1)) :
      this.dataSetThroughComponent.sort((a, b) => (parseFloat(a.SEMIMAJOR_AXIS) < parseFloat(b.SEMIMAJOR_AXIS)) ? 1 : -1);
    // this.systemMatch();
    this.clearPage();
    this.slicePerPage();
  }

  minMaxInc(min: number, max: number, val: number) {
    if (val >= min && val <= max) {
      this.satellitesPerSystem++;
      return 1;
    } else {
      return 0;
    }
  }

  minMaxAlgo(min: number, max: number, i: number) {
    this.satellitesPerSystem = 0;
    for (var item in this.dataSetThroughComponent) {
      this.tempForSearch.push(this.dataSetThroughComponent[item]);
    }
    this.dataSetThroughComponent = []
    for (var item in this.tempForSearch) {
      if (i == 0) {
        if (this.minMaxInc(min, max, parseFloat(this.tempForSearch[item].PERIAPSIS)) == 1) {
          this.dataSetThroughComponent.push(this.tempForSearch[item]);
        }
      } else if (i == 1) {
        if (this.minMaxInc(min, max, parseFloat(this.tempForSearch[item].INCLINATION)) == 1) {
          this.dataSetThroughComponent.push(this.tempForSearch[item]);
        }
      } else if (i == 2) {
        if (this.minMaxInc(min, max, parseFloat(this.tempForSearch[item].ECCENTRICITY)) == 1) {
          this.dataSetThroughComponent.push(this.tempForSearch[item]);
        }
      } else if (i == 3) {
        if (this.minMaxInc(min, max, parseFloat(this.tempForSearch[item].SEMIMAJOR_AXIS)) == 1) {
          this.dataSetThroughComponent.push(this.tempForSearch[item]);
        }
      } else if (i == 4) {
        if (this.minMaxInc(min, max, parseFloat(this.tempForSearch[item].APOAPSIS)) == 1) {
          this.dataSetThroughComponent.push(this.tempForSearch[item]);
        }
      } else if (i == 5) {
        if (this.minMaxInc(min, max, parseFloat(this.tempForSearch[item].ARG_OF_PERICENTER)) == 1) {
          this.dataSetThroughComponent.push(this.tempForSearch[item]);
        }
      } else if (i == 6) {
        if (this.minMaxInc(min, max, parseFloat(this.tempForSearch[item].REV_AT_EPOCH)) == 1) {
          this.dataSetThroughComponent.push(this.tempForSearch[item]);
        }
      } else if (i == 7) {
        if (this.minMaxInc(min, max, parseFloat(this.tempForSearch[item].MEAN_ANOMALY)) == 1) {
          this.dataSetThroughComponent.push(this.tempForSearch[item]);
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
    this.DisplayPageNumber = 1;
    this.pageNumber = 0;
    this.slicePerPage();
    data.resetForm();
  }

  search(data: NgForm) {
    this.clearPage();
    this.find(data.value.search);
    this.slicePerPage();
    data.resetForm();
  }

  find(str: string) {
    this.satSize = 0;
    if (str == null) { return; }
    str = str.toLowerCase();
    for (var item in this.dataSetThroughComponent) {
      this.tempForSearch.push(this.dataSetThroughComponent[item]);
    }
    this.dataSetThroughComponent = [];
    for (var item in this.tempForSearch) {
      if (this.tempForSearch[item] != undefined) {
        if (this.tempForSearch[item].OBJECT_NAME.toLowerCase().includes(str)) {
          this.dataSetThroughComponent.push(this.tempForSearch[item]);
          this.satSize++;
        }
      } else { break; }
    }
    this.tempForSearch = [];
  }

  slicePerPage() {
    for (let i = this.pageNumber * this.itemsPerPage;
      i < (this.pageNumber * this.itemsPerPage) + this.itemsPerPage;
      i++) {
      if (this.dataSetThroughComponent[i] == undefined) {
        break;
      }
      this.satOnPage.push(this.dataSetThroughComponent[i]);
    }
    this.numberOfPages = this.dataSetThroughComponent.length / this.itemsPerPage;
    this.numberOfPages = Math.trunc(this.numberOfPages);
    this.displayNumberOfPages = this.numberOfPages + 1;
  }

  click1() {
    this.pageNumber = 0;
    this.DisplayPageNumber = 1;
    this.clearPage();
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
    this.clearPage();
    this.slicePerPage();
  }

  clickLast() {
    this.numberOfPages = this.dataSetThroughComponent.length / this.itemsPerPage;
    this.numberOfPages = Math.trunc(this.numberOfPages);
    this.pageNumber = this.numberOfPages;
    this.DisplayPageNumber = this.pageNumber + 1;
    this.clearPage();
    this.slicePerPage();
  }

  clickPrevious() {
    if (this.pageNumber <= 0) { }
    else {
      this.pageNumber--;
      this.DisplayPageNumber--;
      this.clearPage();
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
    this.clearPage();
    this.slicePerPage();
  }

  download() {
    // this.clearPage();
    // let temp = this.itemsPerPage;
    // this.itemChange(this.satellitesPerSystem);
    // this.slicePerPage();
    this.appService.downloadFile(this.dataSetThroughComponent, this.system + " - " + Date());
    // this.clearPage();
    // this.itemChange(temp);
    // this.slicePerPage();
  }

}
