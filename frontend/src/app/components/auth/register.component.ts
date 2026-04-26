import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  fullName = '';
  email = '';
  password = '';
  phone = '';
  passportNumber = '';
  nationality = '';

  constructor(private auth: AuthService) {}

  register() {

    const payload = {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      phone: this.phone,
      passportNumber: this.passportNumber,
      nationality: this.nationality
    };

    console.log("Register Payload:", payload);

    this.auth.register(payload).subscribe({
      next: (res) => {
        console.log("Registered:", res);
        alert("Registration Successful 🎉");
      },
      error: (err) => {
        console.error(err);
        alert("Registration Failed ❌");
      }
    });
  }
}