import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginModel } from '../models/User.model';

@Injectable({
  providedIn: 'root',
})
export class MasterService {

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const localData = localStorage.getItem('leaveUser');
    let token = '';
    if (localData) {
      token = JSON.parse(localData).token;
    }
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }

  onLogin(obj: LoginModel) {
    return this.http.post<any>("http://localhost:5100/api/login", obj)
  }

  getUsers() {
    return this.http.get<any[]>("http://localhost:5100/api/user", this.getHeaders())
  }

  createUser(obj: any) {
    return this.http.post<any>("http://localhost:5100/api/user", obj, this.getHeaders())
  }

  updateUser(id: string, obj: any) {
    return this.http.put<any>(`http://localhost:5100/api/user/${id}`, obj, this.getHeaders())
  }

  deleteUser(id: string) {
    return this.http.delete<any>(`http://localhost:5100/api/user/${id}`, this.getHeaders())
  }

  getDashboardData() {
    return this.http.get<any>("http://localhost:5100/api/dashboard", this.getHeaders())
  }

  onAddLeaveBalance(obj: any) {
    return this.http.post<any>("https://api.freeprojectapi.com/api/LeaveTracker/AddLeaveBalance", obj)
  }

  getAllEmpl() {
    return this.getUsers();
  }


}
