import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PutGestionComponent } from './put-gestion.component';

describe('PutGestionComponent', () => {
  let component: PutGestionComponent;
  let fixture: ComponentFixture<PutGestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PutGestionComponent]
    });
    fixture = TestBed.createComponent(PutGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
