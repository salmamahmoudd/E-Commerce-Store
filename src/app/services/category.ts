import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICategory } from '../interface/category';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class CategoryService {
 private http = inject(HttpClient);
  private baseUrl = `${environment.baseUrl}/categories`;

  addCategory(category: FormData) {
    return this.http.post(this.baseUrl, category);
  }

  updateCategory(id: string, category: FormData) {
    return this.http.put(`${this.baseUrl}/${id}`, category);
  }

  getCategories() {
    return this.http.get<ICategory[]>(this.baseUrl);
  }

  deleteCategory(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
