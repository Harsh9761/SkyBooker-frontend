import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Authorization Header
  getAuthHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  //  Load Users
  loadUsers() {
    this.http.get<any[]>('https://skybooker-api-gateway.onrender.com/auth/users', this.getAuthHeaders())
      .subscribe({
        next: (res) => {
          console.log("USERS API RESPONSE ", res);
          this.users = res || [];
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("ERROR ", err);
          alert('Failed to load users');
        }
      });
  }

  // Change Role
  changeRole(userId: number, role: string) {
    this.http.put(
      `https://skybooker-api-gateway.onrender.com/auth/admin/role?userId=${userId}&role=${role}`,
      {},
      {
        ...this.getAuthHeaders(),
        responseType: 'text'   
      }
    ).subscribe({
      next: (res) => {
        console.log(res); // optional
        alert('Role updated');
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update role');
      }
    });
  }

  //  Deactivate User 
  deactivateUser(userId: number) {
    this.http.put(
      `https://skybooker-api-gateway.onrender.com/auth/admin/deactivate/${userId}`,
      {},
      {
        ...this.getAuthHeaders(),
        responseType: 'text' 
      }
    ).subscribe({
      next: (res) => {
        console.log(res);
        alert('User deactivated');
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to deactivate user');
      }
    });
  }

  // Activate User
  activateUser(userId: number) {
    this.http.put(
      `https://skybooker-api-gateway.onrender.com/auth/admin/activate/${userId}`,
      {},
      {
        ...this.getAuthHeaders(),
        responseType: 'text'   
      }
    ).subscribe({
      next: (res) => {
        console.log(res);
        alert('User activated');
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to activate user');
      }
    });
  }
}