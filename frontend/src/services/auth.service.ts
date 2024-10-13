import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  private loginUrl = 'http://ec2-18-184-238-241.eu-central-1.compute.amazonaws.com/auth/login';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { user:{ username, password }};

    return this.http.post(this.loginUrl, body, { headers });
  }
}
