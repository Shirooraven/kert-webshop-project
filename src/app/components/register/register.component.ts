import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { Database, ref, set } from '@angular/fire/database';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private db: Database,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    const { email, password } = this.registerForm.value;

    if (email && password) {
      try {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        const uid = userCredential.user.uid;

        // 🔥 Realtime Database-be írás
        await set(ref(this.db, `users/${uid}`), {
          email,
          admin: false
        });

        this.successMessage = 'A regisztráció sikeres! Átirányítás... ✅';
        this.errorMessage = '';

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);

      } catch (error: any) {
        console.error('Regisztrációs hiba:', error);
        this.errorMessage = error.message || 'Ismeretlen hiba történt.';
        this.successMessage = '';
      }
    }
  }
}
