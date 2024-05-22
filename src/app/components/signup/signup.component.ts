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
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  signupForm: FormGroup;
  isSubmitted = false;
  errorMessage = '';

  constructor(private http: HttpClient, private route: Router) {
    this.signupForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      fullname: new FormControl('', [Validators.required]),
    });
  }

  signUp() {
    if (this.signupForm.valid) {
      const userData = this.signupForm.value;

      this.http.post('http://localhost:3000/signup', userData).subscribe({
        next: () => {
          this.route.navigate(['/auth']);
        },
        error: (error) => {
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
