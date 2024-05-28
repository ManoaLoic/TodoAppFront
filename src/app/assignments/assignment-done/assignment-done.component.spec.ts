import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentDoneComponent } from './assignment-done.component';

describe('AssignmentDoneComponent', () => {
  let component: AssignmentDoneComponent;
  let fixture: ComponentFixture<AssignmentDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentDoneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignmentDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
