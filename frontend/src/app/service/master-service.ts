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

  onAddLeaveBalance(obj: any) {
    return this.http.post<any>("https://api.freeprojectapi.com/api/LeaveTracker/AddLeaveBalance", obj)
  }

  getAllEmpl() {
    return this.http.get<any[]>("https://api.freeprojectapi.com/api/LeaveTracker/getAllEmployee")
  }

  getAllLeave() {
    return this.http.get<any[]>("https://api.freeprojectapi.com/api/LeaveTracker/GetAllBalances")
  }

  GetLeaveRequestsbyEmpId(empId: number) {
    return this.http.get<any[]>("https://api.freeprojectapi.com/api/LeaveTracker/GetLeaveRequestsbyEmpId?empId=" + empId)
  }

  onAddLeaveRequest(obj: any) {
    return this.http.post<any>("https://api.freeprojectapi.com/api/LeaveTracker/request", obj)
  }


}
