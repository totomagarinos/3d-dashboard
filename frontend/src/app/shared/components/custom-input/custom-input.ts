import { Component, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  imports: [ReactiveFormsModule],
  templateUrl: './custom-input.html',
  styleUrl: './custom-input.css',
})
export class CustomInput {
  control = input.required<AbstractControl | null>();
  label = input.required<string>();
  suffix = input<string>('');
  type = input<string>('number');
  placeholder = input<string>('');
  errorMessage = input<string>('Campo requerido');
}
