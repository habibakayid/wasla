import { Directive, ElementRef, effect, input, output } from '@angular/core';


@Directive({ selector: '[appInfiniteScroll]' })
export class InfiniteScrollDirective {
  appInfiniteScroll = input(true);
  reached = output<void>();

  constructor(private el: ElementRef<HTMLElement>) {
    effect((onCleanup) => {
      if (!this.appInfiniteScroll()) {
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            this.reached.emit();
          }
        },
        { rootMargin: '300px' }
      );
      observer.observe(this.el.nativeElement);
      onCleanup(() => observer.disconnect());
    });
  }
}