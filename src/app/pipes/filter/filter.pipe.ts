import {Pipe, PipeTransform} from '@angular/core';
import {InschrijvingViewModel} from "../../evenementen-bewerken/evenementen-bewerken.component";
import {Gebruiker} from "../../model/gebruiker";

@Pipe({
  name: 'filterInschrijvingen'
})
export class InschrijvingsFilterPipe implements PipeTransform {

  transform(valuesToFilter: Gebruiker[], inschrijvingen: InschrijvingViewModel[]): any {
    if (valuesToFilter) {
      return valuesToFilter.filter(value => {
        return !inschrijvingen.map(inschrijving => inschrijving.id).includes(value.id);
      });
    }
  }
}
