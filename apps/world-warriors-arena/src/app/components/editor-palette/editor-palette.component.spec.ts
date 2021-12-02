import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPaletteComponent } from './editor-palette.component';

describe('EditorpaletteComponent', () => {
  let component: EditorPaletteComponent;
  let fixture: ComponentFixture<EditorPaletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorPaletteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
