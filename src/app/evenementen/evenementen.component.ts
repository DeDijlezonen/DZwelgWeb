import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'dzwelg-evenementen',
  templateUrl: './evenementen.component.html',
  styleUrls: ['./evenementen.component.css']
})
export class EvenementenComponent implements OnInit {

  evenementen: FirebaseListObservable<any[]>;
  currentRate: 8;

  constructor(private af: AngularFire) { }

  ngOnInit() {
    this.evenementen = this.af.database.list('evenementen');
  }

}
