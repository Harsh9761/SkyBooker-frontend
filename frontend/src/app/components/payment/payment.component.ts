import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {

  bookingId: string = '';
  booking: any = null;

  passengers: any[] = [];

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {

    this.route.queryParams.subscribe(params => {

      this.bookingId = params['bookingId'] || '';

      console.log("DEBUG bookingId:", this.bookingId);

      if (this.bookingId) {
        this.loadData();
      } else {
        this.loading = false;
      }
    });
  }

  loadData() {

    this.loading = true;
    this.cdr.detectChanges();

    // STEP 1: booking fetch
    this.bookingService.getBookingById(this.bookingId).subscribe({
      next: (res: any) => {

        this.booking = res;
        console.log("BOOKING:", res);

        this.cdr.detectChanges();

        // STEP 2: passengers fetch (MULTIPLE FIX)
        this.bookingService.getPassengerByBookingId(this.bookingId).subscribe({
          next: (p: any) => {

            console.log("PASSENGERS:", p);

            this.passengers = Array.isArray(p) ? p : [p];

            this.loading = false;
            this.cdr.detectChanges();
          },

          error: (err) => {
            console.error("Passenger error:", err);
            this.loading = false;
          }
        });

      },

      error: (err) => {
        console.error("Booking error:", err);
        this.loading = false;
      }
    });
  }

  pay() {

    const bookingId = this.booking?.bookingId;
    const userId = this.authService.getUserId();
    const amount = this.booking?.totalFare;
    const email = this.booking?.contactEmail;
    const phone = this.booking?.contactPhone;

    const paymentRequest = {
      bookingId: bookingId ?? null,
      userId: userId ?? null,
      amount: amount ?? null,
      currency: "INR",
      paymentMode: "CARD"
    };

    if (!bookingId || !userId || !amount) {
      alert("Payment data incomplete");
      return;
    }

    this.bookingService.createPayment(paymentRequest).subscribe({
      next: (order: any) => {

        const options: any = {
          key: "rzp_test_SiVGHeftzgz1qm",
          amount: amount * 100,
          currency: "INR",
          name: "Flight Booking",
          description: "Ticket Payment",
          order_id: order.transactionId,

          handler: (response: any) => {

            this.http.post(
              'https://skybooker-payment-service.onrender.com/payments/process',
              null,
              {
                params: {
                  paymentId: order.paymentId,
                  transactionId: response.razorpay_payment_id,
                  status: 'PAID'
                }
              }
            ).subscribe({

              next: () => {

                this.http.post(
                  'https://skybooker-api-gateway.onrender.com/notifications/booking-confirmation',
                  {
                    userId: userId,
                    bookingId: bookingId,
                    email: email,
                    phone: phone
                  },
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + this.authService.getToken()
                    }
                  }
                ).subscribe();

                alert("Payment Successful ");
                this.router.navigate(['/']);
              },

              error: (err) => {
                console.error(err);
                alert("Payment verification failed");
              }
            });

          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      },

      error: (err) => {
        console.error(err);
        alert("Payment initiation failed");
      }
    });
  }
}