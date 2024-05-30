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

    this.assignmentsService.getAssignmentsCount().subscribe(data => {
      data.result.forEach((item: {rendu: boolean, count: number}) => {
          if(item.rendu){
            this.assignmentsDoneCount = item.count;
          }else{
            this.assignmentsToDoCount = item.count;
          }
          this.totalAssignments += item.count;
      });
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