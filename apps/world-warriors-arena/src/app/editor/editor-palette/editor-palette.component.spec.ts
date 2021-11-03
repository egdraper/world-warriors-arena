import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorpaletteComponent } from './editor-palette.component';

describe('EditorpaletteComponent', () => {
  let component: EditorpaletteComponent;
  let fixture: ComponentFixture<EditorpaletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorpaletteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorpaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
