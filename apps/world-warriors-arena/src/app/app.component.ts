import { Component } from '@angular/core';
import { CanvasService } from './canvas/canvas.service';
import { Engine } from './engine/engine';
import { AssetsService } from './game-assets/assets.service';
import { GridService } from './grid/grid.service';
import { Cell } from './models/cell.model';

@Component({
  selector: 'world-warriors-arena-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public selectedCell: Cell
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

  public onGridClick(event: {clickX: number, clickY: number}): void {
    this.selectedCell = this.grid.getGridCellByCoordinate(event.clickX, event.clickY)
    
    this.assetService.addClickAnimation(this.selectedCell)
    this.canvasService.overlayCTX.clearRect(0, 0, this.grid.width * 50, this.grid.height * 50);
    this.canvasService.overlayCTX.imageSmoothingEnabled = false
    this.canvasService.overlayCTX.beginPath()
    this.canvasService.overlayCTX.rect(this.selectedCell.posX, this.selectedCell.posY, 50, 50);
    this.canvasService.overlayCTX.strokeStyle = "rgba(200,0,0)"
    this.canvasService.overlayCTX.lineWidth = 3;
    this.canvasService.overlayCTX.stroke()
  }
}
