import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SeatService {

  API = "https://skybooker-api-gateway.onrender.com/seats";

  constructor(private http: HttpClient) {}

  getSeatsByFlight(flightId: number) {

  const token = localStorage.getItem("token");

  return this.http.get(`${this.API}/flight/${flightId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

  holdSeat(flightId: number, seatNumber: string, userId: string) {

  const token = localStorage.getItem("token"); // FIX

  return this.http.put(`${this.API}/hold`, null, {
    params: {
      flightId,
      seatNumber
    },
    headers: {
      'X-User-Id': userId,
      'Authorization': `Bearer ${token}`
    }
  });
}

  releaseSeat(flightId: number, seatNumber: string) {
    return this.http.put(`${this.API}/release`, null, {
      params: {
        flightId,
        seatNumber
      }
    });
  }

  addSeats(seats: any[]) {
  const token = localStorage.getItem('token');

  return this.http.post(
    'https://skybooker-api-gateway.onrender.com/seats/add',
    seats,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}
}