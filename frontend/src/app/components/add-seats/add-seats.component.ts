import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeatService } from '../../services/seat.service';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-add-seats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-seats.component.html',
  styleUrl: './add-seats.component.css'
})
export class AddSeatsComponent implements OnInit {

  flights: any[] = [];
  flightId: number = 0;
  seatClass: string = 'ECONOMY';

  constructor(
    private seatService: SeatService,
    private flightService: FlightService
  ) {}

  ngOnInit() {
    this.loadFlights();
  }

  loadFlights() {
    this.flightService.getFlights().subscribe({
      next: (res: any) => {
        console.log("Flights ", res);
        this.flights = res;
      },
      error: (err) => console.error(err)
    });
  }

  generate10Seats() {

    if (!this.flightId) {
      alert("Please select a flight ");
      return;
    }

    const seats: any[] = [];
    const columns = ['A', 'B', 'C', 'D'];

    let count = 0;
    let row = 1;

    while (count < 10) {
      for (let col of columns) {

        if (count >= 10) break;

        seats.push({
          flightId: this.flightId,
          seatNumber: `${row}${col}`,
          seatClass: this.seatClass,
          rowNumber: row,
          columnLetter: col,
          isWindow: col === 'A' || col === 'D',
          isAisle: col === 'B' || col === 'C',
          hasExtraLegroom: row === 1,
          priceMultiplier: row === 1 ? 1.5 : 1
        });

        count++;
      }
      row++;
    }

    console.log("Generated Seats ", seats);

    this.seatService.addSeats(seats).subscribe({
      next: () => alert("10 Seats added successfully "),
      error: (err) => {
        console.error(err);
        alert("Failed to add seats");
      }
    });
  }
}