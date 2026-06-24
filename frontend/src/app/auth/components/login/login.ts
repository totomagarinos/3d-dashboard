import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CustomInput } from '../../../shared/components';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { appRoutes } from '../../../app.routes';
import { LocalKeys, LocalManager } from '../../../shared/services';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CustomInput, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  localManager = inject(LocalManager);
  authService = inject(AuthService);
  router = inject(Router);

  appRoutes = appRoutes;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = new FormGroup<LoginForm>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    this.localManager.removeData(LocalKeys.ACCESS_TOKEN);
    this.localManager.removeData(LocalKeys.REFRESH_TOKEN);
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      await firstValueFrom(this.authService.login(this.loginForm.getRawValue()));

      this.router.navigate([`${appRoutes.private.root}/${appRoutes.private.calculator}`], {
        replaceUrl: true,
      });
    } catch (error) {
      this.errorMessage.set('Error al iniciar sesión. Verifica tus credenciales');
    } finally {
      this.isLoading.set(false);
      this.loginForm.reset();
    }
  }
}
