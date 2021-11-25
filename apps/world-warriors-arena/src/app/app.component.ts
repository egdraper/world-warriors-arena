import { Component } from '@angular/core';
import { Engine } from './game-engine/engine';
import { AssetsService } from './game-assets/assets.service';
import { Cell } from './models/cell.model';
import { GridService } from './game-engine/grid.service';
import { DrawService } from './game-engine/draw-tools/draw.service';
import { FogOfWarService } from './game-engine/visibility.service';
import { CanvasService } from './canvas/canvas.service';

@Component({
  selector: 'world-warriors-arena-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public selectedCell: Cell
  constructor(
    private engine: Engine,
    private assetService: AssetsService,
    public grid: GridService,
    public drawService: DrawService,
    public visibilityService: FogOfWarService,
    public canvasService: CanvasService
  ) {

  }

  public ngOnInit(): void {
    this.engine.startEngine()
  }

  public ngAfterViewInit(): void {

  }
  
}
