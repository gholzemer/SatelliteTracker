import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fully-detail-cards',
  templateUrl: './fully-detail-cards.component.html',
  styleUrls: ['./fully-detail-cards.component.css']
})
export class FullyDetailCardsComponent implements OnInit {

  @Input("data") data!: any;
  @Input("dataBind") dataBind!: any;

  constructor() { }

  ngOnInit(): void {
    // console.log(this.data);
  }

}
