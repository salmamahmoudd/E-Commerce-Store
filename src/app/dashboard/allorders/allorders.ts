import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Footer } from '../../shared/footer/footer';
import { Navbar } from '../../shared/navbar/navbar';
import { Order } from '../../interface/order';
import { OrderService } from '../../services/order';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-allorders',
  imports: [CommonModule, RouterModule, Footer, Navbar],
  templateUrl: './allorders.html',
  styleUrl: './allorders.css',
})
export class AllOrdersAdmin implements OnInit {

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  statusFilter: string = 'all';
  isAdmin = true;

  private orderService = inject(OrderService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  ngOnInit() {
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

  approveRefund(order: Order) {
    if (!order._id) return this.toast.show('Order ID missing', 'error');

    this.orderService.approveRefund(order._id).subscribe({
      next: (updatedOrder) => {
        order.status = 'refunded';
        this.toast.show(`Refund approved for order ${order._id} ✅`, 'success');
      },
      error: () => this.toast.show('Failed to approve refund', 'error')
    });
  }

  rejectRefund(order: Order) {
    if (!order._id) return this.toast.show('Order ID missing', 'error');

    this.orderService.rejectRefund(order._id).subscribe({
      next: (updatedOrder) => {
        order.status = 'refund_rejected';
        this.toast.show(`Refund rejected for order ${order._id} ❌`, 'success');
      },
      error: () => this.toast.show('Failed to reject refund', 'error')
    });
  }

  deliverOrder(order: Order) {
    if (!order._id) return this.toast.show('Order ID missing', 'error');

    this.orderService.deliverOrder(order._id).subscribe({
      next: (updatedOrder) => {
        order.status = updatedOrder.status;
        order.deliveredAt = updatedOrder.deliveredAt;
        this.toast.show(`Order ${order._id} marked as Delivered ✅`, 'success');
      },
      error: () => this.toast.show('Failed to mark delivered', 'error')
    });
  }

  cancelByAdmin(order: Order) {
    if (!order._id) return this.toast.show('Order ID missing', 'error');

    this.orderService.cancelByAdmin(order._id).subscribe({
      next: () => {
        order.status = 'cancelled_by_admin';
        this.toast.show('Order cancelled successfully ✅', 'success');
      },
      error: () => this.toast.show('Failed to cancel order', 'error')
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

