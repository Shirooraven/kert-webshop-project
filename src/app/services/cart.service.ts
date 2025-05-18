import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { Database, ref, onValue, set, remove, push, update } from '@angular/fire/database';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  private uid: string | null = null;

  constructor(private auth: Auth, private db: Database) {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.uid = user.uid;
        this.loadCartFromFirebase();
      } else {
        this.uid = null;
        this.cartItemsSubject.next([]);
      }
    });
  }

  private loadCartFromFirebase(): void {
    if (!this.uid) return;
    const cartRef = ref(this.db, `carts/${this.uid}`);
    onValue(cartRef, snapshot => {
      const data = snapshot.val() || {};
      const items = Object.values(data) as CartItem[];
      this.cartItemsSubject.next(items);
    });
  }

  addItem(item: CartItem): void {
    if (!this.uid) return;
    const cartRef = ref(this.db, `carts/${this.uid}/${item.id}`);
    update(cartRef, item); // rewrite or merge
  }

  removeItem(itemId: string): void {
    if (!this.uid) return;
    const itemRef = ref(this.db, `carts/${this.uid}/${itemId}`);
    remove(itemRef);
  }

  clearCart(): void {
    if (!this.uid) return;
    const cartRef = ref(this.db, `carts/${this.uid}`);
    remove(cartRef);
  }
}
