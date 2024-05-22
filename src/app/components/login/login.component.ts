import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitted = false;
  errorMessage = '';

  constructor(private http: HttpClient, private route: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  login() {
    if (this.loginForm.valid) {
      const userData = this.loginForm.value;

      this.http.post('http://localhost:3000/auth', userData).subscribe({
        next: (response) => {
          console.log('success', response);
          this.route.navigate(['/profile']);
        },
        error: (error) => {
          console.log('error', error);
          if (error.status === 400 && error.error.message) {
            this.errorMessage = error.error.message;
          }
        },
      });
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    this.errorMessage = '';
  }
}
