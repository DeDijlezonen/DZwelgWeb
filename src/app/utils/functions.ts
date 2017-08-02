import {FormGroup} from '@angular/forms';
import * as _ from 'lodash';

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
  };

  static getFormErrorMessage(formGroup: FormGroup) {
      let foutBoodschap = '';
      const controls = formGroup.controls;
      _.keys(controls).forEach((control_key) => {
        const errors = controls[control_key].errors;
        if (errors) {
          // foutBoodschap += control_key + ': ';
          _.keys(errors).forEach((error_key: string, index) => {
            // foutBoodschap += (error_key.toString() + (_.lastIndexOf(errors) === index ? '' : '; '));
            foutBoodschap += FormHelper.validationMessages[control_key][error_key] + '_';
          });
        }
      });

    return foutBoodschap.substring(0, foutBoodschap.length - 1);
  }


}

export class DateHelper {
  static getDateFromSeconds(seconds: number) {
    const t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(seconds);
    return t;
  }
}


