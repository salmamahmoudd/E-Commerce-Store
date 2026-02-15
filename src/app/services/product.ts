import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { IProduct, IReview } from '../interface/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.baseUrl}/products`;

  getProducts() {
    return this.http.get<IProduct[]>(this.baseUrl);
  }

  getProduct(id: string) {
    return this.http.get<IProduct>(`${this.baseUrl}/${id}`);
  }

  addProduct(product: FormData) {
    return this.http.post<IProduct>(this.baseUrl, product);
  }

  updateProduct(id: string, product: FormData) {
    return this.http.put<IProduct>(`${this.baseUrl}/${id}`, product);
  }

  getFeaturedProducts() {
  return this.http.get<IProduct[]>(`${this.baseUrl}/featured`);
}

  deleteProduct(id: string) {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  addReview(productId: string, review: any) {
  return this.http.post<IProduct>(
    `${this.baseUrl}/${productId}/reviews`,
    review
  );
}
}
