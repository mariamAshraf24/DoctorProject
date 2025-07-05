import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "../../features/doctor/navbar/navbar";

@Component({
  selector: 'app-doctor-layout',
  imports: [RouterOutlet, Navbar],
  templateUrl: './doctor-layout.html',
  styleUrl: './doctor-layout.scss'
})
export class DoctorLayout {

}
