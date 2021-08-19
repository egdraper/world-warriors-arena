import { Component } from '@angular/core';
import { CanvasService } from './canvas/canvas.service';
import { Engine } from './engine/engine';
import { ShortestPath } from './engine/shortest-path';
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
    private shortestPath: ShortestPath
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
    const cellStart = this.grid.getGridCellByCoordinate(25, 25)
    const character = cellStart.occupiedBy
    this.selectedCell = this.grid.getGridCellByCoordinate(event.clickX, event.clickY)
    character.move(cellStart, this.selectedCell)
    
    const shortestPath = this.shortestPath.find(cellStart, this.selectedCell, this.assetService.gameComponents)
    console.log(shortestPath)
    this.assetService.addClickAnimation(this.selectedCell)
  }
}
