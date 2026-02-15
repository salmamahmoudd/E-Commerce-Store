import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ITestimonial } from '../interface/testimnial';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class TestimnialService {
private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = `${environment.baseUrl}/testimonials`;

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

getApprovedTestimonials() {
  return this.http.get<ITestimonial[]>(
    `${this.baseUrl}/approved`
  );
}

getAllTestimonials() {
  return this.http.get<ITestimonial[]>(
    `${this.baseUrl}`
  );
}
  addTestimonial(testimonial: ITestimonial) {
    return this.http.post(this.baseUrl, testimonial);
  }
approveTestimonial(id: string) {
  return this.http.put(
    `${this.baseUrl}/${id}/approve`,
    {},
    this.getAuthHeaders()
  );
}
  rejectTestimonial(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }
  getPendingTestimonials() {
  return this.http.get<ITestimonial[]>(`${this.baseUrl}/pending`, this.getAuthHeaders());
}

}
