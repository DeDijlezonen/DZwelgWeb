import { Pipe, PipeTransform } from '@angular/core';
import { keys } from 'lodash';

@Pipe({
  name: 'formatteerRollen'
})
export class FormatteerRollenPipe implements PipeTransform {

  transform(rollen: { [rolnaam: string]: boolean }, args?: any): any {
    return keys(rollen).map((rolnaam) => {
      if (rollen[rolnaam] === true) {
        return rolnaam
      } else {
        return null;
      }
    }).join(', ');
  }

}
