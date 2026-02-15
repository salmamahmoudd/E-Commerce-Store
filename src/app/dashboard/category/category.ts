import { CommonModule } from '@angular/common';
import { Component, inject, NgModule, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category';
import { ICategory } from '../../interface/category';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category',
  imports: [CommonModule,FormsModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit {

 categoryService = inject(CategoryService);

  categories: ICategory[] = [];
  newCategory: { name: string } = { name: '' };
  selectedFile: File | null = null;
  editMode = false;
  selectedId = '';
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 6;
  toasts: { message: string, type: 'success' | 'error' }[] = [];


  ngOnInit() { this.loadCategories(); }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(data => this.categories = data);
  }

  saveCategory() {
  const formData = new FormData();
  formData.append('name', this.newCategory.name);
  if (this.selectedFile) formData.append('image', this.selectedFile);

  const obs = this.editMode
    ? this.categoryService.updateCategory(this.selectedId, formData)
    : this.categoryService.addCategory(formData);

  obs.subscribe({
    next: () => {
      this.resetForm();
      this.loadCategories();
      this.showToast(
        this.editMode ? 'Category updated successfully' : 'Category added successfully',
        'success'
      );
    },
    error: () => {
      this.showToast('Operation failed', 'error');
    }
  });
}


  editCategory(category: ICategory) {
    this.editMode = true;
    this.selectedId = category._id!;
    this.newCategory = { name: category.name };
  }

  showToast(message: string, type: 'success' | 'error') {
  const toast = { message, type };
  this.toasts.push(toast);

  setTimeout(() => {
    this.toasts = this.toasts.filter(t => t !== toast);
  }, 3000);
}

 deleteCategory(id: string) {
  this.categoryService.deleteCategory(id).subscribe({
    next: () => {
      this.loadCategories();
      this.showToast('Category deleted successfully', 'success');
    },
    error: () => {
      this.showToast('Failed to delete category', 'error');
    }
  });
}


  resetForm() {
    this.newCategory = { name: '' };
    this.selectedFile = null;
    this.editMode = false;
    this.selectedId = '';
  }

  filteredCategories(): ICategory[] {
    return this.searchTerm
      ? this.categories.filter(c => c.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
      : this.categories;
  }

  paginatedCategories(): ICategory[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCategories().slice(start, start + this.itemsPerPage);
  }

  totalPagesArray(): number[] {
    const total = Math.ceil(this.filteredCategories().length / this.itemsPerPage);
    return Array.from({ length: total }, (_, i) => i + 1);
  }
}
