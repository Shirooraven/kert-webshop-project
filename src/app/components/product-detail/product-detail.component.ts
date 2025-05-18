import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 🔁 EZ KELL!
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ RouterModule legyen itt!
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProduct(id).subscribe(product => {
        if (product) {
          this.product = product;
        } else {
          this.errorMessage = '❌ A termék nem található.';
        }
      });
    } else {
      this.errorMessage = '⚠️ Hibás termékazonosító.';
    }
  }
}
