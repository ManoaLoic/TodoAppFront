import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-assignment-mark-note',
  templateUrl: './assignment-mark-note.component.html',
  standalone: true,
  styleUrls: ['./assignment-mark-note.component.css'],
  imports: [FormsModule, CommonModule, MatInputModule, MatDialogModule]
})
export class AssignmentMarkNoteComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AssignmentMarkNoteComponent>) { }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
