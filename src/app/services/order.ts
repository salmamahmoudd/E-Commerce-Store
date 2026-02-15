import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order } from '../interface/order';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = `${environment.baseUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(order: any): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, order);
  }

  getUserOrders(): Observable<Order[]> {
   const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return this.http.get<Order[]>(this.baseUrl, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
  }

  getAllOrders(): Observable<Order[]> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return this.http.get<Order[]>(this.baseUrl, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
  }

  payCash(orderId: string) {
    return this.http.put<Order>(`${this.baseUrl}/${orderId}/pay-cash`, {});
  }

  deliverOrder(orderId: string) {
    return this.http.put<Order>(`${this.baseUrl}/${orderId}/deliver`, {});
  }

  cancelByUser(orderId: string) {
    return this.http.put<Order>(`${this.baseUrl}/${orderId}/cancel-user`, {});
  }

  cancelByAdmin(orderId: string) {
    return this.http.put<Order>(`${this.baseUrl}/${orderId}/cancel-admin`, {});
  }

  requestRefund(orderId: string) {
    return this.http.put<Order>(`${this.baseUrl}/${orderId}/request-refund`, {});
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  deleteOrder(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

approveRefund(orderId: string) {
  return this.http.put<Order>(`${this.baseUrl}/${orderId}/approve-refund`, {});
}

rejectRefund(orderId: string) {
  return this.http.put<Order>(`${this.baseUrl}/${orderId}/reject-refund`, {});
}

}
