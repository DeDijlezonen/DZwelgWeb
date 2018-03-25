import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {Gebruiker} from '../model/gebruiker';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DzwelgValidators} from '../utils/validators';
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {Activiteit} from '../model/activiteit';
import {ActiviteitHelper, DateHelper, FormHelper} from '../utils/functions';
import {IAlert} from '../model/alert';

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
  alert: IAlert;
  isEvenement = true;

  gebruikers: FirebaseListObservable<Gebruiker[]>;
  ingeschrevenenFLO: FirebaseListObservable<any[]>;
  inschrijvingen: InschrijvingViewModel[] = [];
  evenementBewerkenForm: FormGroup;
  datumVan: NgbDateStruct;
  tijdVan: NgbTimeStruct;
  datumTot: NgbDateStruct;
  tijdTot: NgbTimeStruct;

  productieBewerkenForm: FormGroup;

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
      this.isEvenement = ActiviteitHelper.isEvenement(evenement);
      if (this.isEvenement) {
        this.createEvenementBewerkenForm(evenement);
      } else {
        this.createProductieBewerkenForm(evenement);
      }
    });
  }

  private createEvenementBewerkenForm(evenement: Activiteit) {
    this.evenementBewerkenForm = this.fb.group({
      titel: [evenement.titel, Validators.required],
      tegoed: [evenement.tegoed, [Validators.required, DzwelgValidators.positiefValidator]]
    });

    const momentVan = moment.unix(evenement.starttijd);
    const momentTot = moment.unix(evenement.eindtijd);

    this.datumVan = {
      day: momentVan.date(),
      month: momentVan.month() + 1,
      year: momentVan.year(),
    };
    this.datumTot = {
      day: momentTot.date(),
      month: momentTot.month() + 1,
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
  }

  private createProductieBewerkenForm(productie: Activiteit) {
    this.productieBewerkenForm = this.fb.group({
      titel: [productie.titel, Validators.required],
    });
  }

  public schrijfIn(id: string) {
    if (this.id) {
      this.afdb.object('/activiteiten/' + this.id + '/ingeschrevenen').update({[id]: false});
      this.getEvenement().subscribe((evenement) => {
        this.afdb.object('/activiteiten/' + this.id + '/saldi').update({[id]: evenement.tegoed });
      }).unsubscribe();
    }
  }

  public schrijfUit(id: string) {
    if (this.id) {
      this.ingeschrevenenFLO.remove(id);
      this.afdb.list('/activiteiten/' + this.id + '/saldi').remove(id);
    }
  }

  public slaBetaaldFlagOp(heeftBetaald: boolean, id: string) {
    this.afdb.object('/activiteiten/' + this.id + '/ingeschrevenen').update({[id]: heeftBetaald});
  }

  public evenementBewerkenOpslaan(model: Activiteit) {
    const isValidTijdspanne: boolean = DateHelper.isValideTijdspanne(this.datumVan, this.tijdVan, this.datumTot, this.tijdTot);
    if (this.evenementBewerkenForm.invalid || !isValidTijdspanne) {
      let foutBoodschap = FormHelper.getFormErrorMessage(this.evenementBewerkenForm);

      if (!isValidTijdspanne) {
        foutBoodschap += '_Gelieve een correcte tijdspanne in te geven.';
      }

      this.alert = {
        type: 'danger',
        message: foutBoodschap,
      };
    } else {

      if (this.id) {
        const momentDatumVan = DateHelper.ngbDateEnTimeStructNaarMoment(this.datumVan, this.tijdVan);
        const momentDatumTot = DateHelper.ngbDateEnTimeStructNaarMoment(this.datumTot, this.tijdTot);

        this.afdb.object('/activiteiten/' + this.id).update({
          titel: model.titel,
          tegoed: model.tegoed,
          starttijd: momentDatumVan.unix(),
          eindtijd: momentDatumTot.unix(),
        });

        this.router.navigate(['/activiteiten']);
      }
    }
  }

  public productieBewerkenOpslaan(model: Activiteit) {
    if (this.productieBewerkenForm.invalid) {
      const foutBoodschap = FormHelper.getFormErrorMessage(this.productieBewerkenForm);

      this.alert = {
        type: 'danger',
        message: foutBoodschap,
      };
    } else {
      if (this.id) {
        this.afdb.object('/activiteiten/' + this.id).update({
          titel: model.titel,
        });

        this.router.navigate(['/activiteiten']);
      }
    }
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
