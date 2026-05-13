import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {

  flightId!: number;
  seatNumbers: string[] = [];

  passengers: any[] = [];

  contactEmail = '';
  contactPhone = '';
  mealPreference = 'veg';
  luggageKg = 0;

  todayDate: string = new Date().toISOString().split('T')[0];
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router,
    private auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {

    this.route.queryParams.subscribe(params => {

      this.flightId = Number(params['flightId']);

      try {
        this.seatNumbers = JSON.parse(params['seats'] || '[]');
      } catch (e) {
        this.seatNumbers = [];
      }

      if (this.seatNumbers.length === 0) {
        console.error("No seats selected");
        return;
      }

      this.passengers = this.seatNumbers.map(() => ({
        title: 'Mr',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'Male',
        passportNumber: '',
        passportExpiry: '',
        nationality: ''
      }));
    });
  }


  isValidPassenger(passenger: any): boolean {

    const today = new Date().toISOString().split('T')[0];

    // DOB must be past
    if (passenger.dateOfBirth >= today) {
      return false;
    }

    // Passport expiry must be future
    if (passenger.passportExpiry <= today) {
      return false;
    }

    return true;
  }

  validateAllPassengers(): boolean {
    return this.passengers.every(p => this.isValidPassenger(p));
  }



  createBooking() {

  
    if (!this.validateAllPassengers()) {
      alert("Please fix DOB / Passport expiry dates");
      return;
    }

    const request = {
      userId: Number(this.auth.getUserId()),
      flightId: this.flightId,
      seatNumbers: this.seatNumbers,
      contactEmail: this.contactEmail,
      contactPhone: this.contactPhone,
      mealPreference: this.mealPreference,
      luggageKg: Number(this.luggageKg),
      tripType: "ONE_WAY"
    };

    this.bookingService.createBooking(request)
      .subscribe({
        next: (res: any) => {

          const bookingId = res.bookingId;
          const token = localStorage.getItem('token');

          let completed = 0;

          this.seatNumbers.forEach((seat, index) => {

            const passenger = this.passengers[index];

            const payload = {
              bookingId,
              ...passenger,
              seatNumber: seat,
              flightId: this.flightId
            };

            this.http.post(
              "https://skybooker-api-gateway.onrender.com/passengers",
              payload,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            ).subscribe({
              next: () => {

                completed++;

                if (completed === this.seatNumbers.length) {
                  this.router.navigate(['/payment'], {
                    queryParams: { bookingId }
                  });
                }
              },
              error: (err) => {
                console.error("Passenger save failed:", err);
              }
            });

          });

        },
        error: (err) => {
          console.error("Booking failed:", err);
        }
      });
  }
}