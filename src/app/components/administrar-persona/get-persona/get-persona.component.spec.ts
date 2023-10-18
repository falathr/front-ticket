import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPersonaComponent } from './get-persona.component';

describe('GetPersonaComponent', () => {
  let component: GetPersonaComponent;
  let fixture: ComponentFixture<GetPersonaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetPersonaComponent]
    });
    fixture = TestBed.createComponent(GetPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
