import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class AuthService {

 // private loginUrl = 'http://ec2-18-184-238-241.eu-central-1.compute.amazonaws.com/auth/login';
  private loginUrl = 'http://localhost:3000/auth/login';
  private registerUrl = 'http://localhost:3000/auth/register';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { username, password };  // Send directly without wrapping in 'user'

    return this.http.post(this.loginUrl, body, { headers }).pipe(
      catchError((error) => {
        console.error('Login error:', error);
         return throwError(() => new Error('Login failed. Please check your credentials and try again.'));
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
} 
