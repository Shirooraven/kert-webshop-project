import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'https://gardening-shop-default-rtdb.europe-west1.firebasedatabase.app/products';

  constructor(private http: HttpClient) {}
  
  getProducts(): Observable<Product[]> {
    return this.http.get<{ [key: string]: Product }>(`${this.baseUrl}.json`).pipe(
      map(data => {
        if (!data) return [];
        return Object.entries(data)
          .filter(([_, value]) => value !== null && typeof value === 'object') // 🔐 fontos!
          .map(([key, value]: any) => ({
            ...value,
            id: value.id ?? key
          }));
      })
    );
  }
  

  updateProduct(product: Product): Observable<any> {
    return this.http.put(`${this.baseUrl}/${product.id}.json`, product);
  }
}
