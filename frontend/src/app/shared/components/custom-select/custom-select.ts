import {
  Component,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { Material } from '../../../materials/models/material.model';

@Component({
  selector: 'app-custom-select',
  imports: [],
  templateUrl: './custom-select.html',
  styleUrl: './custom-select.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelect),
      multi: true,
    },
  ],
})
export class CustomSelect implements ControlValueAccessor {
  private elementRef = inject(ElementRef);
  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  options = input.required<Material[]>();
  isOpen = signal<boolean>(false);
  selectedValue = signal<Material | null>(null);
  isDisabled = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      fromEvent(this.document, 'click')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event: Event) => {
          const target = event.target as Node | null;
          const clickedInside = target != null && this.elementRef.nativeElement.contains(target);
          if (!clickedInside) {
            this.isOpen.set(false);
          }
        });
    }
  }

  onChange: (value: Material | null) => void = () => {};
  onTouched = () => {};

  writeValue(value: Material | null): void {
    this.selectedValue.set(value);
  }

  registerOnChange(fn: (value: Material | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
    if (isDisabled) {
      this.isOpen.set(false);
    }
  }

  toggleOpen() {
    if (this.isDisabled()) return;
    this.onTouched();
    this.isOpen.update((v) => !v);
  }

  selectItem(item: Material) {
    if (this.isDisabled()) return;
    this.onTouched();
    this.selectedValue.set(item);
    this.isOpen.set(false);
    this.onChange(item);
  }
}
