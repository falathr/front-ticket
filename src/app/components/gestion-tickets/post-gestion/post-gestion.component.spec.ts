import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostGestionComponent } from './post-gestion.component';

describe('PostGestionComponent', () => {
  let component: PostGestionComponent;
  let fixture: ComponentFixture<PostGestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostGestionComponent]
    });
    fixture = TestBed.createComponent(PostGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
