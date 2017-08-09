import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {Gebruiker} from '../model/gebruiker';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DzwelgValidators} from '../utils/validators';
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

export interface InschrijvingViewModel {
  id: string;
  voornaam: string;
  achternaam: string;
  betaald: boolean;
}

@Component({
  selector: 'dzwelg-evenementen-bewerken',
  templateUrl: './evenementen-bewerken.component.html',
  styleUrls: ['./evenementen-bewerken.component.css']
})
export class EvenementenBewerkenComponent implements OnInit {

  id: string;
  gebruikers: FirebaseListObservable<Gebruiker[]>;
  ingeschrevenenFLO: FirebaseListObservable<any[]>;
  inschrijvingen: InschrijvingViewModel[] = [];

  evenementBewerkenForm: FormGroup;

  datumVan: NgbDateStruct;
  tijdVan: NgbTimeStruct;
  datumTot: NgbDateStruct;
  tijdTot: NgbTimeStruct;

  constructor(private afdb: AngularFireDatabase, private route: ActivatedRoute, private router: Router, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.gebruikers = this.afdb.list('/gebruikers');
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.mapIngeschrevenen();
      this.createForm();
    });
  }

  private getEvenement() {
    if (this.id) {
      return this.afdb.object('/activiteiten/' + this.id);
    }
  }

  public createForm() {
    this.getEvenement().subscribe(evenement => {
      this.evenementBewerkenForm = this.fb.group({
        titel: [evenement.titel, Validators.required],
        tegoed: [evenement.tegoed, [Validators.required, DzwelgValidators.positiefValidator]]
      });

      const momentVan = moment.unix(evenement.starttijd);
      const momentTot = moment.unix(evenement.eindtijd);

      this.datumVan = {
        day: momentVan.day(),
        month: momentVan.month(),
        year: momentVan.year(),
      };
      this.datumTot = {
        day: momentTot.day(),
        month: momentTot.month(),
        year: momentTot.year()
      };
      this.tijdVan = {
        second: momentVan.second(),
        minute: momentVan.minute(),
        hour: momentVan.hour()
      };
      this.tijdTot = {
        second: momentTot.second(),
        minute: momentTot.minute(),
        hour: momentTot.hour()
      };

    });
  }

  public schrijfIn(id: string) {
    if (this.id) {
      this.afdb.object('/activiteiten/' + this.id + '/ingeschrevenen').update({[id]: false});
    }
  }

  public schrijfUit(id: string) {
    if (this.id) {
      this.ingeschrevenenFLO.remove(id);
    }
  }

  public slaBetaaldFlagOp(heeftBetaald: boolean, id: string) {
    this.afdb.object('/activiteiten/' + this.id + '/ingeschrevenen').update({[id]: heeftBetaald});
  }

  private mapIngeschrevenen(): void {
    this.ingeschrevenenFLO = this.afdb.list('/activiteiten/' + this.id + '/ingeschrevenen');
    this.ingeschrevenenFLO.subscribe(ingeschrevenen => {
      this.inschrijvingen = [];
      ingeschrevenen.forEach(ingeschrevene => {
        const gebruikerSubscription = this.getGebruiker(ingeschrevene.$key).subscribe(
          (gebruiker) => {
            this.inschrijvingen.push({
              id: ingeschrevene.$key,
              voornaam: gebruiker.voornaam,
              achternaam: gebruiker.achternaam,
              betaald: ingeschrevene.$value,
            });
            gebruikerSubscription.unsubscribe();
          },
          (error) => {
          },
          () => {
          }
        );
      });
    });
  }

  private getGebruiker(id: string) {
    return this.afdb.object('/gebruikers/' + id);
  }
}
