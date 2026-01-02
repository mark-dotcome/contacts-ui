import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    CardModule,
    MessageModule
  ],
  template: `
    <div class="flex align-items-center justify-content-center min-h-screen">
      <div class="surface-card p-6 shadow-2 border-round w-full lg:w-4">
        <div class="text-center mb-5">
          <div class="text-primary mb-3">
            <i class="pi pi-users text-5xl"></i>
          </div>
          <div class="text-900 text-3xl font-medium mb-3">Contacts App</div>
          <span class="text-600 font-medium line-height-3">Sign in to manage your contacts</span>
        </div>

        @if (errorMessage) {
          <p-message severity="error" [text]="errorMessage" styleClass="w-full mb-3"></p-message>
        }

        <form (ngSubmit)="onLogin()">
          <label for="email" class="block text-900 font-medium mb-2">Email Address</label>
          <input 
            id="email" 
            type="email" 
            pInputText 
            [(ngModel)]="email" 
            name="email"
            class="w-full mb-3" 
            placeholder="Enter your email"
            required
          />

          <label for="password" class="block text-900 font-medium mb-2">Password</label>
          <p-password 
            id="password" 
            [(ngModel)]="password" 
            name="password"
            [feedback]="false" 
            styleClass="w-full mb-3"
            inputStyleClass="w-full"
            placeholder="Enter your password"
            [toggleMask]="true"
            required
          ></p-password>

          <div class="flex align-items-center justify-content-between mb-4">
            <div class="flex align-items-center">
              <p-checkbox 
                [(ngModel)]="rememberMe" 
                name="rememberMe"
                [binary]="true" 
                inputId="rememberMe"
              ></p-checkbox>
              <label for="rememberMe" class="ml-2 text-900">Remember me</label>
            </div>
            <a class="font-medium no-underline text-primary cursor-pointer">Forgot password?</a>
          </div>

          <p-button 
            type="submit"
            label="Sign In" 
            icon="pi pi-sign-in" 
            styleClass="w-full"
            [loading]="isLoading"
          ></p-button>
        </form>

        <div class="text-center mt-4">
          <span class="text-600">Don't have an account? </span>
          <a routerLink="/register" class="font-medium text-primary cursor-pointer">Sign up</a>
        </div>

        <div class="flex justify-content-center mt-4">
          <p-button 
            [icon]="themeService.isDarkTheme() ? 'pi pi-sun' : 'pi pi-moon'"
            [rounded]="true"
            [text]="true"
            (onClick)="themeService.toggleTheme()"
          ></p-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--primary-color) 0%, #818cf8 100%);
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService
  ) {}

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/contacts']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.detail || 'Login failed. Please check your credentials.';
      }
    });
  }
}
