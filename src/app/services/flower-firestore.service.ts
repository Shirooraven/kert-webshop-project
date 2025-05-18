// src/app/services/flower-firestore.service.ts
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Flower {
  name: string;
  category: string;
  color: string;
  price: number;
  id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlowerFirestoreService {
  private flowerRef = collection(this.firestore, 'flowers');

  constructor(private firestore: Firestore) {}

  // 1. WHERE: Csak romantikus virágok
  getRomanticFlowers(): Observable<Flower[]> {
    const q = query(this.flowerRef, where('category', '==', 'romantikus'));
    return collectionData(q, { idField: 'id' }) as Observable<Flower[]>;
  }

  // 2. ORDER BY: Ár szerint növekvő
  getFlowersOrderedByPrice(): Observable<Flower[]> {
    const q = query(this.flowerRef, orderBy('price', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Flower[]>;
  }

  // 3. LIMIT: Csak 2 legolcsóbb virág
  getCheapestFlowers(limitCount: number = 2): Observable<Flower[]> {
    const q = query(this.flowerRef, orderBy('price', 'asc'), limit(limitCount));
    return collectionData(q, { idField: 'id' }) as Observable<Flower[]>;
  }

  // 4. PAGINATION: 2 virág lekérése egy megadott dokumentum után
  async getNextPage(afterDoc: QueryDocumentSnapshot<DocumentData>, pageSize = 2): Promise<Flower[]> {
    const q = query(
      this.flowerRef,
      orderBy('price', 'asc'),
      startAfter(afterDoc),
      limit(pageSize)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({
      ...(doc.data() as Flower),
      id: doc.id
    }));
  }

  // Segédfüggvény: lekérjük az első oldalt + utolsó dokumentum referenciát
  async getFirstPage(pageSize = 2): Promise<{
    flowers: Flower[];
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  }> {
    const q = query(this.flowerRef, orderBy('price', 'asc'), limit(pageSize));
    const snap = await getDocs(q);
    const flowers = snap.docs.map(doc => ({
      ...(doc.data() as Flower),
      id: doc.id
    }));
    const lastDoc = snap.docs[snap.docs.length - 1] ?? null;
    return { flowers, lastDoc };
  }
}
