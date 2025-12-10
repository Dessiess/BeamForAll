import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  

 // private loginUrl = 'http://ec2-18-184-238-241.eu-central-1.compute.amazonaws.com/auth/login';
  private loginUrl = 'http://18.156.120.138:3000/auth/login';
  private registerUrl = 'http://18.156.120.138:3000/auth/register';

  constructor(private http: HttpClient, private router: Router) { }

  getUsername(): string {
    return localStorage.getItem('username') || 'Gost';  // Default to "Gost" (Guest) if no username is found
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password };  // Send directly without wrapping in 'user'

    return this.http.post(this.loginUrl, body, { headers }).pipe(
      catchError((error) => {
        console.error('Login error:', error);
         return throwError(() => new Error('Login failed. Please check your credentials and try again.'));
      }),
      tap((response: any) => {
        // Assuming the backend sends back the username upon successful login
        if (response?.token && response?.username) {
          this.saveLoginData(response.token, response.username);  // Store username in localStorage
        }
      })
    );
  }

  register(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password };

    return this.http.post(this.registerUrl, body, { headers }).pipe(
      tap((response: any) => {
        if (response?.token) {
          this.saveLoginData(response.token, username); // Store token and username
        }
      }),
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(() => new Error('Registration failed. Please try again.'));
      })
    );
  }

  saveLoginData(username: string, token: string): void {
    localStorage.setItem('username', username);  // Store username in localStorage
    localStorage.setItem('token', token);        // Store auth token in localStorage
  }

  // Remove login data (logout method)
  logout(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Checks if token exists
  }

} 
