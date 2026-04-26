import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css'
})
export class MyBookingsComponent implements OnInit {

  bookings: any[] = [];
  passengerMap: any = {};   // NEW
  loading = true;

  constructor(
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    const userId = this.getUserId();

    if (!userId) {
      this.loading = false;
      return;
    }

    this.bookingService.getMyBookings(userId).subscribe({
      next: (data: any) => {

        this.bookings = Array.isArray(data) ? data : (data?.data || []);

        //  fetch passengers for each booking
        this.bookings.forEach((b: any) => {

          this.bookingService.getPassengerByBookingId(b.bookingId)
            .subscribe({
              next: (p: any) => {
                console.log("PASSENGER RESPONSE:", p);
                this.passengerMap = {
                ...this.passengerMap,
                [String(b.bookingId).trim()]: p
              };
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.warn("Passenger not found:", err);
              }
            });

        });

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getUserId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch {
      return null;
    }
  }
}