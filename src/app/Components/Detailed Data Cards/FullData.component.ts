import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../api.service';
import { SAT } from '../../SAT';


@Component({
  selector: 'app-FullDataCard',
  templateUrl: './FullData.component.html',
  styleUrls: ['./FullData.component.css']
})
export class FullData {

  @Input("data") data: any;

  
  constructor(private apiService: ApiService) {
    
  }

  ngOnInit() { }

  updateOnClick() {
    const date = new Date();
    if (this.data.ELEMENT_SET_NO == "999") {
      this.data.ELEMENT_SET_NO = date.getFullYear() + date.getMonth() + date.getDay();
    } else {
      this.data.ELEMENT_SET_NO = "999"; 
    }
  }

  // checkbox

}
