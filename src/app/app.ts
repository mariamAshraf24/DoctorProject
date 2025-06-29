import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Register } from "./features/auth/register/register";
import { Login } from "./features/auth/login/login";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Register, Login],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'DoctorProject';
}
