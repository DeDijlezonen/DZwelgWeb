import {FormGroup} from '@angular/forms';
import * as _ from 'lodash';
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

export class FormHelper {

  static validationMessages = {
    'naam': {
      'required': 'Gelieve een naam op te geven.'
    },
    'prijs': {
      'positiefValidator': 'Prijs mag niet negatief zijn.'
    },
    'voornaam': {
      'required': 'Voornaam is verplicht.',
    },
    'achternaam': {
      'required': 'Achternaam is verplicht.',
    },
    'email': {
      'required': 'E-mail is verplicht.',
      'email': 'Ongeldig e-mailadres.'
    },
    'aantalInStock': {
      'positiefValidator': 'Aantal mag niet negatief zijn.'
    },
    'titel': {
      'required': 'Titel is verplicht',
    },
    'tegoed': {
      'required': 'Tegoed is verplicht',
      'positiefValidator': 'Tegoed mag niet negatief zijn.',
    },
    'lid': {
      'required': 'Rol is verplicht',
    }
  };

  static getFormErrorMessage(formGroup: FormGroup) {
    let foutBoodschap = '';
    const controls = formGroup.controls;
    _.keys(controls).forEach((control_key) => {
      const errors = controls[control_key].errors;
      if (errors) {
        // foutBoodschap += control_key + ': ';
        _.keys(errors).forEach((error_key: string) => {
          // foutBoodschap += (error_key.toString() + (_.lastIndexOf(errors) === index ? '' : '; '));
          foutBoodschap += FormHelper.validationMessages[control_key][error_key] + '_';
        });
      }
    });

    return foutBoodschap.substring(0, foutBoodschap.length - 1);
  }


}

export class ActiviteitHelper {
  static isEvenement(activiteit) {
    return activiteit.hasOwnProperty('eindtijd') && activiteit.hasOwnProperty('tegoed');
  }
}

export class DateHelper {
  static getDateFromMiliSeconds(miliseconds: number) {
    return moment(miliseconds).toDate();
  }

  static ngbDateEnTimeStructNaarMoment(ngbDateStruct: NgbDateStruct, ngbTimeStruct: NgbTimeStruct) {
    return moment([ngbDateStruct.year, ngbDateStruct.month - 1, ngbDateStruct.day, ngbTimeStruct.hour, ngbTimeStruct.second]);
  }

  static isValideTijdspanne(datumVan: NgbDateStruct, tijdVan: NgbTimeStruct, datumTot: NgbDateStruct, tijdTot: NgbTimeStruct): boolean {
    const momentDatumVan = DateHelper.ngbDateEnTimeStructNaarMoment(datumVan, tijdVan);
    const momentDatumTot = DateHelper.ngbDateEnTimeStructNaarMoment(datumTot, tijdTot);

    return momentDatumVan.isBefore(momentDatumTot);
  }
}

export class Rol {
  static Lid = 'lid';
  static Kassaverantwoordelijke = 'kassaverantwoordelijke';
  static Stockbeheerder = 'stockbeheerder';
  static Beheerder = 'beheerder';
}

export class TransactieSoort {
  static Credit = 'CREDIT';
  static Debit = 'DEBIT';
  static Undo = 'UNDO';
}


