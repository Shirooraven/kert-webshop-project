import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Firestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData
} from '@angular/fire/firestore';

interface Flower {
  name: string;
  category: string;
  color: string;
  price: number;
  id?: string;
}

@Component({
  selector: 'app-flowers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flowers.component.html',
  styleUrls: ['./flowers.component.scss']
})
export class FlowersComponent implements OnInit {
  romanticFlowers: Flower[] = [];
  cheapestFlowers: Flower[] = [];
  orderedFlowers: Flower[] = [];
  pagedFlowers: Flower[] = [];

  pageSize = 2;
  public pageCursors: QueryDocumentSnapshot<DocumentData>[] = [];
  public currentPageIndex = 0;

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    this.loadAllStaticQueries();
    this.loadPage(0);
  }

  async loadAllStaticQueries() {
    await this.loadRomantic();
    await this.loadOrdered();
    await this.loadCheapest();
  }

  async loadRomantic() {
    const q = query(collection(this.firestore, 'flowers'), where('category', '==', 'romantikus'));
    const snap = await getDocs(q);
    this.romanticFlowers = snap.docs.map(doc => ({ ...(doc.data() as Flower), id: doc.id }));
  }

  async loadOrdered() {
    const q = query(collection(this.firestore, 'flowers'), orderBy('price', 'asc'));
    const snap = await getDocs(q);
    this.orderedFlowers = snap.docs.map(doc => ({ ...(doc.data() as Flower), id: doc.id }));
  }

  async loadCheapest() {
    const q = query(collection(this.firestore, 'flowers'), orderBy('price', 'asc'), limit(this.pageSize));
    const snap = await getDocs(q);
    this.cheapestFlowers = snap.docs.map(doc => ({ ...(doc.data() as Flower), id: doc.id }));
  }

  async loadPage(pageIndex: number) {
    let q;

    if (pageIndex > 0 && this.pageCursors[pageIndex - 1]) {
      q = query(
        collection(this.firestore, 'flowers'),
        orderBy('price', 'asc'),
        startAfter(this.pageCursors[pageIndex - 1]),
        limit(this.pageSize)
      );
    } else {
      q = query(collection(this.firestore, 'flowers'), orderBy('price', 'asc'), limit(this.pageSize));
    }

    const snap = await getDocs(q);
    const docs = snap.docs;

    if (docs.length > 0) {
      this.pagedFlowers = docs.map(doc => ({ ...(doc.data() as Flower), id: doc.id }));

      // mentjük az első doksit az oldal elejéről
      if (!this.pageCursors[pageIndex]) {
        this.pageCursors[pageIndex] = docs[0];
      }

      this.currentPageIndex = pageIndex;
    }
  }

  loadNextPage() {
    this.loadPage(this.currentPageIndex + 1);
  }

  loadPreviousPage() {
    if (this.currentPageIndex > 0) {
      this.loadPage(this.currentPageIndex - 1);
    }
  }
}
