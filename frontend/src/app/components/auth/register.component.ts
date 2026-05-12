import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
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

  // OTP fields
  otp = '';
  otpVerified = false;

  constructor(private auth: AuthService,
      private router: Router
  ) {}

  // SEND OTP
  sendOtp() {

    if (!this.email) {
      alert("Please enter email first");
      return;
    }

    this.auth.sendRegisterOtp(this.email).subscribe({
      next: () => {
        alert("OTP sent to email");
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || "Failed to send OTP");
      }
    });
  }

  // VERIFY OTP
  verifyOtp() {

    const payload = {
      email: this.email,
      otp: this.otp
    };

    this.auth.verifyRegisterOtp(payload).subscribe({
      next: () => {
        this.otpVerified = true;
        alert("Email verified successfully ");
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || "Invalid OTP ");
      }
    });
  }

  // REGISTER USER
  register() {

    if (!this.otpVerified) {
      alert("Please verify your email first ❗");
      return;
    }

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

        alert("Registration Successful ");
        this.router.navigate(['/login']);
        // reset form
        this.otpVerified = false;
      },
      error: (err) => {

        console.error(err);

        alert(err.error?.message || "Registration Failed ");
      }
    });
  }
}