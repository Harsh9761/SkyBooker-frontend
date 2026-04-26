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
  selectedSeat = '';

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
        console.log(" SEATS FROM API:", data); // IMPORTANT
        this.seats = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("❌ ERROR:", err);
      }
    });
}

  selectSeat(seatNumber: string) {
    this.selectedSeat = seatNumber;
  }

  confirmSeat() {

  if (!this.selectedSeat) return;

  this.router.navigate(['/booking'], {
    queryParams: {
      flightId: this.flightId,
      seat: this.selectedSeat
    }
  });
}

  
}