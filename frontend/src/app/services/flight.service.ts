import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FlightService {

  API = "https://skybooker-api-gateway.onrender.com/flights";

  constructor(private http: HttpClient) {}

  searchFlights(origin: string, dest: string, date: string) {

    let url = `${this.API}/search?origin=${origin}&dest=${dest}&date=${date}`;

    return this.http.get(url);
  }

  getFlightById(flightId: string): Observable<any> {
    return this.http.get(`${this.API}/${flightId}`);
  }

  getFlights(): Observable<any[]> {
  return this.http.get<any[]>("https://skybooker-api-gateway.onrender.com/flights/all");
}
  deleteFlight(id: number) {
  const token = localStorage.getItem('token');

  return this.http.delete(
    `https://skybooker-api-gateway.onrender.com/flights/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

  addFlight(data: any) {
  const token = localStorage.getItem('token');

  return this.http.post(
    'https://skybooker-api-gateway.onrender.com/flights',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}

  updateStatus(id: number, status: string) {
  const token = localStorage.getItem('token');

  return this.http.patch(
    `https://skybooker-api-gateway.onrender.com/flights/${id}/status?status=${status}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}
}