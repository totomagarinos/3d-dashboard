import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { MaterialService } from '../../services/material.service';
import { CreateMaterialDTO } from '../../models/material.model';
import { CustomInput } from '../../../shared/components';

interface MaterialFormType {
  type: FormControl<string>;
  brand: FormControl<string>;
  weight: FormControl<number>;
  price: FormControl<number>;
}

@Component({
  selector: 'app-material-form',
  imports: [ReactiveFormsModule, CustomInput],
  templateUrl: './material-form.html',
  styleUrl: './material-form.css',
})
export class MaterialForm {
  readonly id = input<string | null>(null);
  readonly closeForm = output<void>();

  private readonly materialService = inject(MaterialService);

  error = signal<string | null>(null);
  loading = signal<boolean>(false);

  materialForm = new FormGroup<MaterialFormType>({
    type: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    brand: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    weight: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    price: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
  });

  constructor() {
    effect(() => {
      const currentId = this.id();

      if (currentId) {
        const materialToEdit = this.materialService.materials().get(currentId);
        if (materialToEdit) {
          this.materialForm.patchValue(materialToEdit);
        }
      } else {
        this.materialForm.reset();
      }
    });
  }

  onSubmit(): void {
    if (this.materialForm.invalid) return;

    this.error.set(null);
    this.loading.set(true);

    const rawForm = this.materialForm.getRawValue();

    const formData: CreateMaterialDTO = {
      type: rawForm.type,
      brand: rawForm.brand,
      weight: Number(rawForm.weight),
      price: Number(rawForm.price),
    };

    const currentId = this.id();
    const operation$ = currentId
      ? this.materialService.updateMaterial(currentId, formData)
      : this.materialService.createMaterial(formData);

    operation$
      .pipe(
        catchError((err) => {
          this.error.set('Error al guardar el material. Intentalo de nuevo.');
          return of(null);
        }),
      )
      .subscribe(() => {
        this.loading.set(false);
        if (!this.error()) {
          this.closeForm.emit();
        }
      });
  }
}
