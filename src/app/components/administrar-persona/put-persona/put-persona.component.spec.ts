import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PutPersonaComponent } from './put-persona.component';

describe('PutPersonaComponent', () => {
  let component: PutPersonaComponent;
  let fixture: ComponentFixture<PutPersonaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PutPersonaComponent]
    });
    fixture = TestBed.createComponent(PutPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
