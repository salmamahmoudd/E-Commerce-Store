import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../services/order';
import { Order } from '../../interface/order';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';
import { Footer } from "../../shared/footer/footer";
import { Navbar } from "../../shared/navbar/navbar";

@Component({
  selector: 'app-all-orders',
  imports: [CommonModule, RouterModule, Footer, Navbar],
  templateUrl: './all-orders.html',
  styleUrl: './all-orders.css',
})
export class AllOrders implements OnInit {
 orders: Order[] = [];
  filteredOrders: Order[] = [];
  statusFilter: string = 'all';
  user: any;
  isAdmin = false;

  private orderService = inject(OrderService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  ngOnInit() {
    this.user = this.auth.getUser();
    this.isAdmin = this.auth.isAdmin();
    this.loadOrders();
  }

  loadOrders() {
    const obs = this.isAdmin ? this.orderService.getAllOrders() : this.orderService.getUserOrders();
    obs.subscribe({
      next: (res) => {
        this.orders = res;
        this.applyFilter();
      },
      error: (err) => console.error(err)
    });
  }

  applyFilter() {
    if (this.statusFilter === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === this.statusFilter);
    }
  }

  setFilter(status: string) {
    this.statusFilter = status;
    this.applyFilter();
  }

  canRefund(order: Order) {
    if (order.status !== 'delivered' || !order.deliveredAt) return false;
    const days = (Date.now() - new Date(order.deliveredAt).getTime()) / (1000 * 60 * 60 * 24);
    return days <= 14;
  }

  payCash(order: Order) {
    if (!order._id) return;
    this.orderService.payCash(order._id).subscribe({
      next: (updatedOrder) => {
        order.status = updatedOrder.status;
        this.toast.show(`Order ${order._id} marked as Cash Paid ✅`, 'success');
      },
      error: () => this.toast.show('Failed to update order', 'error')
    });
  }

  deliverOrder(order: Order) {
    if (!order._id) return;
    this.orderService.deliverOrder(order._id).subscribe({
      next: (updatedOrder) => {
        order.status = updatedOrder.status;
        order.deliveredAt = updatedOrder.deliveredAt;
        this.toast.show(`Order ${order._id} marked as Delivered ✅`, 'success');
      },
      error: () => this.toast.show('Failed to mark delivered', 'error')
    });
  }

  cancelByUser(order: Order) {
    if (!order._id) return;
    this.orderService.cancelByUser(order._id).subscribe({
      next: (res) => {
        order.status = 'cancelled_by_user';
        this.toast.show('Order cancelled successfully ✅', 'success');
      },
      error: () => this.toast.show('Failed to cancel order', 'error')
    });
  }

  requestRefund(order: Order) {
    if (!order._id) return;
    this.orderService.requestRefund(order._id).subscribe({
      next: (res) => {
        order.status = 'refund_requested';
        this.toast.show('Refund requested successfully ✅', 'success');
      },
      error: () => this.toast.show('Refund request failed', 'error')
    });
  }

  formatDate(dateStr?: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-GB', { 
      year: 'numeric', month: '2-digit', day: '2-digit', 
      hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
  }

  getTotal(items: any[]) {
    return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
}
