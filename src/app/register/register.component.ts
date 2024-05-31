import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UsersService } from '../shared/users.service';
import { User } from '../users/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(
    private authService: AuthService, 
    private userService: UsersService, 
    private router: Router,
    private toastr: ToastrService
  ) {}

  nom!: string;
  email!: string;
  password!: string;

  onSubmit(form: NgForm) {
    if (form.valid) {
      const user: User = new User();
      user.nom = this.nom;
      user.email = this.email;
      user.password = this.password;

      this.userService.register(user).subscribe(response => {
        console.log('User registered successfully', response);
        this.toastr.success('Vous avez été inscrit avec succès', 'Success');
        this.router.navigate(['/login']);
      }, error => {
        console.error('Error registering user', error);
      });
    }
  }
}
