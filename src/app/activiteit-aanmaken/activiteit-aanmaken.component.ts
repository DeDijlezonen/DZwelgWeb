import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DzwelgValidators} from "../utils/validators";
import {Activiteit} from "../model/activiteit";
import {Router} from "@angular/router";
import {IAlert} from "../model/alert";
import {AngularFireDatabase, AngularFireDatabaseModule, FirebaseListObservable} from "angularfire2/database";
import {FormHelper} from "../utils/functions";
import {NgbDateStruct, NgbTimeStruct} from "@ng-bootstrap/ng-bootstrap";
import * as moment from 'moment';

interface ActiviteitType {
  value: string;
  displayUpper: string;
  displayLower: string;
}

@Component({
  selector: 'dzwelg-activiteit-aanmaken',
  templateUrl: './activiteit-aanmaken.component.html',
  styleUrls: ['./activiteit-aanmaken.component.css']
})
export class ActiviteitAanmakenComponent implements OnInit {

  alert: IAlert;
  activiteiten: FirebaseListObservable<Activiteit[]>;
  evenementAanmakenForm: FormGroup;
  productieAanmakenForm: FormGroup;

  datumVan: NgbDateStruct;
  tijdVan: NgbTimeStruct;
  datumTot: NgbDateStruct;
  tijdTot: NgbTimeStruct;

  typeAanTeMakenActiviteit: ActiviteitType;
  activiteitTypes: ActiviteitType[] = [
    {value: 'prodcutie', displayUpper: 'Productie', displayLower: 'productie'},
    {value: 'evenement', displayUpper: 'Evenement', displayLower: 'evenement'}
  ];

  constructor(private afdb: AngularFireDatabase, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.activiteiten = this.afdb.list('activiteiten');
    this.setDefaultValues();
    this.typeAanTeMakenActiviteit = this.activiteitTypes[0];
    this.createEvenementAanmakenForm();
    this.createProductieAanmakenForm();
  }

  private createEvenementAanmakenForm() {
    this.evenementAanmakenForm = this.fb.group({
      titel: ['', Validators.required],
      tegoed: [0, [Validators.required, DzwelgValidators.positiefValidator]],
    });
  }

  private createProductieAanmakenForm() {
    this.productieAanmakenForm = this.fb.group({
      titel: ['', Validators.required],
    });
  }

  public evenementAanmaken(model: Activiteit) {
    const isValidTijdspanne: boolean = this.isValideTijdspanne();
    if (this.evenementAanmakenForm.invalid || !isValidTijdspanne) {
      let foutBoodschap = FormHelper.getFormErrorMessage(this.evenementAanmakenForm);

      if (!isValidTijdspanne) {
        foutBoodschap += '_Gelieve een correcte tijdspanne in te geven.';
      }

      this.alert = {
        type: 'danger',
        message: foutBoodschap,
      };
    } else {
      const fbActiviteit = this.activiteiten.push({
        titel: model.titel,
        tegoed: model.tegoed,
      });

      const key = fbActiviteit.key;
      model.id = key;
      this.activiteiten.update(key, model);

      this.router.navigate(['../']);
    }
  }

  public productieAanmaken(model: Activiteit) {
    if (this.productieAanmakenForm.invalid) {

      const foutBoodschap = FormHelper.getFormErrorMessage(this.productieAanmakenForm);

      this.alert = {
        type: 'danger',
        message: foutBoodschap,
      };
    } else {
      model.starttijd = Date.now();

      const fbEvent = this.activiteiten.push({
        titel: model.titel,
        starttijd: model.starttijd,
      });

      const key = fbEvent.key;
      model.id = key;
      this.activiteiten.update(key, model);

      this.router.navigate(['../']);
    }
  }

  private setDefaultValues() {
    const stamp = moment();

    this.datumVan = {
      day: stamp.date(),
      month: stamp.month() + 1,
      year: stamp.year(),
    };

    this.tijdVan = {
      hour: stamp.hour(),
      minute: stamp.minute(),
      second: stamp.second(),
    };

    this.datumTot = {
      day: stamp.date(),
      month: stamp.month() + 1,
      year: stamp.year(),
    };

    this.tijdTot = {
      hour: moment().add(2, 'hours').hour(),
      minute: stamp.minute(),
      second: stamp.second(),
    };
  }

  private isValideTijdspanne(): boolean {
    const momentDatumVan = moment([this.datumVan.year, this.datumVan.month - 1, this.datumVan.day, this.tijdVan.hour, this.tijdVan.second]);
    const momentDatumTot = moment([this.datumTot.year, this.datumTot.month - 1, this.datumTot.day, this.tijdTot.hour, this.tijdTot.second]);
    if (momentDatumVan.isAfter(momentDatumTot)) {
      return false;
    }
    return true;
  }
}
