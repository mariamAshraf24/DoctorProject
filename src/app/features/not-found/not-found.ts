import { Component } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss'
})
export class NotFound {
    adminFlag = false;
  constructor(private _auth: Auth) {
    this.adminFlag = this._auth.isAdmin();
  }
}
