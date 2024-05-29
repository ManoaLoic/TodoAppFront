import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentMarkNoteComponent } from './assignment-mark-note.component';

describe('AssignmentMarkNoteComponent', () => {
  let component: AssignmentMarkNoteComponent;
  let fixture: ComponentFixture<AssignmentMarkNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentMarkNoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignmentMarkNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
