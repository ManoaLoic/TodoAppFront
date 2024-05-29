import { Component } from '@angular/core';
import { AssignmentsComponent } from '../assignments.component';

@Component({
  selector: 'app-assignment-done',
  standalone: true,
  imports: [AssignmentsComponent],
  templateUrl: './assignment-done.component.html',
  styleUrl: './assignment-done.component.css'
})
export class AssignmentDoneComponent {

}
