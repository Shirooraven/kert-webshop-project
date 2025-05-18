// src/app/models/product.ts
export interface Product {
  id: string | number; // ← így mindkettőt elfogadja
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  disabled?: boolean;
}
