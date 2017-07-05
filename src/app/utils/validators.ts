import { AbstractControl } from '@angular/forms';

export class DzwelgValidators {

    static positiefValidator = (control: AbstractControl) => {
        return control.value >= 0 ? null : {
            positiefValidator: true,
        };
    }
}
