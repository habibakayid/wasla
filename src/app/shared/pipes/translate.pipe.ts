import { Pipe, PipeTransform, inject } from '@angular/core';

import { TranslationService } from '@core/services/translation.service';

@Pipe({
  name: 't',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private readonly translations = inject(TranslationService);

  transform(value: string | null | undefined): string {
    return value ? this.translations.translate(value) : '';
  }
}
