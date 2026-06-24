import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { appRoutes } from '../../../app.routes';
import { firstValueFrom } from 'rxjs';
import { CustomInput } from '../../../shared/components';

interface RegisterForm {
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CustomInput, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  authService = inject(AuthService);
  router = inject(Router);

  appRoutes = appRoutes;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  registerForm = new FormGroup<RegisterForm>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  async onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      await firstValueFrom(this.authService.register(this.registerForm.getRawValue()));

      this.router.navigate([`${appRoutes.private.root}/${appRoutes.private.calculator}`], {
        replaceUrl: true,
      });
    } catch (error) {
      this.errorMessage.set('Error al crear cuenta.');
    } finally {
      this.isLoading.set(false);
      this.registerForm.reset();
    }
  }
}
