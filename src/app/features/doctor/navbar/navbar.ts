import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink , CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  constructor(private _router: Router,
    public _themeService: ThemeService
  ) {}

   toggleTheme() {
    const isDark = !this._themeService.isDarkTheme();
    this._themeService.toggleTheme(isDark);
  }
  
  logout(): void {
    localStorage.clear();
    this._router.navigate(['/login']);
  }

  goToProfile() {
    this._router.navigate(['/doctor/profile']);
  }
}
