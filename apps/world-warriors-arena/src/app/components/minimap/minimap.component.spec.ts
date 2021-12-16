import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimapComponent } from './minimap.component';

describe('MinimapComponent', () => {
  let component: MinimapComponent;
  let fixture: ComponentFixture<MinimapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinimapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinimapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
