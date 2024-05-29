import { Injectable } from '@angular/core';
import { Assignment, Auteur } from '../assignments/assignment.model';
import { Observable, forkJoin, of, throwError, from } from 'rxjs';
import { catchError, map, tap, mergeMap } from 'rxjs/operators';
import { LoggingService } from './logging.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// importation des données de test
import { bdInitialAssignments } from './data';
import { API_ENDPOINT } from './constants';
import { User } from '../users/user.model';
import { Matiere } from '../matieres/matiere.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AssignmentsService {
    assignments: Assignment[] = [];

    constructor(private logService: LoggingService,
        private http: HttpClient, private authService: AuthService) { }

    uri = `${API_ENDPOINT}/assignments`;

    getAssignments(): Observable<Assignment[]> {
        return this.http.get<Assignment[]>(this.uri).pipe(
            catchError(this.handleError<Assignment[]>('getAssignments', []))
        );
    }

    //retourne tous les devoirs a faire
    getAssignmentsToDo(page: number, limit: number): Observable<any> {
        return this.http.get<any>(this.uri + "?rendu=false&page=" + page + "&limit=" + limit).pipe(
            catchError(this.handleError<any>('getAssignmentsPagines', []))
        );
    }


    getAssignmentsPagines(page: number, limit: number, rendu: boolean): Observable<any> {
        return this.http.get<Assignment[]>(`${this.uri}?page=${page}&limit=${limit}&rendu=${rendu}`).pipe(
            catchError(this.handleError<any>('getAssignmentsPagines', []))
        );
    }

    // renvoie un assignment par son id, renvoie undefined si pas trouvé
    getAssignment(id: string): Observable<Assignment | undefined> {
        return this.http.get<Assignment>(this.uri + "/" + id)
            .pipe(
                catchError(this.handleError<any>('### catchError: getAssignments by id avec id=' + id))
                /*
                map(a => {
                  a.nom += " MODIFIE PAR LE PIPE !"
                  return a;
                }),
                tap(a => console.log("Dans le pipe avec " + a.nom)),
                map(a => {
                  a.nom += " MODIFIE UNE DEUXIEME FOIS PAR LE PIPE !";
                  return a;
                })
                */
            );
        //let a = this.assignments.find(a => a.id === id);
        //return of(a);
    }


    // ajoute un assignment et retourne une confirmation
    addAssignment(assignment: Assignment): Observable<any> {
        //this.assignments.push(assignment);
        this.logService.log(assignment.nom, "ajouté");
        //return of("Assignment ajouté avec succès");
        return this.http.post<Assignment>(this.uri, assignment).pipe(
            catchError(this.handleError<any>('addAssignment'))
        );
    }

    //aide par chatgpt
    updateAssignment(assignment: Assignment): Observable<any> {
        // l'assignment passé en paramètre est le même objet que dans le tableau
        // plus tard on verra comment faire avec une base de données
        // il faudra faire une requête HTTP pour envoyer l'objet modifié
        //return of("Assignment modifié avec succès");
        const currentUser = this.authService.getCurrentUser();

        // Vérifier si l'utilisateur est connecté
        if (!currentUser) {
            return throwError('User not logged in');
        }

        return from(this.authService.isAdmin()).pipe(
            mergeMap(isAdmin => {
                if (isAdmin) {
                    this.logService.log(assignment.nom, 'modifié par un administrateur');
                    return this.http.put<Assignment>(this.uri, assignment).pipe(
                        catchError(this.handleError<any>('updateAssignment'))
                    );
                } else {
                    const assignmentId = assignment._id;
                    if (assignmentId) {
                        return this.getAssignment(assignmentId).pipe(
                            mergeMap(existingAssignment => {
                                if (existingAssignment?.auteur?._id === currentUser._id) {
                                    this.logService.log(assignment.nom, 'modifié');
                                    return this.http.put<Assignment>(this.uri, assignment).pipe(
                                        catchError(this.handleError<any>('updateAssignment'))
                                    );
                                } else {
                                    return throwError('Unauthorized');
                                }
                            })
                        );
                    } else {
                        return throwError('Invalid assignment ID');
                    }
                }
            })
        );
    }

    deleteAssignment(assignment: Assignment): Observable<any> {
        // on va supprimer l'assignment dans le tableau
        //let pos = this.assignments.indexOf(assignment);
        //this.assignments.splice(pos, 1);
        const assignmentId = assignment._id;
        if (!assignmentId) {
            return throwError('Invalid assignment ID');
        }

        return this.getAssignment(assignmentId).pipe(
            catchError(this.handleError<any>('getAssignment')),
            mergeMap(existingAssignment => {
                const currentUser = this.authService.getCurrentUser();
                return from(this.authService.isAdmin()).pipe(
                    mergeMap(isAdmin => {
                        if (isAdmin || existingAssignment?.auteur?._id === currentUser._id) {
                            this.logService.log(assignment.nom, 'supprimé');
                            return this.http.delete(`${this.uri}/${assignmentId}`).pipe(
                                catchError(this.handleError<any>('deleteAssignment'))
                            );
                        } else {
                            return throwError('Unauthorized');
                        }
                    })
                );
            })
        );
    }

    // VERSION NAIVE (on ne peut pas savoir quand l'opération des 1000 insertions est terminée)
    peuplerBD() {
        // on utilise les données de test générées avec mockaroo.com pour peupler la base
        // de données
        bdInitialAssignments.forEach(a => {
            let nouvelAssignment = new Assignment();
            nouvelAssignment.nom = a.nom;
            nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
            nouvelAssignment.rendu = a.rendu;

            this.addAssignment(nouvelAssignment)
                .subscribe(() => {
                    console.log("Assignment " + a.nom + " ajouté");
                });
        });
    }

    peuplerBDavecForkJoin(users: User[], matieres: Matiere[]): Observable<any> {
        let appelsVersAddAssignment: Observable<any>[] = [];

        bdInitialAssignments.forEach(a => {
            const nouvelAssignment = new Assignment();
            nouvelAssignment.nom = a.nom;
            nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
            nouvelAssignment.rendu = a.rendu;
            nouvelAssignment.note = a.note || undefined;
            nouvelAssignment.remarque = a.remarque || '';
            if (users[a.auteurId]) {
                const user = users[a.auteurId];
                const auteur = new Auteur();
                auteur._id = user._id;
                auteur.nom = user.nom;
                auteur.image = user.image;

                nouvelAssignment.auteur = auteur;
            }
            if (matieres[a.matiereId]) {
                const matiereInput = matieres[a.matiereId];
                const matiere = new Matiere();
                matiere._id = matiereInput._id;
                matiere.image = matiereInput.image;
                matiere.nom = matiereInput.nom;
                matiere.nom_prof = matiereInput.nom_prof;
                matiere.prof_img = matiereInput.prof_img;

                nouvelAssignment.matiere = matiere;
            }

            appelsVersAddAssignment.push(this.addAssignment(nouvelAssignment));
        });

        return forkJoin(appelsVersAddAssignment);
    }

    // Methode appelée par catchError, elle doit renvoyer
    // i, Observable<T> où T est le type de l'objet à renvoyer
    // (généricité de la méthode)
    private handleError<T>(operation: any, result?: T) {
        return (error: any): Observable<T> => {
            console.log(error); // pour afficher dans la console
            console.log(operation + ' a échoué ' + error.message);

            return of(result as T);
        }
    };

}
