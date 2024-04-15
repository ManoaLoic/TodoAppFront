import { Injectable } from '@angular/core';
import { User } from '../users/user.model';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';
import { USER_DATA } from './user.data';
import { API_ENDPOINT } from './constants';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    assignments: User[] = [];

    constructor(private logService: LoggingService,
        private http: HttpClient) { }

    uri = `${API_ENDPOINT}/users`;

    getUsersPagines(page: number, limit: number): Observable<any> {
        return this.http.get<User[]>(this.uri + "?page=" + page + "&limit=" + limit);
    }

    getUser(id: number): Observable<User | undefined> {
        return this.http.get<User>(this.uri + "/" + id)
            .pipe(
                catchError(this.handleError<any>('### catchError: Users by id avec id=' + id))
            );
    }

    private handleError<T>(operation: any, result?: T) {
        return (error: any): Observable<T> => {
            console.log(error);
            console.log(operation + ' a échoué ' + error.message);

            return of(result as T);
        }
    };

    addUser(user: User): Observable<any> {
        this.logService.log(user.nom, "ajouté");
        return this.http.post<User>(this.uri, user);
    }

    updateUser(user: User): Observable<any> {
        this.logService.log(user.nom, "modifié");
        return this.http.put<User>(this.uri, user);
    }

    deleteUser(user: User): Observable<any> {
        this.logService.log(user.nom, "supprimé");
        return this.http.delete(this.uri + "/" + user._id);
    }

    peuplerBDavecForkJoin(): Observable<any> {
        let appelsVersAddAssignment: Observable<any>[] = [];

        USER_DATA.forEach(a => {
            const nouvelUser = new User();
            nouvelUser.nom = a.nom;
            nouvelUser.image = a.image;
            nouvelUser.email = a.email;
            nouvelUser.password = a.password;
            nouvelUser.isAdmin = a.isAdmin;

            appelsVersAddAssignment.push(this.addUser(nouvelUser));
        });

        return forkJoin(appelsVersAddAssignment);
    }


}
