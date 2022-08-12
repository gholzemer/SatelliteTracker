import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { SAT } from '../../SAT';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-manual-override',
  templateUrl: './manual-override.component.html',
  styleUrls: ['./manual-override.component.css']
})
export class ManualOverrideComponent implements OnInit {
  sat: SAT[] = [];

  satelliteToChange: SAT | undefined;
  satelliteToChangeID: number = 0;

  system: string | undefined;
  systemDisplay: string = "";

  company: string | undefined;
  comapnyDisplay: string = "";

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.initDataPull();
  }

  initDataPull() {
    this.apiService.readParams("SELECT * FROM satcat").subscribe((sats: SAT[]) => {
      for (var item in sats) {
        this.sat.push(sats[item]);
      }
      // console.log(this.sat);
    })
  }

  findSat(data: NgForm) {
    let ID = parseInt(data.value.norad);
    this.satelliteToChangeID = ID;
    for (var item in this.sat) {
      if (ID == parseInt(this.sat[item].NORAD_CAT_ID)) {
        this.satelliteToChange = this.sat[item];
      }
    }
    if (this.satelliteToChange == undefined) {
      alert("Norad ID Not Found");
    }
    data.form.reset();
  }

  changeSat(data: NgForm) {
    if (this.satelliteToChange == undefined) { return }
    if (data.value.company != "") {
      this.changeValInSat("Company",data.value.company);
    }
    if (data.value.system != "") {
      this.changeValInSat("System", data.value.system);
    }
    if (data.value.sensor != "") {
      this.changeValInSat("SENSOR", data.value.sensor);
    }
    if (data.value.orbit != "") {
      this.changeValInSat("ORBIT", data.value.orbit);
    }
    this.satelliteToChange = undefined;
    data.form.reset;
  }

  // only field that does not change it is norad_cat_is
  changeValInSat(col: string, val: string) {
    if (this.satelliteToChange == undefined) {return}
    this.apiService.overrideSatellite(
      "UPDATE satcat SET " + col + " = CASE WHEN NORAD_CAT_ID = " + this.satelliteToChange.NORAD_CAT_ID + " THEN '" + val + "' ELSE "+col+" END; "
    ).subscribe((sats: any) => {
      // console.log(sats);
    })
  }

  findSystem(data: NgForm) {
    if (this.sat == null) { return }
    let sys = data.value.system.toString().toLowerCase();
    for (var item in this.sat) {
      if (this.sat[item].System != null) {
        if (this.sat[item].System.toLowerCase() == sys) {
          this.system = data.value.system;
          this.systemDisplay = this.sat[item].System;
        }
      }
    }

    if (this.system == null) {
      alert("System Not Found.");
    }

    data.form.reset();
  }

  changeSys(data: NgForm) {
    if (this.system == null) {return}
    if (data.value.sensor != "") {
      this.changeSysParam("SENSOR", data.value.sensor);
    }
    if (data.value.orbit != "") {
      this.changeSysParam("ORBIT", data.value.orbit);
    }
    this.system = undefined;
    data.form.reset();
  }

  changeSysParam(col: string, val: string) {
    this.apiService.overrideSatellite(
      "UPDATE j SET " + col + " = CASE WHEN System = '" + this.system + "' THEN '" + val + "' ELSE " + col + " END; "
    ).subscribe((sats: any) => {
      // console.log(sats);
    })
  }

  newCompany(data: NgForm) {
    if (data.value.company == "" || data.value.system == "" || data.value.criteria == "") {
      alert("All Fields Required.");
      data.form.reset();
      return;
    }
    this.updateSystem(data.value.system, data.value.criteria);
    this.updateCompany(data.value.company, data.value.criteria);
    data.form.reset();
  }

  updateSystem(system: string, criteria: string) {
    this.apiService.overrideSatellite(
      "UPDATE j SET System = IF(INSTR(OBJECT_NAME, '"+criteria+"'), '"+system+"', System);"
    ).subscribe((sats: any) => {
      // console.log(sats);
    })
  }

  updateCompany(company: string, criteria: string) {
    this.apiService.overrideSatellite(
      "UPDATE j SET Company = IF(INSTR(OBJECT_NAME, '"+criteria+"'), '"+company+"', Company);"
    ).subscribe((sats: any) => {
      // console.log(sats);
    })
  }

  resetSpecificSatellite() {
    this.satelliteToChange = undefined;
  }

  resetSystem() {
    this.system = undefined;
  }

}
