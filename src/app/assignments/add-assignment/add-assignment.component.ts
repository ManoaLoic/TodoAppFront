import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';

import { Assignment, Matiere } from '../assignment.model';
import { AssignmentsService } from '../../shared/assignments.service';
import { Router } from '@angular/router';
import { MatieresService } from '../../shared/matieres.service';

@Component({
    selector: 'app-add-assignment',
    standalone: true,
    providers: [provideNativeDateAdapter()],
    imports: [
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatButtonModule,
        MatSelectModule,
    ],
    templateUrl: './add-assignment.component.html',
    styleUrl: './add-assignment.component.css',
})
export class AddAssignmentComponent {
    // champs du formulaire
    nomAssignment = '';
    dateDeRendu = undefined;
    matiere = '';

    matieres: Matiere[] = [];

    constructor(
        private assignmentsService: AssignmentsService,
        private matieresService: MatieresService,
        private router: Router) { }

    ngOnInit() {
        this.matieresService.getMatieresPagines(1, 100).subscribe((data) => {
            this.matieres = data.docs;
        })
    }

    disableSubmit(): boolean {
        return this.nomAssignment == '' || this.dateDeRendu === undefined || this.matiere == '';
    }

    onSubmit(event: any) {
        if ((this.nomAssignment == '') || (this.dateDeRendu === undefined)) return;

        // on crée un nouvel assignment
        let nouvelAssignment = new Assignment();
        // on genere un id aléatoire (plus tard ce sera fait coté serveur par
        // une base de données)
        nouvelAssignment.nom = this.nomAssignment;
        nouvelAssignment.dateDeRendu = this.dateDeRendu;
        nouvelAssignment.rendu = false;

        nouvelAssignment.matiere = new Matiere();
        nouvelAssignment.matiere._id = this.matiere;

        this.assignmentsService
            .addAssignment(nouvelAssignment)
            .subscribe((reponse) => {
                console.log(reponse);
                const _id = reponse._id;
                // On navigue pour afficher la liste des assignments
                // en utilisant le router de manière programmatique
                this.router.navigate([`/assignment/${_id}`]);
            });
    }

}
