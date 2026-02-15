import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthResponse, LoginData, RegisterData } from '../interface/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private baseUrl = `${environment.baseUrl}/auth`;

  constructor(private http: HttpClient,private router:Router) {}

private currentUser$ = new BehaviorSubject<any>(this.getUser());
get currentUser() { return this.currentUser$.asObservable(); }

saveUser(user: any) {
  localStorage.setItem('currentUser', JSON.stringify(user));
  this.currentUser$.next(user);
}

getUser(): any {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

logout() {
  const user = this.getUser();

  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');

  if (user) {
    localStorage.removeItem(`cart_${user.id}`); 
  }

  this.currentUser$.next(null);
  this.router.navigate(['/login']);
}




 register(data: RegisterData): Observable<any> {
  return this.http.post(`${this.baseUrl}/register`, data);
}

  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  isAdmin(): boolean {
  const user = this.getUser();
  return user?.role === 'admin'; 
}
}
