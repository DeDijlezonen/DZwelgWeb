import { Pipe, PipeTransform } from '@angular/core';
import {Actief} from "../../model/actief";

@Pipe({
  name: 'actief'
})
export class ActiefPipe implements PipeTransform {

  transform(actieveItems: Actief[], args?: any): any {
    return actieveItems.filter((item) => item.actief);
  }

}
