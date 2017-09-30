import { Component, OnInit } from '@angular/core';
import {AuthenticatieService} from '../services/authenticatie.service';
import {AngularFireDatabase} from 'angularfire2/database';
import {IAlert} from '../model/alert';
import * as _ from 'lodash';

@Component({
  selector: 'dzwelg-saldo',
  templateUrl: './saldo.component.html',
  styleUrls: ['./saldo.component.css']
})
export class SaldoComponent implements OnInit {

  alert: IAlert;
  loading = true;
  saldo: number;

  constructor(private authenticatieService: AuthenticatieService, private afdb: AngularFireDatabase) { }

  ngOnInit() {
    this.authenticatieService.isLoggedIn().subscribe(user => {
      const uid = user.uid;
      this.afdb.object('gebruikers/' + uid).subscribe(gebruiker => {
        if (_.isFinite(gebruiker.saldo)) {
          this.saldo = gebruiker.saldo;
        } else {
          this.alert = {
            message: 'Saldo niet beschikbaar',
            type: 'warning',
          };
        }
        this.loading = false;
      });
    });
  }

}
