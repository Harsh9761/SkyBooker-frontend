import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../services/flight.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl:'./dashboard.component.css'
})
export class DashboardComponent {

  origin = '';
  dest = '';
  date = '';
  flights: any[] = [];

  constructor(
    private flightService: FlightService,
    private cdr: ChangeDetectorRef ,
    private router: Router,
    public auth: AuthService
  ) {}

  
  

  search() {

    this.flightService.searchFlights(this.origin, this.dest, this.date)
      .subscribe({
        next: (data: any) => {
          this.flights = data;

          // FORCE UI UPDATE
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }


  selectFlight(flightId: number) {
    this.router.navigate(['/seat-selection', flightId]);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  bookFlight(flightId: number) {
  this.router.navigate(['/seat-selection', flightId]);
}

ngOnInit() {
  const token = localStorage.getItem('token');
  console.log("TOKEN:", token);

  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("EXP:", payload.exp * 1000);
    console.log("NOW:", Date.now());
  }

  console.log("LOGIN STATUS:", this.auth.isLoggedIn());
}
}