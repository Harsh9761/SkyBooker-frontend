import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { FlightService } from '../../services/flight.service';

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
  flightMap: any = {};
  loading = true;

  constructor(
    private bookingService: BookingService,
    private flightService: FlightService,
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

        this.flightService.getFlights().subscribe((flights: any) => {
          console.log("FLIGHTS RESPONSE:", flights);
          flights.forEach((f: any) => {
            this.flightMap[f.flightId] = f;
          });

        });
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

  getPassenger(bookingId: string) {
  return this.passengerMap?.[bookingId] || [];
}

cancel(bookingId: string) {

  const booking = this.bookings.find(
    b => String(b.bookingId).trim() === String(bookingId).trim()
  );

  if (!booking) {
    alert("Booking not found");
    return;
  }

  if (booking.status === 'CANCELLED') {
    return;
  }

  if (!confirm("Cancel this booking?")) return;

  this.bookingService.cancelBooking(bookingId).subscribe({
    next: () => {

      // UI update only
      this.bookings = this.bookings.map(b => {
        if (String(b.bookingId) === String(bookingId)) {
          return { ...b, status: 'CANCELLED' };
        }
        return b;
      });

      alert("Booking Cancelled ✔");
    },

    error: () => {
      alert("Cancel failed ❌");
    }
  });
}
}