import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  constructor(private _router: Router) {}

  logout(): void {
    localStorage.clear();
    this._router.navigate(['/login']);
  }

  goToProfile() {
    this._router.navigate(['/doctor/profile']);
  }
}
