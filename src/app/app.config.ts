import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideDatabase, getDatabase } from '@angular/fire/database';

import { environment } from '../environments/environment';

import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', component: HomeComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'products/:id', component: ProductDetailComponent },

      // ✅ IDE JÖN a cart route – válaszd az alábbiak közül az egyiket:

      // ➤ ha klasszikus:
      // { path: 'cart', component: CartComponent }

      // ➤ ha standalone:
      { path: 'cart', loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent) },

      { path: '**', redirectTo: '' }
    ]),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase())
  ]
};
