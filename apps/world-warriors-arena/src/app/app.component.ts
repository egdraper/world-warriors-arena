import { Component } from '@angular/core';
import { CanvasService } from './canvas/canvas.service';
import { Engine } from './engine/engine';
import { AssetsService } from './game-assets/assets.service';
import { GridService } from './grid/grid.service';

@Component({
  selector: 'world-warriors-arena-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    public grid: GridService,
    private engine: Engine,
    private assetService: AssetsService,
    private canvasService: CanvasService,
  ) {
    this.grid.createGrid(15,15)
  }

  public ngOnInit(): void {
    this.engine.startEngine()
  }

  public ngAfterViewInit(): void {
    this.canvasService.drawGrid()
  }

  public onAddCharacterClick(): void {
    this.assetService.addCharacter()
  }
}
