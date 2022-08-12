import { Component, OnInit, Input } from '@angular/core';
import { SAT } from '../../SAT';

@Component({
  selector: 'app-accordion-category',
  templateUrl: './accordion-category.component.html',
  styleUrls: ['./accordion-category.component.css']
})
export class AccordionCategoryComponent implements OnInit {
  @Input("data") data: any;
  @Input("fullSatData")
    fullSatData!: SAT[];
  systemArray: string[] = [];

  constructor() {
  }

  ngOnInit() {
    this.systemMatch();
  }

  systemMatch() {
    if (this.data.Company.includes("Others")) {
      this.data.COUNTRY_CODE = " ";
      this.data.CENTER_NAME = " ";
      return;
    }
    this.systemArray = this.data.System.split(", ");
  }
}
