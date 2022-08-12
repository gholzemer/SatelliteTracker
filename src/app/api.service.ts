import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SAT } from './SAT';
import { Observable } from 'rxjs';
import { credientials } from './credientials';

// import { PowerShell } from 'node-powershell';
// import { exec } from 'node:child_process';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  global: number = -1;
  globalSats: SAT[] = [];
  initialSatPull: boolean = false;
  PHP_API_SERVER = "http://127.0.0.1:8080";

  constructor(private httpClient: HttpClient) {  }

  getglobalvar() {
    return this.global;
  }

  getInitialSats() {
  
  }

  setglobalvar(num: number) {
    this.global = num;
  }

  readSats(): Observable<SAT[]> {
    return this.httpClient.get<SAT[]>(`${this.PHP_API_SERVER}/api/read.php`);
  }

  LaunchSort(): Observable<SAT[]> {
    return this.httpClient.get<SAT[]>(`${this.PHP_API_SERVER}/api/read-sort-LaunchDate.php`);
  }

  readParams(query: string): Observable<SAT[]> {
    let params = new HttpParams().set('query', query);
    return this.httpClient.get<SAT[]>(`${this.PHP_API_SERVER}/api/read-params.php`, {params: params});
  }

  readCompanysParams(query: string): Observable<SAT[]> {
    let params = new HttpParams().set('query', query);
    return this.httpClient.get<SAT[]>(`${this.PHP_API_SERVER}/api/read-companys.php`, { params: params });
  }

  authentification(query: string): Observable<credientials[]> {
    let params = new HttpParams().set('query', query);
    return this.httpClient.get<credientials[]>(`${this.PHP_API_SERVER}/api/Authentification/criteria-credientials.php`, { params: params });
  }

  powershellMatlabCommand() {
    // console.log(win.api);
   //  return this.httpClient.get<any>(`/assets/PowershellScripts/powershell-matlab.php`);
  }

  overrideSatellite(query: string): Observable<any> {
    let params = new HttpParams().set('query', query);
    return this.httpClient.get(`${this.PHP_API_SERVER}/api/ManualOverride/write-override-sat.php`, { params: params });
  }

}

