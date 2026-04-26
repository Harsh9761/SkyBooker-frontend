import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BookingService {

  API = "http://localhost:8080/bookings";

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
    `http://localhost:8080/passengers/booking/${bookingId}`,
    this.getHeaders()
  );
}
}