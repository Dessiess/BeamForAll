import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';


@Injectable()
export class AuthService {
  

 // private loginUrl = 'http://ec2-18-184-238-241.eu-central-1.compute.amazonaws.com/auth/login';
  private loginUrl = 'http://localhost:3000/auth/login';
  private registerUrl = 'http://localhost:3000/auth/register';

  constructor(private http: HttpClient) { }

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
        if (response && response.username) {
          localStorage.setItem('username', response.username);  // Store username in localStorage
        }
      })
    );
  }

  register(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password };

    return this.http.post(this.registerUrl, body, { headers }).pipe(
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
  }

} 
