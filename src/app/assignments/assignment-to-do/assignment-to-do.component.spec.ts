import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentToDoComponent } from './assignment-to-do.component';

describe('AssignmentToDoComponent', () => {
  let component: AssignmentToDoComponent;
  let fixture: ComponentFixture<AssignmentToDoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentToDoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignmentToDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
