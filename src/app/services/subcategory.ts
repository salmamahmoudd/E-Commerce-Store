import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ISubCategory } from '../interface/subcategory';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SubcategoryService {
private http = inject(HttpClient);
  private baseUrl = `${environment.baseUrl}/subcategories`;

  addSubCategory(sub: FormData) {
    return this.http.post(this.baseUrl, sub);
  }
  
  updateSubCategory(id: string, sub: FormData) {
    return this.http.put(`${this.baseUrl}/${id}`, sub);
  }
  getSubCategories() {
    return this.http.get<ISubCategory[]>(this.baseUrl);
  }

  getSubCategoriesByCategory(categoryId: string) {
    return this.http.get<ISubCategory[]>(
      `${this.baseUrl}/category/${categoryId}`
    );
  }

  deleteSubCategory(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
