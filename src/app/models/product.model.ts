export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    disabled?: boolean; // ✅ új mező
  }
  