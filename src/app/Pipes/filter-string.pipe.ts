import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterString',
  standalone: true
})
export class FilterStringPipe implements PipeTransform {

  transform(value: string): string {
    let regex = /&[a-zA-Z0-9!@#\$%\^&\*]*;/gi;

    value = value.replaceAll(regex, "");

    return value;
  }

}
