import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card'; 
import { MatTooltipModule } from '@angular/material/tooltip';

import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

import { Auth } from '@angular/fire/auth';
import { Database, ref, get } from '@angular/fire/database';

import { ProductFilterComponent } from '../product-filter/product-filter.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule,
    MatCardModule,              // <- EZT ADD HOZZÁ
    ProductFilterComponent,
    MatTooltipModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  allProducts: Product[] = [];
  products: Product[] = [];

  displayedColumns: string[] = ['id', 'name', 'description', 'price', 'imageUrl', 'actions'];

  isAdmin: boolean = false;

  categories: string[] = ['Virágföld 20L', 'Gereblye', 'Locsolókanna', 'Metszőolló'];
  selectedCategory: string | null = null;
  priceRange = { min: 0, max: 10000 };
  searchTerm: string = '';

  constructor(
    private productService: ProductService,
    private auth: Auth,
    private db: Database,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const user = this.auth.currentUser;
    if (user) {
      const uid = user.uid;
      const userRef = ref(this.db, `users/${uid}/admin`);
      get(userRef).then(snapshot => {
        this.isAdmin = snapshot.val() === true;
      });
    }

    this.productService.getProducts().subscribe((data: Product[]) => {
      this.allProducts = data;
      this.products = data;
    });
  }

  addToCart(product: Product): void {
  const item = {
    id: String(product.id),  // ← itt a lényeg: típuskényszerítés stringgé
    name: product.name,
    price: product.price,
    quantity: 1
  };
  this.cartService.addItem(item);
  this.snackBar.open('Kosárhoz adva!', 'OK', { duration: 2000 });
}


  disableProduct(product: Product): void {
    product.disabled = true;
    this.productService.updateProduct(product).subscribe();
  }

  enableProduct(product: Product): void {
    product.disabled = false;
    this.productService.updateProduct(product).subscribe();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
  }

  onPriceRangeChange(range: { min: number; max: number }): void {
    this.priceRange = range;
  }

  onSearchTermChange(term: string): void {
    this.searchTerm = term;
  }

  onApplyFilters(): void {
    this.products = this.allProducts.filter(product => {
      const matchesCategory =
        !this.selectedCategory ||
        product.name.toLowerCase().includes(this.selectedCategory!.toLowerCase());

      const matchesPrice =
        product.price >= this.priceRange.min &&
        product.price <= this.priceRange.max;

      const matchesSearch =
        !this.searchTerm ||
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesCategory && matchesPrice && matchesSearch;
    });
  }

  onResetFilters(): void {
    this.selectedCategory = null;
    this.priceRange = { min: 0, max: 10000 };
    this.searchTerm = '';
    this.products = this.allProducts;
  }
}
