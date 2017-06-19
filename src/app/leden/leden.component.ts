import { Lid } from './../model/lid';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dzwelg-leden',
  templateUrl: './leden.component.html',
  styleUrls: ['./leden.component.css']
})
export class LedenComponent implements OnInit {

  leden: FirebaseListObservable<Lid[]>;

  constructor(private afdb: AngularFireDatabase) { }

  ngOnInit() {
    this.leden = this.afdb.list('leden');
  }

}
