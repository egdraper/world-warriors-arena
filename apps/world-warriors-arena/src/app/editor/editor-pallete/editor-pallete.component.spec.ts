import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPalleteComponent } from './editor-pallete.component';

describe('EditorPalleteComponent', () => {
  let component: EditorPalleteComponent;
  let fixture: ComponentFixture<EditorPalleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorPalleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorPalleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
