import { SubcategoryService } from './../../services/subcategory';
import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category';
import { ICategory } from '../../interface/category';
import { ISubCategory } from '../../interface/subcategory';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subcategory',
  imports: [FormsModule,CommonModule],
  templateUrl: './subcategory.html',
  styleUrl: './subcategory.css',
})
export class Subcategory implements OnInit{

  categoryService =inject(CategoryService);
  subCategoryService = inject(SubcategoryService);

  categories: ICategory[]=[];
  subCategories: ISubCategory[]=[];
  selectedCategoryId: string = '';
  newSubCategory: {name: string}={name:''};
  selectedFile: File | null = null;

  editMode = false;
  selectedId = '';
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 6;
  toasts: { message: string, type: 'success' | 'error' }[] = [];


  
  ngOnInit() {
    this.loadCategories();
    this.loadSubCategories();
  }

  loadCategories(){
    this.categoryService.getCategories().subscribe(data=> this.categories =data);
  }

  loadSubCategories(){
    this.subCategoryService.getSubCategories().subscribe(data=> this.subCategories= data)
  }
  
  onCategoryChange(){
    if(!this.selectedCategoryId){this.loadCategories();return;}
    this.subCategoryService.getSubCategoriesByCategory(this.selectedCategoryId).subscribe(data=> this.subCategories =data);
  }

  onFileSelected(event: any){
    this.selectedFile =event.target.files[0];
  }

saveSubCategory() {
  if (!this.selectedCategoryId) {
    this.showToast('Please select a category', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('name', this.newSubCategory.name);
  formData.append('category', this.selectedCategoryId);
  if (this.selectedFile) formData.append('image', this.selectedFile);

  const obs = this.editMode
    ? this.subCategoryService.updateSubCategory(this.selectedId, formData)
    : this.subCategoryService.addSubCategory(formData);

  obs.subscribe({
    next: () => {
      this.resetForm();
      this.loadSubCategories();
      this.showToast(this.editMode ? 'Subcategory updated' : 'Subcategory added', 'success');
    },
    error: () => this.showToast('Operation failed', 'error')
  });
}



showToast(message: string, type: 'success' | 'error') {
  const toast = { message, type };
  this.toasts.push(toast);

  setTimeout(() => {
    this.toasts = this.toasts.filter(t => t !== toast);
  }, 3000);
}



  editSubCategory(sub: ISubCategory){
    this.editMode = true;
    this.selectedId =sub._id!;
    this.newSubCategory ={name:sub.name};
    this.selectedCategoryId =
    typeof sub.category === 'string'
    ? sub.category
    : sub.category._id;
  }

deleteSubCategory(id: string) {
    this.subCategoryService.deleteSubCategory(id).subscribe({
      next: () => {
        this.loadSubCategories();
        this.showToast('Subcategory deleted', 'success');
      },
      error: () => this.showToast('Failed to delete', 'error')
    });
}


  resetForm(){
    this.newSubCategory ={name:''};
    this.selectedFile = null;
    this.editMode =false;
    this.selectedId ='';
  }

  filteredSubCategories(): ISubCategory[]{
    return this.searchTerm 
    ?this.subCategories.filter(s=> s.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
    :this.subCategories
  }

  paginatedSubCategories(): ISubCategory[]{
    const start = (this.currentPage -1) * this.itemsPerPage;
    return this.filteredSubCategories().slice(start, start + this.itemsPerPage);
  }

  totalPagesArray(): number[]{
    const total = Math.ceil(this.filteredSubCategories().length / this.itemsPerPage);
    return Array.from({ length: total }, (_, i)=> i+ 1)
  }
}
