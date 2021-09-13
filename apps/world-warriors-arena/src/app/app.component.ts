import { Component } from '@angular/core';
import { CanvasService } from './canvas/canvas.service';
import { Engine } from './engine/engine';
import { AssetsService } from './game-assets/assets.service';
import { Cell } from './models/cell.model';
import { GridService } from './grid/grid.service';
import { Asset } from './models/assets.model';
import { DrawService } from './engine/draw.service';
import { FogOfWarService } from './engine/visibility.service';

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
    private canvasService: CanvasService,
    public grid: GridService,
    public drawService: DrawService,
    public visibilityService: FogOfWarService
  ) {
    this.grid.createGrid(10, 10)
  }

  public ngOnInit(): void {
    this.engine.startEngine()
  }

  public ngAfterViewInit(): void {
    this.canvasService.drawGrid()
    this.drawService.drawFog()
  }

  public onAddCharacterClick(): void {
    this.visibilityService.preloadVisibility()
    this.visibilityService.fogEnabled = true
    this.drawService.drawBlackoutFog()
    this.assetService.addCharacter()
  }

  public onGridClick(event: { clickX: number, clickY: number }): void {
    // this.selectedCell = this.grid.getGridCellByCoordinate(event.clickX, event.clickY)
    
    // const ctx = this.canvasService.backgroundCTX
    // ctx.clearRect(0, 0, this.grid.width * 50, this.grid.height * 50);
    // this.canvasService.drawGrid()

    // const testCell = this.grid.getGridCellByCoordinate(250, 250)
    // this.traceCell(testCell, this.selectedCell)


    


    this.selectedCell = this.grid.getGridCellByCoordinate(event.clickX, event.clickY)

    if (this.selectedCell.occupiedBy) {
      const character = this.selectedCell.occupiedBy
      this.assetService.gameComponents.forEach(asset => asset.selectionIndicator = undefined)
      this.assetService.selectedGameComponent = character
      this.assetService.selectedGameComponent.selectCharacter()
    } else {
      if(this.assetService.selectedGameComponent) {
        this.assetService.selectedGameComponent.startMovement(this.assetService.selectedGameComponent.cell, this.selectedCell, this.assetService.gameComponents)
      }
    //   this.assetService.addClickAnimation(this.selectedCell, `../../../assets/images/DestinationX.png`)
    }
  }

 
}
