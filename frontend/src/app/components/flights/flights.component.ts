import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../services/flight.service';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './flights.component.html',
  styleUrl: './flights.component.css'
})
export class FlightsComponent implements OnInit {

  flights: any[] = [];
  role: string = '';

  constructor(private flightService: FlightService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadFlights();
    this.role = this.authService.getRole();
    console.log("ROLE ", this.role);
  }

   loadFlights() {
  this.flightService.getFlights().subscribe({
    next: (res: any[]) => {
        console.log("API RESPONSE ", res);
      this.flights = res;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error("Error loading flights", err);
    }
  });
}
  deleteFlight(id: number) {
    if (!confirm("Delete this flight?")) return;

    this.flightService.deleteFlight(id).subscribe(() => {
      this.loadFlights();
    });
  }

  updateStatus(id: number, status: string) {
  this.flightService.updateStatus(id, status).subscribe({
    next: () => {
      this.loadFlights(); // refresh list
    },
    error: (err) => {
      console.error("Status update failed", err);
    }
  });
}
}