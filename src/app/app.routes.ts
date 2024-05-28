import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AssignmentsComponent } from './assignments/assignments.component';
import { AddAssignmentComponent } from './assignments/add-assignment/add-assignment.component';
import { AssignmentDetailComponent } from './assignments/assignment-detail/assignment-detail.component';
import { EditAssignmentComponent } from './assignments/edit-assignment/edit-assignment.component';
import { authGuard } from './shared/auth.guard';
import { adminGuard } from './shared/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home', component: AssignmentsComponent, canActivate: [authGuard]
  },
  { path: "add", component: AddAssignmentComponent, canActivate: [adminGuard] },
  { path: "assignment/:id", component: AssignmentDetailComponent, canActivate: [authGuard] },
  {
    path: "assignment/:id/edit",
    component: EditAssignmentComponent,
    canActivate: [adminGuard]
  }
];
