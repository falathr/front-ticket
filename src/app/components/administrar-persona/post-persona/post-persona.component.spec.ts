import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPersonaComponent } from './post-persona.component';

describe('PostPersonaComponent', () => {
  let component: PostPersonaComponent;
  let fixture: ComponentFixture<PostPersonaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostPersonaComponent]
    });
    fixture = TestBed.createComponent(PostPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
