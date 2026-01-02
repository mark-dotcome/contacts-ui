import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  isDarkTheme = signal<boolean>(false);

  constructor() {
    this.loadTheme();
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme === 'dark') {
      this.setDarkTheme(true);
    }
  }

  toggleTheme(): void {
    this.setDarkTheme(!this.isDarkTheme());
  }

  setDarkTheme(isDark: boolean): void {
    this.isDarkTheme.set(isDark);
    localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');
    
    if (isDark) {
      document.body.classList.add('dark-theme');
      this.loadDarkTheme();
    } else {
      document.body.classList.remove('dark-theme');
      this.loadLightTheme();
    }
  }

  private loadDarkTheme(): void {
    const themeLink = document.getElementById('theme-link') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = 'primeng/resources/themes/lara-dark-blue/theme.css';
    }
  }

  private loadLightTheme(): void {
    const themeLink = document.getElementById('theme-link') as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = 'primeng/resources/themes/lara-light-blue/theme.css';
    }
  }
}
