import { TestBed } from '@angular/core/testing';

import { TerainEditorService } from './terain-editor.service';

describe('TerainEditorService', () => {
  let service: TerainEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerainEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
