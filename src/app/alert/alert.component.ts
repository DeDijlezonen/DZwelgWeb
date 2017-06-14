import { IAlert } from './../model/alert';
import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'dzwelg-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input() alert: IAlert;

  constructor() { }

  ngOnInit() {
  }

  public sluitAlert() {
    // const index: number = this.alerts.indexOf(alert);
    // this.alerts.splice(index, 1),
    this.alert = null;
  }

}
