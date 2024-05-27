import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ME_KEY, TOKEN_KEY } from '../shared/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule, CommonModule]
})
export class LoginComponent {
  login: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.doAuth(this.login, this.password).pipe(
      tap(data => {
        sessionStorage.setItem(TOKEN_KEY, data.token);
        sessionStorage.setItem(ME_KEY, JSON.stringify(data.user));
        this.router.navigate(['/home']);
      }),
      catchError(error => {
        console.error(error);
        if (error.status === 401) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
        return of(null);
      })
    ).subscribe();
  }
}
