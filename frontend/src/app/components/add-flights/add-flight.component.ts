import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-add-flight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-flight.component.html',
  styleUrl: './add-flight.component.css'
})
export class AddFlightComponent {

  flight: any = {
    flightNumber: '',
    originAirportCode: '',
    destinationAirportCode: '',
    departureTime: '',
    arrivalTime: '',
    durationMinutes: 0,
    aircraftType: '',
    totalSeats: 0,
    availableSeats: 0,
    basePrice: 0,
    status: '',
    airlineId: null
  };

  constructor(
    private flightService: FlightService,
    private router: Router
  ) {}

  submit() {
    console.log("Submitting:", this.flight);

    this.flightService.addFlight(this.flight).subscribe({
      next: () => {
        alert("Flight added successfully ✈");
        this.router.navigate(['/flights']);
      },
      error: (err) => {
        console.error(err);
        alert("Failed to add flight ❌");
      }
    });
  }
}