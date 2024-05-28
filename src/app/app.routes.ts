import { Routes } from '@angular/router';
import { AssignmentsComponent } from './assignments/assignments.component';
import { AddAssignmentComponent } from './assignments/add-assignment/add-assignment.component';
import { AssignmentDetailComponent } from './assignments/assignment-detail/assignment-detail.component';
import { EditAssignmentComponent } from './assignments/edit-assignment/edit-assignment.component';
import { AssignmentToDoComponent } from './assignments/assignment-to-do/assignment-to-do.component';
import { authGuard } from './shared/auth.guard';
import { AssignmentDoneComponent } from './assignments/assignment-done/assignment-done.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: AssignmentsComponent },
  { path: "add", component: AddAssignmentComponent },
  { path: "toDo", component: AssignmentToDoComponent },
  { path: "done", component: AssignmentDoneComponent },
  { path: "assignment/:id", component: AssignmentDetailComponent},
  {
    path: "assignment/:id/edit",
    component: EditAssignmentComponent,
    canActivate: [authGuard]
  }
];
