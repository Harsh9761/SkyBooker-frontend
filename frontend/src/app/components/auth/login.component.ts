import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl:'./login.component.css'
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(private auth: AuthService) {}

  login() {

    const payload = {
      email: this.email,
      password: this.password
    };

    this.auth.login(payload).subscribe({
      next: (res: any) => {
        console.log("Login Success:", res);

        // assume token field
        this.auth.saveToken(res.token);

        alert("Login successful");

        window.location.href = "/";
      },
      error: (err) => {
        console.error(err);
        alert("Invalid credentials");
      }
    });
  }

  loginWithGoogle() {
  window.location.href = "http://localhost:8080/oauth2/authorization/google";
}
}