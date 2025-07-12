import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkThemeClass = 'dark-theme';

  toggleTheme(isDark: boolean): void {
    const body = document.body;
    isDark
      ? body.classList.add(this.darkThemeClass)
      : body.classList.remove(this.darkThemeClass);
  }

  isDarkTheme(): boolean {
    return document.body.classList.contains(this.darkThemeClass);
  }
}
