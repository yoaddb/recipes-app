import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeNotFoundComponent } from './recipe-not-found.component';

describe('RecipeNotFoundComponent', () => {
  let component: RecipeNotFoundComponent;
  let fixture: ComponentFixture<RecipeNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeNotFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
