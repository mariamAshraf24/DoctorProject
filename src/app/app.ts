import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ForgotPassword } from "./features/forgot-password/forgot-password";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'DoctorProject';
}
