import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Assignment } from '../assignment.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-assigment-card',
  standalone: true,
  imports: [MatIconModule, MatCardModule, RouterLink, CommonModule, MatButtonModule],
  templateUrl: './assigment-card.component.html',
  styleUrl: './assigment-card.component.css'
})
export class AssigmentCardComponent {
    @Input() assignment : Assignment = new Assignment();
}
