import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FlightService {

  API = "http://localhost:8080/flights";

  constructor(private http: HttpClient) {}

  searchFlights(origin: string, dest: string, date: string) {

    let url = `${this.API}/search?origin=${origin}&dest=${dest}&date=${date}`;

    return this.http.get(url);
  }

  getFlightById(flightId: string): Observable<any> {
    return this.http.get(`${this.API}/${flightId}`);
  }

  getFlights(): Observable<any[]> {
  return this.http.get<any[]>("http://localhost:8080/flights/all");
}
  deleteFlight(id: number) {
  const token = localStorage.getItem('token');

  return this.http.delete(
    `http://localhost:8080/flights/${id}`,
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
    'http://localhost:8080/flights',
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
    `http://localhost:8080/flights/${id}/status?status=${status}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}
}