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

  flightId: any;
  seatNumber: any;

  contactEmail = '';
  contactPhone = '';
  mealPreference = 'veg';
  luggageKg = 0;

  passenger = {
    title: 'Mr',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    passportNumber: '',
    passportExpiry: '',
    nationality: ''
  };

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router,
    private auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.flightId = params['flightId'];
      this.seatNumber = params['seat'];
    });
  }

  createBooking() {

  const request = {
    userId: this.auth.getUserId(),
    flightId: this.flightId,
    seatNumber: this.seatNumber,
    contactEmail: this.contactEmail,
    contactPhone: this.contactPhone,
    mealPreference: this.mealPreference,
    luggageKg: this.luggageKg,
    tripType: "ONE_WAY"
  };

  this.bookingService.createBooking(request)
    .subscribe({
      next: (res: any) => {

        const bookingId = res.bookingId;

        const passengerPayload = {
          bookingId: bookingId,
          ...this.passenger, 
          seatNumber: this.seatNumber
        };

        const token = localStorage.getItem('token');

this.http.post(
  "http://localhost:8080/passengers",
  passengerPayload,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
).subscribe({
  next: () => {
    console.log("Passenger saved ✔");
    this.router.navigate(['/payment'], {
      queryParams: { bookingId }
    });
  },
  error: (err) => console.error(err)
});

      },
      error: (err) => console.error(err)
    });
}

  pay(bookingId: string, method: string) {
    return this.bookingService.pay(bookingId, method);
  }

  paymentCallback(paymentId: string, transactionId: string, status: string) {
    return this.bookingService.paymentCallback(paymentId, transactionId, status);
  }

  todayDate: string = new Date().toISOString().split('T')[0];
  
}