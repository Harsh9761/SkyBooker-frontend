import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn = false;
  username = 'Guest';
  role = '';

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkLogin();
  }

  checkLogin() {
    this.isLoggedIn = this.auth.isLoggedIn();

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.username = payload.sub;
        this.role = payload.role;
        
      } catch {
        this.username = 'Guest';
        this.role = '';
      }
    }
  }

  logout() {
    this.auth.logout();
    this.isLoggedIn = false;
    this.username = 'Guest';
    this.role = '';
    this.router.navigate(['/login']);
  }
}