import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../interface/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
    private baseUrl = `${environment.baseUrl}/user`;
    constructor(private http: HttpClient) {}

  getProfile(): Observable<IUser> {
    return this.http.get<IUser>(`${this.baseUrl}/me`);
  }

  updateProfile(data: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/me`, data);
  }
  
   getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.baseUrl);
  }

  blockUser(id: string): Observable<IUser> {
    return this.http.put<IUser>(`${this.baseUrl}/${id}/block`, {});
  }

  unblockUser(id: string): Observable<IUser> {
    return this.http.put<IUser>(`${this.baseUrl}/${id}/unblock`, {});
  }
}
