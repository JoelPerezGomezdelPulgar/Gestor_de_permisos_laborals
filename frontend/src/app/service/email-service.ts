import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private url = 'http://localhost:5100/api/email';

  constructor(private http: HttpClient) { }

  sendEmail(body: any) {
    return this.http.post(this.url, body);
  }
}