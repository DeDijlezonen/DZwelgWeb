import { FormGroup } from '@angular/forms';
import * as _ from 'lodash';

export class FormHelper {

    static getFormErrorMessage(formGroup: FormGroup) {
        let foutBoodschap = '';
        const controls = formGroup.controls;
        _.keys(controls).forEach((control_key) => {
          const errors = controls[control_key].errors;
          if (errors) {
            foutBoodschap += control_key + ': ';
            _.keys(errors).forEach((error_key: string, index) => {
              foutBoodschap += (error_key.toString() + (_.lastIndexOf(errors) === index ? '' : '; '));
            });
          }
        });

        return foutBoodschap;
    }

}

export class DateHelper {
  static getDateFromSeconds(seconds: number) {
    const t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(seconds);
    return t;
  }
}


