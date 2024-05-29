import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from '../../shared/assignments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-edit-assignment',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatStepperModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-assignment.component.html',
  styleUrl: './edit-assignment.component.css',
})
export class EditAssignmentComponent implements OnInit {
  assignment: Assignment | undefined;
  // Pour les champs de formulaire
  nomAssignment = '';
  dateDeRendu?: Date = undefined;
  rendu: boolean = false;
  note?: number;
  remarque?: string;

  step1FormGroup: FormGroup;
  step2FormGroup: FormGroup;

  constructor(
    private assignmentsService: AssignmentsService,
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder
  ) {
    this.step1FormGroup = this._formBuilder.group({
        nomAssignment: ['', Validators.required],
        dateDeRendu: ['', Validators.required]
      });

      this.step2FormGroup = this._formBuilder.group({
        note: ['', [Validators.min(0), Validators.max(20)]],
        remarque: ['']
      });
  }

  ngOnInit() {
    // on récupère l'id dans l'url
    const id = this.route.snapshot.params['id'];
    this.assignmentsService.getAssignment(id)
    .subscribe((assignment) => {
      this.assignment = assignment;
      // on met à jour les champs du formulaire
      if (assignment !== undefined) {
        this.nomAssignment = assignment.nom;
        this.dateDeRendu = assignment.dateDeRendu;
      }
    });
  }

  onSaveAssignment() {
    if (!this.assignment) return;
    if (this.nomAssignment == '' || this.dateDeRendu === undefined) return;

    this.assignment.nom = this.nomAssignment;
    this.assignment.dateDeRendu = this.dateDeRendu;
    this.assignment.rendu = this.rendu;
    this.assignment.note = this.note;
    this.assignment.remarque = this.remarque;
    this.assignmentsService
      .updateAssignment(this.assignment)
      .subscribe((message) => {
        console.log(message);

        // navigation vers la home page
        this.router.navigate(['/home']);
      });
  }
}
