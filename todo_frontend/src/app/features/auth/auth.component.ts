import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-auth',
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatTabsModule, MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  mode = signal<'login'|'register'>('register');
  loading = signal(false);
  errorMsg = signal<string|null>(null);
  successMsg = signal<string|null>(null);
  isLogin = computed(() => this.mode() === 'login');

  registerForm = this.fb.nonNullable.group({
    ident: [null, [Validators.required, Validators.min(1)]],
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellido: ['', [Validators.required, Validators.maxLength(100)]],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loginForm = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  switchMode(m: 'login'|'register') { this.errorMsg.set(null); this.successMsg.set(null); this.mode.set(m); }

  onRegister() {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    this.loading.set(true);
    this.auth.register(this.registerForm.getRawValue()).subscribe({
      next: () => { this.successMsg.set('Registro exitoso. Inicia sesión.'); this.switchMode('login'); },
      error: (e) => this.errorMsg.set(e?.error?.error || 'Error en registro')
    }).add(() => this.loading.set(false));
  }

  onLogin() {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.loading.set(true);
    this.auth.login(this.loginForm.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/todo'),
      error: (e) => this.errorMsg.set(e?.error?.error || 'Credenciales inválidas')
    }).add(() => this.loading.set(false));
  }
}
