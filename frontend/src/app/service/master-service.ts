import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LoginModel } from '../models/User.model';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  private http = inject(HttpClient);

  private readonly API_URL = "http://localhost:5100/api";
  private readonly httpOptions = { withCredentials: true };

  onLogin(obj: LoginModel) {
    return this.http.post<any>(`${this.API_URL}/login`, obj, this.httpOptions)
  }

  onRegister(obj: FormData) {
    return this.http.post<any>(`${this.API_URL}/register`, obj, this.httpOptions)
  }

  getMe() {
    return this.http.get<any>(`${this.API_URL}/me`, this.httpOptions)
  }

  logout() {
    return this.http.post<any>(`${this.API_URL}/logout`, {}, this.httpOptions)
  }

  getUsers() {
    return this.http.get<any[]>(`${this.API_URL}/user`, this.httpOptions)
  }

  createUser(obj: any | FormData) {
    return this.http.post<any>(`${this.API_URL}/user`, obj, this.httpOptions)
  }

  updateUser(id: string, obj: any | FormData) {
    return this.http.put<any>(`${this.API_URL}/user/${id}`, obj, this.httpOptions)
  }

  deleteUser(id: string) {
    return this.http.delete<any>(`${this.API_URL}/user/${id}`, this.httpOptions)
  }

  getPermisos() {
    return this.http.get<any[]>(`${this.API_URL}/permis`, this.httpOptions)
  }

  createPermisos(obj: any) {
    return this.http.post<any>(`${this.API_URL}/permis`, obj, this.httpOptions)
  }

  updatePermisos(id: string, obj: any) {
    return this.http.put<any>(`${this.API_URL}/permis/${id}`, obj, this.httpOptions)
  }

  deletePermisos(id: string) {
    return this.http.delete<any>(`${this.API_URL}/permis/${id}`, this.httpOptions)
  }

  getDashboardData() {
    return this.http.get<any>(`${this.API_URL}/dashboard`, this.httpOptions)
  }

  onAddLeaveBalance(obj: any) {
    // Note: External APIs might not support withCredentials correctly if not configured for it
    return this.http.post<any>("https://api.freeprojectapi.com/api/LeaveTracker/AddLeaveBalance", obj)
  }

  getAllEmpl() {
    return this.getUsers();
  }

  async subirImagen(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'GestordePermisosLaboral');

    const response = await fetch('https://api.cloudinary.com/v1_1/dcknfjzss/image/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    return data.secure_url;
  }

}
