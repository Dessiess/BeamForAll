import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [ReactiveFormsModule],
    providers: [AuthService]
})
export class RegisterComponent {
  registerForm!: FormGroup;
  errorMessage: string = ''; // To store error messages
  isLoading: boolean = false; // To handle loading state

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    if (form.get('password')?.value !== form.get('confirmPassword')?.value) {
      return { 'mismatch': true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { username, password,} = this.registerForm.value;

      this.authService.register(username, password,).subscribe({
        next: (resp: any) => {
          console.log('Registration success:', resp);
          this.router.navigate(['/login']); // Redirect to login page after successful registration
        },
        error: (err: any) => {
          console.error('Registration error: ', err);
          this.errorMessage = 'Registration failed. Please try again.'; // Set error message
        },
        complete: () => {
          this.isLoading = false; // Turn off loading when the request is complete
        },
      });
    }
  }
}
