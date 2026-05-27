import { DecimalPipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalculatorService } from '../../services/calculator.service';
import { Material } from '../../../materials/models/material.model';
import { CalculatorInput, CalculatorOutput } from '../../models/calculator.model';
import { MaterialService } from '../../../materials/services/material.service';
import { CustomInput, CustomSelect } from '../../../shared/components';
import { StorageService } from '../../../shared/services/storage.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SettingsService } from '../../../settings/services/settings.service';
import { debounceTime } from 'rxjs';
import { OrderService } from '../../../orders/services/order.service';

@Component({
  selector: 'app-calculator',
  imports: [ReactiveFormsModule, DecimalPipe, CustomSelect, CustomInput],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})
export class Calculator implements OnInit {
  protected readonly calculatorService = inject(CalculatorService);
  protected readonly materialService = inject(MaterialService);
  protected readonly settingsService = inject(SettingsService);

  private destroyRef = inject(DestroyRef);
  private storageService = inject(StorageService);

  private readonly STORAGE_KEY = 'calculator_draft';

  materials = this.materialService.materials;
  materialsArray = computed(() => Array.from(this.materials().values()));

  calculatorForm = new FormGroup({
    grams: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    hours: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.1)],
    }),
    material: new FormControl<Material | null>(null),
    suppliesPrice: new FormControl(0, { nonNullable: true }),
    profitMultiplier: new FormControl<number | null>(null),
  });

  result = signal<CalculatorOutput | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    // 1. Restaurar auto-guardado primero
    const savedForm = this.storageService.getData(this.STORAGE_KEY);
    if (savedForm) {
      this.calculatorForm.patchValue(savedForm);
    }

    const savedResult = this.storageService.getData<CalculatorOutput>(this.STORAGE_KEY + '_result');
    if (savedResult) {
      this.result.set(savedResult);
    }

    // 2. Cargar settings y calcular si hay material
    if (!this.settingsService.settingsData()) {
      this.settingsService
        .loadSettings()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            if (this.calculatorForm.getRawValue().material) {
              this.calculate();
            }
          },
          error: () => this.error.set('Error al cargar los costos fijos.'),
        });
    } else if (this.calculatorForm.getRawValue().material) {
      this.calculate();
    }

    // 3. Subscribir valueChanges para futuros cambios del usuario
    this.calculatorForm.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((actualValues) => {
        this.storageService.setData(this.STORAGE_KEY, actualValues);

        if (actualValues.material) {
          this.calculate();
        } else {
          this.result.set(null);
        }
      });
  }

  calculate() {
    const formValue = this.calculatorForm.getRawValue();
    const settings = this.settingsService.settingsData();

    const material = formValue.material;
    if (!material || !settings) return;

    const input: CalculatorInput = {
      grams: formValue.grams,
      hours: formValue.hours,
      material,
      suppliesPrice: formValue.suppliesPrice * 1.3,
      profitMultiplier: formValue.profitMultiplier ?? 2,

      electricityPricePerKwH: settings.electricityPricePerKwH,
      consumptionWatts: settings.consumptionWatts,
      machineWearPerHour: settings.machineWearPerHour,
      partsPrice: settings.partsPrice,
      errorMarginPercentage: settings.errorMarginPercentage,
    };

    const output = this.calculatorService.calculate(input);
    this.result.set(output);

    this.storageService.setData(this.STORAGE_KEY + '_result', output);
  }
}
