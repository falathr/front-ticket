import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetGestionComponent } from './get-gestion.component';

describe('GetGestionComponent', () => {
  let component: GetGestionComponent;
  let fixture: ComponentFixture<GetGestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetGestionComponent]
    });
    fixture = TestBed.createComponent(GetGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
