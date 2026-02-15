import { Component, inject } from '@angular/core';
import { ITestimonial } from '../../interface/testimnial';
import { TestimnialService } from '../../services/testimnial';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-testimonials',
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
})
export class Testimonials {

 testimonials: ITestimonial[] = [];
  testimonialService = inject(TestimnialService);
  authService = inject(AuthService);

  isAdmin = false;

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin(); 
    this.load();
  }

load() {
  if (this.isAdmin) {
    this.testimonialService.getAllTestimonials().subscribe(res => {
      this.testimonials = res; 
    });
  } else {
    this.testimonialService.getApprovedTestimonials().subscribe(res => {
      this.testimonials = res;
    });
  }
}
  approve(id?: string) {
    if (!id) return;
    this.testimonialService.approveTestimonial(id).subscribe(() => this.load());
  }

  reject(id?: string) {
    if (!id) return;
    this.testimonialService.rejectTestimonial(id).subscribe(() => this.load());
  }

  starsArray(rating: number | undefined): number[] {
    const validRating = rating ?? 0;
    return [1, 2, 3, 4, 5].map(star => star <= validRating ? 1 : 0);
  }
}