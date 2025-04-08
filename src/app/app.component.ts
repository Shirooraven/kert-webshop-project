import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // 👈 ez kell
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule, // 👈 ez kell a router-outlet-hez
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kert-webshop';
}
