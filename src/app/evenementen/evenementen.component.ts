import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { IAlert } from './../model/alert';

@Component({
  selector: 'dzwelg-evenementen',
  templateUrl: './evenementen.component.html',
  styleUrls: ['./evenementen.component.css']
})
export class EvenementenComponent implements OnInit {

  evenementen: FirebaseListObservable<any[]>;
  alerts: IAlert[];

  constructor(private af: AngularFire) { }

  ngOnInit() {
    this.evenementen = this.af.database.list('evenementen');
  }

  verwijder(id: string) {
    this.evenementen.remove(id).then(
      succes => {
        this.alerts.push({
          type: 'succes',
          message: 'Het evenement werd succesvol verwijderd.'
        });
      },
      error => {
        this.alerts.push({
          type: 'danger',
          message: 'Het evenement kon niet worden verwijderd'
        });
      }
    );
  }

  public sluitAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

}
