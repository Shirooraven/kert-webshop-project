import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

// 🔐 AuthGuard funkció (CanActivateFn típusú)
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Nyilvános oldalak
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 🔒 Védett oldalak (csak bejelentkezett felhasználók számára)
  {
    path: 'cart',
    loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent),
    canActivate: [authGuard]
  },
  {
    path: 'flowers',
    loadComponent: () => import('./components/flowers/flowers.component').then(m => m.FlowersComponent),
    canActivate: [authGuard]
  },

  // Fallback (nem létező útvonal esetén főoldalra)
  { path: '**', redirectTo: '' }
];
