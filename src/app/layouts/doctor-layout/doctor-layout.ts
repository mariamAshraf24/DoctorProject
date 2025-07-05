import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "../../features/doctor/navbar/navbar";
import { Footer } from "../../features/doctor/footer/footer";

@Component({
  selector: 'app-doctor-layout',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './doctor-layout.html',
  styleUrl: './doctor-layout.scss'
})
export class DoctorLayout {

}
