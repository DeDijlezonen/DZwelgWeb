import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";

@Component({
  selector: 'app-evenementen-bewerken',
  templateUrl: './evenementen-bewerken.component.html',
  styleUrls: ['./evenementen-bewerken.component.css']
})
export class EvenementenBewerkenComponent implements OnInit {

  constructor(private afdb: AngularFireDatabase) { }

  ngOnInit() {
  }

}
