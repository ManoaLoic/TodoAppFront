import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssigmentCardComponent } from '../assigment-card/assigment-card.component';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from '../../shared/assignments.service';
import { AssignmentsComponent } from '../assignments.component';


@Component({
  selector: 'app-assignment-to-do',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AssigmentCardComponent,
    AssignmentsComponent
  ],
  templateUrl: './assignment-to-do.component.html',
  styleUrl: './assignment-to-do.component.css'
})
export class AssignmentToDoComponent implements OnInit {
    titre = 'Liste des devoirs à faire';

    page = 1;
    limit = 10;
    totalDocs!: number;
    totalPages!: number;
    nextPage!: number;
    prevPage!: number;
    hasNextPage!: boolean;
    hasPrevPage!: boolean;

    assignmentsToDo: Assignment[] = [];

    constructor(private assignmentsService: AssignmentsService) {}

    ngOnInit(): void {
        this.getAssignmentsToDo();
      }

      getAssignmentsToDo(): void {
        this.assignmentsService.getAssignmentsToDo(this.page, this.limit)
        .subscribe((data) => {
            console.log('Données arrivées');
            this.assignmentsToDo = data.docs;
            this.totalDocs = data.totalDocs;
            this.totalPages = data.totalPages;
            this.nextPage = data.nextPage;
            this.prevPage = data.prevPage;
            this.hasNextPage = data.hasNextPage;
            this.hasPrevPage = data.hasPrevPage;
        });
      }
}
