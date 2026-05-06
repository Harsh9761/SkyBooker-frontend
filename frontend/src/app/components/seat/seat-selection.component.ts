import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SeatService } from '../../services/seat.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-selection.component.html',
  styleUrl: './seat-selection.component.css'
})
export class SeatSelectionComponent {

  flightId!: number;
  seats: any[] = [];

  // 🔥 CHANGED: single → multiple
  selectedSeats: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private seatService: SeatService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.flightId = +params['id'];
      this.loadSeats();
    });
  }

  loadSeats() {
    this.seatService.getSeatsByFlight(this.flightId)
      .subscribe({
        next: (data: any) => {
          this.seats = [...data];
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("ERROR:", err);
        }
      });
  }

  // 🔥 MULTI-SEAT TOGGLE LOGIC
  selectSeat(seatNumber: string) {

    const index = this.selectedSeats.indexOf(seatNumber);

    if (index > -1) {
      this.selectedSeats.splice(index, 1); // remove
    } else {
      this.selectedSeats.push(seatNumber); // add
    }
  }

  // 🔥 SEND MULTIPLE SEATS
  confirmSeat() {

    if (this.selectedSeats.length === 0) return;

    this.router.navigate(['/booking'], {
      queryParams: {
        flightId: this.flightId,
        seats: JSON.stringify(this.selectedSeats) // 👈 important
      }
    });
  }
}