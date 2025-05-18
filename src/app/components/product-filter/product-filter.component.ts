import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule],
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnChanges {
  @Input() categories: string[] = [];
  @Input() selectedCategory: string | null = null;
  @Input() priceRange: { min: number; max: number } = { min: 0, max: 10000 };
  @Input() searchTerm: string = '';

  @Output() categoryChange = new EventEmitter<string>();
  @Output() priceRangeChange = new EventEmitter<{ min: number; max: number }>();
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() applyFilters = new EventEmitter<void>();
  @Output() resetFilters = new EventEmitter<void>();

  categoryModel: string = '';
  priceModel = { min: 0, max: 10000 };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCategory']) {
      this.categoryModel = this.selectedCategory || '';
    }
    if (changes['priceRange']) {
      this.priceModel = { ...this.priceRange };
    }
  }

  onCategorySelect(): void {
    this.categoryChange.emit(this.categoryModel);
  }

  onPriceChange(): void {
    this.priceRangeChange.emit(this.priceModel);
  }

  onSearchChange(): void {
    this.searchTermChange.emit(this.searchTerm);
  }

  onApply(): void {
    this.applyFilters.emit();
  }

  onReset(): void {
    this.categoryModel = '';
    this.priceModel = { min: 0, max: 10000 };
    this.searchTerm = '';
    this.resetFilters.emit();
    this.onCategorySelect();
    this.onPriceChange();
    this.onSearchChange();
  }
}
