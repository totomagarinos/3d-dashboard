import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInput } from '../../../shared/components';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, CustomInput],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  private settingsService = inject(SettingsService);
  private destroyRef = inject(DestroyRef);

  loading = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  calculatorForm = new FormGroup({
    electricityPricePerKwH: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    consumptionWatts: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    machineWearPerHour: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    partsPrice: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    errorMarginPercentage: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
  });

  constructor() {
    effect(() => {
      const data = this.settingsService.settingsData();
      if (data) {
        this.calculatorForm.patchValue(data, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    if (!this.settingsService.settingsData()) {
      this.settingsService
        .loadSettings()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          error: () => this.error.set('Error al cargar configuraciones'),
        });
    }
  }

  onSubmit(): void {
    if (this.calculatorForm.invalid) {
      this.calculatorForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.successMessage.set(null);

    const rawForm = this.calculatorForm.getRawValue();

    const formData = {
      electricityPricePerKwH: Number(rawForm.electricityPricePerKwH),
      consumptionWatts: Number(rawForm.consumptionWatts),
      machineWearPerHour: Number(rawForm.machineWearPerHour),
      partsPrice: Number(rawForm.partsPrice),
      errorMarginPercentage: Number(rawForm.errorMarginPercentage),
    };

    this.settingsService.updateSettings(formData).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Settings saved!');
        setTimeout(() => {
          this.successMessage.set(null);
        }, 3000);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to save settings');
      },
    });
  }
}
