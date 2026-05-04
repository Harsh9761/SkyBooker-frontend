import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AirlineService, AirlineDTO } from '../../services/airline.service';

@Component({
  selector: 'app-airline-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './airline.component.html',
  styleUrls: ['./airline.component.css']
})
export class AirlineAdminComponent implements OnInit {

  airline: AirlineDTO = {
    name: '',
    iataCode: '',
    icaoCode: '',
    logoUrl: '',
    country: '',
    contactEmail: '',
    contactPhone: '',
    isActive: true
  };

  airlines: AirlineDTO[] = [];

  constructor(private service: AirlineService) {}

  ngOnInit(): void {
    this.loadAirlines();
  }

  loadAirlines(): void {
    this.service.getAllAirlines().subscribe({
      next: (data) => this.airlines = data,
      error: (err) => console.error(err)
    });
  }

  createAirline(): void {
    this.service.createAirline(this.airline).subscribe({
      next: () => {
        alert("Airline created ✔");
        this.loadAirlines();
        this.resetForm();
      },
      error: (err) => console.error(err)
    });
  }

  deactivate(id?: number): void {
    if (!id) return;
    if (!confirm("Deactivate this airline?")) return;

    this.service.deactivateAirline(id).subscribe({
      next: () => {
        alert("Airline deactivated ✔");
        this.loadAirlines();
      },
      error: (err) => console.error(err)
    });
  }

  resetForm(): void {
    this.airline = {
      name: '',
      iataCode: '',
      icaoCode: '',
      logoUrl: '',
      country: '',
      contactEmail: '',
      contactPhone: '',
      isActive: true
    };
  }
}