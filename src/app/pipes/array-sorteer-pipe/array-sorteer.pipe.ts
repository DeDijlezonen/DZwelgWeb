import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sorteer'
})
export class ArraySorteerPipe implements PipeTransform {

  transform(array: Array<any>, sorteerVolgens: string): any {
    array.sort((a: any, b: any) => {
      if (a[sorteerVolgens] < b[sorteerVolgens]) {
        return -1;
      } else if (a[sorteerVolgens] > b[sorteerVolgens]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }

}
