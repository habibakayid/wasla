import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';

import { TranslationService } from '@core/services/translation.service';

@Pipe({
  name: 'localizedDate',
  standalone: true,
  pure: false,
})
export class LocalizedDatePipe implements PipeTransform {
  private readonly translations = inject(TranslationService);

  transform(value: string | number | Date | null | undefined, format: string): string | null {
    return new DatePipe(this.translations.locale()).transform(value, format);
  }
}
