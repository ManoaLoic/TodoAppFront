import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigmentCardComponent } from './assigment-card.component';

describe('AssigmentCardComponent', () => {
  let component: AssigmentCardComponent;
  let fixture: ComponentFixture<AssigmentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssigmentCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssigmentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
