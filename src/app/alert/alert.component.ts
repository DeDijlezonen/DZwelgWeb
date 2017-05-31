import { IAlert } from './../model/alert';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dzwelg-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input() alerts: IAlert[];

  constructor() { }

  ngOnInit() {
  }

  public sluitAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

}
