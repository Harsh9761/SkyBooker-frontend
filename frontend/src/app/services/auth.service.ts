import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {

  API = "http://localhost:8080/auth"; // via API Gateway

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.API}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.API}/login`, data);
  }

  saveToken(token: string) {
    localStorage.setItem("token", token);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  logout() {
    localStorage.removeItem("token");
  }

  isLoggedIn(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = Number(payload.exp) * 1000;

    if (Date.now() > exp) {
      console.log("Token expired → logging out");
      localStorage.removeItem('token');
      return false;
    }

    return true;
  } catch (e) {
    localStorage.removeItem('token');
    return false;
  }
}

  getUserId(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.userId || payload.sub;
}

  getRole(): string {
    const token = this.getToken();

    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || '';
    } catch (e) {
      return '';
    }
  }

  isAdmin(): boolean {
  const role = this.getRole();

  return role === 'ADMIN' || role === 'ROLE_ADMIN';
}

  sendOtp(data: any) {
  return this.http.post(`${this.API}/send-otp`, data);
}

verifyOtp(data: any) {
  return this.http.post(`${this.API}/verify-otp`, data);
}
}