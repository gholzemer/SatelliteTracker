
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { NgForm } from '@angular/forms';
import { credientials } from '../credientials';
import { Router } from '@angular/router';
import { SAT } from '../SAT';

@Component({
  selector: 'app-edit-criteria-layout',
  templateUrl: './edit-criteria-layout.component.html',
  styleUrls: ['./edit-criteria-layout.component.css']
})
export class EditCriteriaLayoutComponent implements OnInit {
  creds: credientials[] = [];
  sats: SAT[] = [];
  ID: string = "helloworld";
  pullComplete: number = 0;
  // static global: number = -1;

  constructor(private apiService: ApiService, private router: Router) {

  }

  ngOnInit(): void {
    // this.ID = (Math.floor(Math.random() * (10000000000 - 1000000000 + 1)) + 1000000000).toString(36);
    this.initialSatPull();
    this.ID = this.makeid();
  }

     initialSatPull() {
    this.apiService.LaunchSort().subscribe((sats: SAT[]) => {
      for (var item in sats) {
        this.apiService.globalSats.push(sats[item]);
      }
      this.pullComplete = 1;
    })
  }

  apiChange(data: NgForm) {
    this.apiService.PHP_API_SERVER = data.value.address;
    this.initialSatPull();
    data.form.reset();
  }

  makeid() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 1000; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  noAdminPriv() {
    this.apiService.setglobalvar(0);
    this.router.navigate(['/Home']);
  }

  giveAdminPriv() {
    this.apiService.setglobalvar(1);
    alert("Admin Login Success");
    this.router.navigate(['/Home']);
  }

  // username = MSAadmin
  // password = satcat
  authenticate(data: NgForm) {
    var username = data.value.username;
    var password = data.value.password;
    this.apiService.authentification(
      "SELECT * FROM spaceship.authentification WHERE username = '"+username+"' AND userpassword = md5('"+password+"');"
    ).subscribe((credientials: credientials[]) => {
      for (var item in credientials) {
        this.creds.push(credientials[item]);
      }
      if (this.creds[0] != null) {
        this.giveAdminPriv();
      }
    })
    data.resetForm();
  }

}
