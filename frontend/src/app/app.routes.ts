import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { SeatSelectionComponent } from './components/seat/seat-selection.component';
import { BookingComponent } from './components/booking/booking.component';
import { PaymentComponent } from './components/payment/payment.component';
import { MyBookingsComponent } from './components/my-bookings/my-bookings.component';
import { FlightsComponent } from './components/flights/flights.component';
import { AddFlightComponent } from './components/add-flights/add-flight.component';
import { AddSeatsComponent } from './components/add-seats/add-seats.component';
import { AirlineAdminComponent } from './components/airline/airline.component';
import { AdminComponent } from './components/admin/admin.component';


export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'seat-selection/:id', component: SeatSelectionComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'my-bookings', component: MyBookingsComponent },
  { path: 'flights', component: FlightsComponent },
  {
    path: 'add-flight',
    component: AddFlightComponent
  },
  { path: 'add-seats', component: AddSeatsComponent },
  {
    path: 'admin/airlines',
    component: AirlineAdminComponent
  },
  {
  path: 'reset-password',
  loadComponent: () =>
    import('./components/reset/reset-password.component')
      .then(m => m.ResetPasswordComponent)
},
  {
    path: 'admin',
    component: AdminComponent
  }
];