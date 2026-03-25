import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmailModel, LoginModel } from '../models/User.model';

@Injectable({
  providedIn: 'root',
})
export class MasterService {

  constructor(private http: HttpClient) { }

  onLogin(obj: LoginModel) {
    return this.http.post<any>("http://localhost:5100/api/login", obj)
  }


}
