import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule,HttpClientModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {

  bookingId: string = '';
  booking: any = null;
  passenger: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router,
    private cdr: ChangeDetectorRef,   // detect changes
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
        this.cdr.detectChanges();
      }
    });
  }

  loadData() {

    this.loading = true;
    this.cdr.detectChanges(); // UI update

    //  STEP 1: booking fetch
    this.bookingService.getBookingById(this.bookingId).subscribe({
      next: (res: any) => {

        this.booking = res;
        console.log("BOOKING:", res);

        this.cdr.detectChanges(); // UI update

        //  STEP 2: passenger fetch
        this.bookingService.getPassengerByBookingId(this.bookingId).subscribe({
          next: (p: any) => {

            console.log("PASSENGER:", p);

            this.passenger = Array.isArray(p) ? p[0] : p;

            this.loading = false;
            this.cdr.detectChanges(); // FINAL UI update
          },

          error: (err) => {
            console.error("Passenger error:", err);

            this.loading = false;
            this.cdr.detectChanges();
          }
        });

      },

      error: (err) => {
        console.error("Booking error:", err);

        this.loading = false;
        this.cdr.detectChanges();
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
    console.error("Missing fields:", paymentRequest);
    alert("Payment data incomplete");
    return;
  }

  // STEP 1: create order
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

          // ✅ STEP 2: CALL PAYMENT SERVICE DIRECTLY (IMPORTANT FIX)
          this.http.post(
            'http://localhost:8086/payments/process',
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

              // ✅ STEP 3: Notification (same as before)
              this.http.post(
                'http://localhost:8080/notifications/booking-confirmation',
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
              ).subscribe({
                next: () => console.log("Notification sent"),
                error: err => console.error("Notification failed", err)
              });

              alert("Payment Successful ✔");
              this.router.navigate(['/']);
            },

            error: (err) => {
              console.error("Payment process failed:", err);
              alert("Payment verification failed");
            }
          });

        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    },

    error: (err) => {
      console.error("Payment API failed:", err);
      alert("Payment initiation failed");
    }
  });
}
}