import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service'; // ✅ hozzáadva

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private authService: AuthService, // ✅ beillesztve
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // ✅ Ha már be van jelentkezve a user, irányítjuk a főoldalra
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.router.navigate(['/']);
      }
    });
  }

  async onSubmit() {
    const { email, password } = this.loginForm.value;

    if (email && password) {
      try {
        await signInWithEmailAndPassword(this.auth, email, password);
        this.router.navigate(['/']);
      } catch (error: any) {
        this.errorMessage = error.message;
      }
    }
  }
}
