import { Directive, ElementRef, HostListener, Input, OnDestroy, afterNextRender, booleanAttribute, inject } from '@angular/core';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Keeps keyboard focus inside a dialog (`<div role="dialog" appFocusTrap>`):
 * - when it renders, focus moves to the element marked `data-autofocus`, else
 *   to the first focusable element, else to the host (give it `tabindex="-1"`);
 * - Tab / Shift+Tab cycle through the host's visible focusable elements and
 *   never reach the page behind it;
 * - when it is destroyed, focus returns to the element that had it before it
 *   opened (the button that opened the dialog), if that element still exists.
 *
 * Nested dialogs work: the innermost trap handles the key first and marks the
 * event as handled (`preventDefault`), so the traps around it ignore it.
 */
@Directive({
  selector: '[appFocusTrap]',
  standalone: true,
})
export class FocusTrapDirective implements OnDestroy {
  /** Return focus to the opener when the dialog closes (default true). */
  @Input({ transform: booleanAttribute }) appFocusTrapRestore = true;

  private readonly host: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly opener = (typeof document !== 'undefined' ? document.activeElement : null) as HTMLElement | null;

  constructor() {
    afterNextRender(() => this.focusInitial());
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || event.defaultPrevented) {
      return;
    }
    event.preventDefault();
    const items = this.focusable();
    if (!items.length) {
      this.host.focus();
      return;
    }
    const index = items.indexOf(document.activeElement as HTMLElement);
    const next = event.shiftKey
      ? index <= 0
        ? items.length - 1
        : index - 1
      : index === -1 || index === items.length - 1
        ? 0
        : index + 1;
    items[next].focus();
  }

  ngOnDestroy(): void {
    if (this.appFocusTrapRestore && this.opener?.isConnected && typeof this.opener.focus === 'function') {
      this.opener.focus({ preventScroll: true });
    }
  }

  private focusInitial(): void {
    const preferred = this.host.querySelector<HTMLElement>('[data-autofocus]');
    const target = preferred && this.isVisible(preferred) ? preferred : (this.focusable()[0] ?? this.host);
    target.focus({ preventScroll: true });
  }

  /** Focusable, visible elements of the host in DOM (tab) order. */
  private focusable(): HTMLElement[] {
    return Array.from(this.host.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => this.isVisible(el));
  }

  private isVisible(el: HTMLElement): boolean {
    return el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  }
}
