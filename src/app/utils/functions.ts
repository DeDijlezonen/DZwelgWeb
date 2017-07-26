import {FormGroup} from '@angular/forms';
import * as _ from 'lodash';

export class FormHelper {

  static validationMessages = {
    'voornaam': {
      'required': 'Voornaam is verplicht.',
    },
    'achternaam': {
      'required': 'Achternaam is verplicht.',
    },
    'email': {
      'required': 'E-mail is verplicht.',
      'email': 'Ongeldig e-mailadres.'
    }
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
          foutBoodschap += FormHelper.validationMessages[control_key][error_key] + ' ';
        });
      }
    });

    return foutBoodschap;
  }


}


