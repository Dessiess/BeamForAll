import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({providedIn: "root"})
export class ReportService {
    public addReport = new Subject<any>();
    public refreshView = new Subject<void>();

    private apiUrl = 'http://localhost:3000/reports';  // Backend URL
  
    constructor(private http: HttpClient) {}
  
    saveReport(reportData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}`, reportData);
    }
  
    getReports(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
    }
}