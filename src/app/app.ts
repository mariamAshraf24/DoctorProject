import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Profile } from "./features/doctor/profile/profile";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Profile],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'DoctorProject';
}
