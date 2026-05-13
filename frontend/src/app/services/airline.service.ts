import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AirlineDTO {
  airlineId?: number;
  name: string;
  iataCode: string;
  icaoCode: string;
  logoUrl: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AirlineService {

  private baseUrl = 'https://skybooker-api-gateway.onrender.com/airlines';

  constructor(private http: HttpClient) {}

  // token getter
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // ya auth service use kar sakta hai

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createAirline(dto: AirlineDTO): Observable<AirlineDTO> {
    return this.http.post<AirlineDTO>(
      this.baseUrl,
      dto,
      { headers: this.getAuthHeaders() }
    );
  }

  deactivateAirline(id: number): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/deactivate/${id}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  getAllAirlines(): Observable<AirlineDTO[]> {
    return this.http.get<AirlineDTO[]>(
      this.baseUrl,
      { headers: this.getAuthHeaders() }
    );
  }

  
}