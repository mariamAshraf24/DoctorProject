import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time12'
})
export class Time12Pipe implements PipeTransform {
  transform(time: string): string {
    if (!time) return '';

    const [hourStr, minute] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const isPM = hour >= 12;

    // تحويل الساعة إلى 12 ساعة
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour;

    const period = isPM ? 'م' : 'ص';

    return `${hour}:${minute} ${period}`;
  }
}
