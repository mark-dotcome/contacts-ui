import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenubarModule,
    ButtonModule,
    AvatarModule,
    MenuModule
  ],
  template: `
    <div class="min-h-screen flex flex-column">
      <header class="surface-card shadow-1">
        <div class="flex align-items-center justify-content-between px-2 md:px-4 py-2 md:py-3">
          <div class="flex align-items-center gap-2 md:gap-3">
            <div class="text-primary">
              <i class="pi pi-users text-xl md:text-2xl"></i>
            </div>
            <span class="text-lg md:text-xl font-bold text-900">Contacts App</span>
          </div>

          <div class="flex align-items-center gap-1 md:gap-3">
            <p-button 
              [icon]="themeService.isDarkTheme() ? 'pi pi-sun' : 'pi pi-moon'"
              [rounded]="true"
              [text]="true"
              (onClick)="themeService.toggleTheme()"
              pTooltip="Toggle theme"
            ></p-button>

            <p-button 
              icon="pi pi-bell"
              [rounded]="true"
              [text]="true"
              [badge]="'3'"
              badgeSeverity="danger"
              class="hidden md:inline-flex"
            ></p-button>

            <p-button 
              icon="pi pi-cog"
              [rounded]="true"
              [text]="true"
              class="hidden md:inline-flex"
            ></p-button>

            <div class="flex align-items-center gap-2 cursor-pointer" (click)="userMenu.toggle($event)">
              <p-avatar 
                [label]="getUserInitials()" 
                styleClass="bg-primary text-white"
                shape="circle"
              ></p-avatar>
            </div>
            <p-menu #userMenu [model]="userMenuItems" [popup]="true"></p-menu>
          </div>
        </div>
      </header>

      <main class="flex-grow-1 overflow-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class LayoutComponent {
  userMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user'
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog'
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.authService.logout()
    }
  ];

  constructor(
    public authService: AuthService,
    public themeService: ThemeService
  ) {}

  getUserInitials(): string {
    const user = this.authService.currentUser();
    if (user) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return 'U';
  }
}
