import { Injectable } from "@angular/core"; 
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private router: Router, private authService: AuthService) {}

    //code inspirer de https://lironhazan.medium.com/angular-6-401-authentication-error-handling-888922def566

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.authService.getAuthToken();
    
        if (authToken) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${authToken}`
            }
          });
        }
    
        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.router.navigate(['/login']);
            }
            return throwError(error);
          })
        );
      }
}