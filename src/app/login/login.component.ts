import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
  imports: [FormsModule, MatInputModule, MatButtonModule, CommonModule, RouterLink]
})
export class LoginComponent {
  login: string = 'llambrook1@blogger.com';
  password: string = 'llambrook1@blogger.com';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.doAuth(this.login, this.password).pipe(
      tap(data => {
        this.authService.logIn(data.token, data.user);
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
