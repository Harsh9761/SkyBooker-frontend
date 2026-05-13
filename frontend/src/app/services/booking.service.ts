import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BookingService {

  API = "https://skybooker-api-gateway.onrender.com/bookings";

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  createBooking(data: any) {
    return this.http.post(
      this.API,
      data,
      this.getHeaders()
    );
  }

  pay(bookingId: string, method: string) {
    return this.http.post(
      `${this.API}/${bookingId}/pay`,
      null,
      {
        params: { method },
        ...this.getHeaders()
      }
    );
  }

  paymentCallback(paymentId: string, transactionId: string, status: string) {
    return this.http.post(
      `${this.API}/payment/callback`,
      null,
      {
        params: { paymentId, transactionId, status },
        ...this.getHeaders()
      }
    );
  }

  getMyBookings(userId: number) {
  return this.http.get(
    `${this.API}/upcoming/${userId}`,
    this.getHeaders()
  );
}

getPassengerByBookingId(bookingId: string) {
  return this.http.get(
    `https://skybooker-api-gateway.onrender.com/passengers/booking/${bookingId}`,
    this.getHeaders()
  );
}

getBookingById(bookingId: string) {
  return this.http.get(
    `${this.API}/${bookingId}`,
    this.getHeaders()
  );
}

cancelBooking(bookingId: string) {

  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.put(
    `https://skybooker-api-gateway.onrender.com/bookings/${bookingId}/cancel`,
    {},
    { headers }
  );
}

refundPayment(paymentId: string) {
  return this.http.post(
    `https://skybooker-payment-service.onrender.com/payments/refund/${paymentId}`,
    {}
  );
}

createPayment(data: any) {
  return this.http.post(
    "https://skybooker-payment-service.onrender.com/payments/initiate",
    data,
    this.getHeaders()
  );
}
}