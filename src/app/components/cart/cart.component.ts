import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Auth } from '@angular/fire/auth';
import { Database, ref, push, set } from '@angular/fire/database';

import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  orderData = {
    name: '',
    email: '',
    address: '',
    phone: ''
  };

  constructor(
    private auth: Auth,
    private db: Database,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.id);
  }

  async checkout(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      this.snackBar.open('Be kell jelentkezni a rendeléshez.', 'OK', { duration: 3000 });
      return;
    }

    const uid = user.uid;
    const orderRef = ref(this.db, `orders/${uid}`);
    const newOrderRef = push(orderRef);

    const orderToSave = {
      id: newOrderRef.key,
      items: this.cartItems,
      total: this.getTotal(),
      userData: this.orderData,
      timestamp: Date.now()
    };

    try {
      await set(newOrderRef, orderToSave);
      this.snackBar.open('Rendelés sikeresen leadva!', 'OK', { duration: 3000 });
      this.cartService.clearCart(); // ❗ Kosár kiürítése Firebase-ben
      this.orderData = { name: '', email: '', address: '', phone: '' };
    } catch (error) {
      this.snackBar.open('Hiba történt a rendelés mentésekor.', 'OK', { duration: 3000 });
    }
  }
}
