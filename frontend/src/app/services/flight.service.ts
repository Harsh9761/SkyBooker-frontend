import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FlightService {

  API = "http://localhost:8080/flights";

  constructor(private http: HttpClient) {}

  searchFlights(origin: string, dest: string, date: string) {

    let url = `${this.API}/search?origin=${origin}&dest=${dest}&date=${date}`;

    return this.http.get(url);
  }
}