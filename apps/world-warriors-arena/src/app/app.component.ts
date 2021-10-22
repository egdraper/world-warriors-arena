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
  
  public onAddCharacterClick(): void {
    this.visibilityService.fogEnabled = false
    if(this.visibilityService.fogEnabled) {
      this.drawService.drawFog()
      this.visibilityService.preloadVisibility(this.assetService.obstacles)
      this.drawService.drawBlackoutFog()
    }
  }

  public onGridClick(event: { clickX: number, clickY: number }): void {
    this.selectedCell = this.grid.getGridCellByCoordinate(event.clickX, event.clickY)
    console.log(this.selectedCell)
    if (this.selectedCell.occupiedBy) {
      const character = this.selectedCell.occupiedBy
      this.assetService.gameComponents.forEach(asset => asset.selectionIndicator = undefined)
      this.assetService.selectedGameComponent = character
      this.assetService.selectedGameComponent.selectCharacter()
    } else {
      if(this.assetService.selectedGameComponent) {
        const posX = this.assetService.selectedGameComponent.positionX + 1
        const posY = this.assetService.selectedGameComponent.positionY + 1
        
        const characterCell = this.grid.getGridCellByCoordinate((posX * this.canvasService.scale), (posY * this.canvasService.scale))

        const xOffset = (this.selectedCell.x - 8) + characterCell.x 
        const yOffset = (this.selectedCell.y - 8) + characterCell.y 
        const selectedCellOffSet = this.grid.grid[`x${xOffset}:y${yOffset}`]
        this.assetService.selectedGameComponent.startMovement(this.assetService.selectedGameComponent.cell, selectedCellOffSet, this.assetService.gameComponents)
      }
    }
  }

  public generateRandomMap(): void {
    const inverted = true
    this.assetService.obstaclesDirty = true
    this.grid.createGrid(60, 60, "DrawableTree")
    this.canvasService.setupCanvases(this.grid.width, this.grid.height)

    this.drawService.autoFillTerrain("greenGrass")
    this.drawService.drawBackground(true)
    this.drawService.drawLines()
  }
}
