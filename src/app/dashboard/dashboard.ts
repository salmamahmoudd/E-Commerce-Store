import { Component } from '@angular/core';
import { Navbar } from "../shared/navbar/navbar";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}
