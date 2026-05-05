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
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-calculator',
  imports: [ReactiveFormsModule, DecimalPipe, CustomSelect, CustomInput],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})
export class Calculator implements OnInit {
  protected readonly calculatorService = inject(CalculatorService);
  protected readonly materialService = inject(MaterialService);
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
    electricityPricePerKwH: new FormControl(140, { nonNullable: true }),
    consumptionWatts: new FormControl(120, { nonNullable: true }),
    machineWearPerHour: new FormControl(4320, { nonNullable: true }),
    partsPrice: new FormControl(150000, { nonNullable: true }),
    suppliesPrice: new FormControl(0, { nonNullable: true }),
    errorMarginPercentage: new FormControl(5, { nonNullable: true }),
    profitMultiplier: new FormControl<number | null>(null),
  });

  result = signal<CalculatorOutput | null>(null);

  ngOnInit(): void {
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

    const savedForm = this.storageService.getData(this.STORAGE_KEY);
    if (savedForm) {
      this.calculatorForm.patchValue(savedForm);
    }

    const savedResult = this.storageService.getData<CalculatorOutput>(this.STORAGE_KEY + '_result');
    if (savedResult) {
      this.result.set(savedResult);
    }
  }

  calculate() {
    const formValue = this.calculatorForm.getRawValue();

    const material = formValue.material;
    if (material == null) {
      return;
    }

    const input: CalculatorInput = {
      grams: formValue.grams,
      hours: formValue.hours,
      material,
      electricityPricePerKwH: formValue.electricityPricePerKwH,
      consumptionWatts: formValue.consumptionWatts,
      machineWearPerHour: formValue.machineWearPerHour,
      partsPrice: formValue.partsPrice,
      suppliesPrice: formValue.suppliesPrice,
      errorMarginPercentage: formValue.errorMarginPercentage,
      profitMultiplier: formValue.profitMultiplier ?? 2,
    };

    const output = this.calculatorService.calculate(input);
    this.result.set(output);

    this.storageService.setData(this.STORAGE_KEY + '_result', output);
  }
}
