import { Injectable } from '@angular/core';
import { Matiere } from '../matieres/matiere.model';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';
import { MATIERE_DATA } from './matiere.data';
import { API_ENDPOINT } from './constants';

@Injectable({
    providedIn: 'root'
})
export class MatieresService {
    assignments: Matiere[] = [];

    constructor(private logService: LoggingService,
        private http: HttpClient) { }

    uri = `${API_ENDPOINT}/matieres`;

    getMatieresPagines(page: number, limit: number): Observable<any> {
        return this.http.get<Matiere[]>(this.uri + "?page=" + page + "&limit=" + limit);
    }

    getMatiere(id: number): Observable<Matiere | undefined> {
        return this.http.get<Matiere>(this.uri + "/" + id)
            .pipe(
                catchError(this.handleError<any>('### catchError: Matieres by id avec id=' + id))
            );
    }

    private handleError<T>(operation: any, result?: T) {
        return (error: any): Observable<T> => {
            console.log(error);
            console.log(operation + ' a échoué ' + error.message);

            return of(result as T);
        }
    };

    addMatiere(matiere: Matiere): Observable<any> {
        this.logService.log(matiere.nom, "ajouté");
        return this.http.post<Matiere>(this.uri, matiere);
    }

    updateMatiere(matiere: Matiere): Observable<any> {
        this.logService.log(matiere.nom, "modifié");
        return this.http.put<Matiere>(this.uri, matiere);
    }

    deleteMatiere(matiere: Matiere): Observable<any> {
        this.logService.log(matiere.nom, "supprimé");
        return this.http.delete(this.uri + "/" + matiere._id);
    }

    peuplerBDavecForkJoin(): Observable<any> {
        let appelsVersAddAssignment: Observable<any>[] = [];

        MATIERE_DATA.forEach(a => {
            const nouvelMatiere = new Matiere();
            nouvelMatiere.nom = a.nom;
            nouvelMatiere.image = a.image;
            nouvelMatiere.prof_img = a.prof_img;
            nouvelMatiere.nom_prof = a.nom_prof;

            appelsVersAddAssignment.push(this.addMatiere(nouvelMatiere));
        });

        return forkJoin(appelsVersAddAssignment);
    }


}
