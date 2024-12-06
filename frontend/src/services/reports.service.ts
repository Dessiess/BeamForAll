import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({providedIn: "root"})
export class ReportService {

  public addReport = new Subject<any>();
  public updateReport = new Subject<any>();
  public refreshView = new Subject<void>();

  private apiUrl = 'http://localhost:3000/reports';  // Backend URL

  constructor(private http: HttpClient) {}

  save(report: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, report);
  }

  update(report: any, id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, report);
  }

  getReports(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}