import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

import { Auth } from '@angular/fire/auth';
import { Database, ref, get } from '@angular/fire/database';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['id', 'name', 'description', 'price', 'image', 'actions'];
  isAdmin: boolean = false;

  constructor(
    private productService: ProductService,
    private auth: Auth,
    private db: Database
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
      this.products = data;
    });
  }

  disableProduct(product: Product): void {
    product.disabled = true;
    this.productService.updateProduct(product).subscribe();
  }

  enableProduct(product: Product): void {
    product.disabled = false;
    this.productService.updateProduct(product).subscribe();
  }
}
