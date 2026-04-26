import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {

  bookingId: string = '';

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.bookingId = params['bookingId'];
    });
  }

  pay() {

    this.bookingService.pay(this.bookingId, "CARD")
      .subscribe({
        next: (res: any) => {

          console.log("PAYMENT INITIATED:", res);

          // CALLBACK → mark as PAID
          this.bookingService.paymentCallback(
            res.paymentId,
            "TXN_" + Date.now(),
            "PAID"
          ).subscribe({
            next: () => {
              console.log("PAYMENT COMPLETED ✔");

              // redirect to dashboard
              this.router.navigate(['/']);
            },
            error: (err) => {
              console.error("Callback error:", err);
            }
          });

        },
        error: (err) => {
          console.error("Payment error:", err);
        }
      });
  }
}