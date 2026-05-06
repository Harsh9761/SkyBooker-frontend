import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  email = '';
  newPassword = '';

  otp: string[] = ['', '', '', '', '', ''];
  otpSent = false;

  timer = 0;
  interval: any;

  constructor(private auth: AuthService,private router: Router) {}

  sendOtp() {

    this.auth.sendOtp({ email: this.email }).subscribe({
      next: () => {
        this.otpSent = true;
        this.startTimer();
      },
      error: () => alert("Error sending OTP")
    });
  }

  verifyOtp() {

  const finalOtp = this.otp.join('');

  this.auth.verifyOtp({
    email: this.email,
    otp: finalOtp,
    newPassword: this.newPassword
  }).subscribe({
    next: () => {
      alert("Password reset successful");

      //  LOGIN PAGE REDIRECT
      this.router.navigate(['/login']);
    },
    error: () => alert("Invalid OTP")
  });
}

  startTimer() {

    this.timer = 30;

    clearInterval(this.interval);

    this.interval = setInterval(() => {

      this.timer--;

      if (this.timer <= 0) {
        clearInterval(this.interval);
        this.timer = 0;
      }

    }, 1000);
  }

  resendOtp() {
    this.sendOtp();
  }


onOtpInput(e: any, i: number) {
  const inputs = document.querySelectorAll<HTMLInputElement>('.otp-input');

  this.otp[i] = e.target.value.slice(-1);
  e.target.value = this.otp[i];

  if (this.otp[i] && i < 5) inputs[i + 1].focus();
}
 

 onKeyDown(e: any, i: number) {
  const inputs = document.querySelectorAll<HTMLInputElement>('.otp-input');

  if (e.key === 'Backspace') {

    // current box clear karo (IMPORTANT FIX)
    inputs[i].value = '';
    this.otp[i] = '';

    //  agar already empty tha → piche jao
    if (i > 0 && !inputs[i].value) {
      inputs[i - 1].focus();
    }
  }
}
}