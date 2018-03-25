import {Component, OnInit} from '@angular/core';
import {AuthenticatieService} from '../services/authenticatie.service';
import {AngularFireDatabase} from 'angularfire2/database';
import {IAlert} from '../model/alert';
import * as _ from 'lodash';
import {TransactieSoort} from '../utils/functions';
import * as moment from 'moment';

@Component({
  selector: 'dzwelg-saldo',
  templateUrl: './saldo.component.html',
  styleUrls: ['./saldo.component.css']
})
export class SaldoComponent implements OnInit {

  alert: IAlert;
  loadingSaldo = true;
  loadingTransacties = true;
  saldo: number;
  transacties: string[] = [];

  constructor(private authenticatieService: AuthenticatieService, private afdb: AngularFireDatabase) { }

  ngOnInit() {
    this.authenticatieService.isLoggedIn().subscribe(user => {
      const uid = user.uid;
      this.afdb.object('gebruikers/' + uid).subscribe(gebruiker => {
        if (_.isFinite(gebruiker.saldo)) {
          this.saldo = gebruiker.saldo;
        } else {
          this.alert = {
            message: 'Saldo niet beschikbaar.',
            type: 'warning',
          };
        }
        this.loadingSaldo = false;
      });

      this.afdb.list('gebruikers/' + uid + '/transacties', {
        query: {
          orderByChild: 'timestamp',
          limitToFirst: 10,
        }
      }).subscribe(transacties => {
        if (transacties) {
          this.transacties = [];
          _.keys(transacties).forEach(timestamp => {
            const transactie = transacties[timestamp];
            let transactieString: string = moment(Math.abs(transactie.timestamp)).format('DD/MM/YYYY HH:mm:ss') + ' - ';

            if (transactie.soort === TransactieSoort.Credit) {
              transactieString += '(' + TransactieSoort.Credit + ') - € ' + transactie.bedrag + ' opgeladen';
            } else if (transactie.soort === TransactieSoort.Debit) {
              transactieString += '(' + TransactieSoort.Debit + ') - € ' + transactie.bedrag + ' (';

              const consumptieLijnenKeys = _.keys(transactie.consumptielijnen);
              consumptieLijnenKeys.forEach((key, index) => {
                const consumptielijn = transactie.consumptielijnen[key];

                transactieString += consumptielijn.aantal + ' x ' + consumptielijn.consumptie.naam;
                if (index < (consumptieLijnenKeys.length - 1)) {
                  transactieString += ', ';
                }
              });

              transactieString += ')';
            } else if (transactie.soort === TransactieSoort.Undo) {
              transactieString += '(UNDO) - Transactie van ' + moment(Math.abs(transactie.transactie.timestamp)).format('DD/MM/YYYY HH:mm:ss') + ' (' + transactie.transactie.soort + ': € ' + transactie.transactie.bedrag + ') teruggedraaid';
            }

            this.transacties.push(transactieString);
          });

        } else {
          if (this.alert) {
            this.alert.message += ' Transacties niet beschikbaar';
          } else {
            this.alert = {
              message: 'Transacties niet beschikbaar',
              type: 'warning',
            };
          }
        }

        this.loadingTransacties = false;
      });

    });
  }

}
