import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AssignmentsService } from '../shared/assignments.service';
import { AuthService } from '../shared/auth.service';
import { User } from '../users/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  currentUser!: User;
  assignmentsToDoCount: number = 0;
  assignmentsDoneCount: number = 0;
  totalAssignments: number = 0;
  assignmentsToDoPercentage: number = 0;
  assignmentsDonePercentage: number = 0;

  constructor(
    private assignmentsService: AssignmentsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser() as User;

    this.assignmentsService.getAssignmentsToDo(1, 100).subscribe(data => {
      this.assignmentsToDoCount = data.length;
      this.calculatePercentages();
    });

    this.assignmentsService.getAssignmentsPagines(1, 100, true).subscribe(data => {
      this.assignmentsDoneCount = data.length;
      this.calculatePercentages();
    });

    this.assignmentsService.getAssignmentsToDoCount().subscribe((count: number) => {
      this.totalAssignments = count;
      this.calculatePercentages();
    });    
  }

  calculatePercentages() {
    if (this.totalAssignments !== 0) {
      this.assignmentsToDoPercentage = (this.assignmentsToDoCount / this.totalAssignments * 100);
      this.assignmentsDonePercentage = (this.assignmentsDoneCount / this.totalAssignments * 100);
    } else {
      this.assignmentsToDoPercentage = 0;
      this.assignmentsDonePercentage = 0;
    }
  }
}