import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { DecimalInputDirective } from './decimal-input.directive';

@Component({
  standalone: true,
  imports: [FormsModule, DecimalInputDirective],
  template: `
    <input class="plain" appDecimalInput [(ngModel)]="plain" />
    <input class="grouped" appDecimalInput thousands [(ngModel)]="grouped" />
  `,
})
class HostComponent {
  plain: number | null = null;
  grouped: number | null = null;
}

function type(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.setSelectionRange(value.length, value.length);
  input.dispatchEvent(new Event('input'));
}

describe('DecimalInputDirective — thousands', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let grouped: HTMLInputElement;
  let plain: HTMLInputElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    grouped = fixture.nativeElement.querySelector('input.grouped');
    plain = fixture.nativeElement.querySelector('input.plain');
  });

  it('groups thousands while typing and emits the clean number', () => {
    type(grouped, '1234567');
    expect(grouped.value).toBe('1,234,567');
    expect(host.grouped).toBe(1234567);
  });

  it('keeps a half-typed decimal part as typed', () => {
    type(grouped, '1000.5');
    expect(grouped.value).toBe('1,000.5');
    expect(host.grouped).toBe(1000.5);
  });

  it('shows the full 1,000.00 format on blur', () => {
    type(grouped, '1000');
    grouped.dispatchEvent(new Event('blur'));
    expect(grouped.value).toBe('1,000.00');
    expect(host.grouped).toBe(1000);
  });

  it('keeps the caret after the same digit when a comma is inserted', () => {
    grouped.value = '100';
    grouped.dispatchEvent(new Event('input'));
    grouped.value = '1000';
    grouped.setSelectionRange(4, 4);
    grouped.dispatchEvent(new Event('input'));
    expect(grouped.value).toBe('1,000');
    expect(grouped.selectionStart).toBe(5);
  });

  it('formats a value written from the model', fakeAsync(() => {
    host.grouped = 2500.5;
    fixture.detectChanges();
    tick();
    expect(grouped.value).toBe('2,500.50');
  }));

  it('leaves fields without the flag unchanged', () => {
    type(plain, '1234567');
    plain.dispatchEvent(new Event('blur'));
    expect(plain.value).toBe('1234567');
    expect(host.plain).toBe(1234567);
  });
});
