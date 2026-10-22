import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  beforeEach(() => {
    localStorage.removeItem('wasla-language');
    TestBed.resetTestingModule();
  });

  it('switches translations and document direction to Arabic', () => {
    const service = TestBed.inject(TranslationService);
    const document = TestBed.inject(DOCUMENT);

    service.toggleLanguage();

    expect(service.translate('Home')).toBe('الرئيسية');
    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
    expect(localStorage.getItem('wasla-language')).toBe('ar');
  });

  it('restores the saved language when initialized', () => {
    localStorage.setItem('wasla-language', 'ar');

    const service = TestBed.inject(TranslationService);
    const document = TestBed.inject(DOCUMENT);

    expect(service.language()).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
  });
});
