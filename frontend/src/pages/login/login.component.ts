import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule], 
  providers: [AuthService]
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage: string = ''; // To store error messages
  isLoading: boolean = false; // To handle loading state

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password } = this.loginForm.value;
      
      this._authService.login(username, password).subscribe({
        next: (resp) => {
          console.log("resp: ", resp);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Login error: ', err);
          this.errorMessage = 'Invalid username or password'; // Set error message
        },
        complete: () => {
        this.isLoading = false; // Turn off loading when the request is complete
        }
      });
    }
  }
}
