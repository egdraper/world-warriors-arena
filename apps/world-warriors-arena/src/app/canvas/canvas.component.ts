import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { EditorService } from '../editor/editor-pallete/editor.service';
import { AssetsService } from '../game-assets/assets.service';
import { cliffs, GrowableCliffs } from '../game-assets/tiles.db.ts/cliffs.db';
import { GrowableTrees } from '../game-assets/tiles.db.ts/trees.db';
import { GridService } from '../grid/grid.service';
import { Cell, GrowablePanelPosition } from '../models/cell.model';

import { CanvasService } from './canvas.service';

@Component({
  selector: 'world-warriors-arena-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent {
  @ViewChild('overlayCanvas') overlayCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('foregroundCanvas') foregroundCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('backgroundCanvas') backgroundCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('fogCanvas') fogCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('blackoutCanvas') blackoutCanvas: ElementRef<HTMLCanvasElement>;
  @Output() gridClick = new EventEmitter<{ clickX: number, clickY: number }>()

  public overlayContext: CanvasRenderingContext2D;
  public foregroundContext: CanvasRenderingContext2D;
  public backgroundContext: CanvasRenderingContext2D;
  public fogContext: CanvasRenderingContext2D;
  public blackoutContext: CanvasRenderingContext2D;

  private mouseIsDown = false
  private controlPressed = false

  constructor(
    private canvasService: CanvasService,
    private gridService: GridService,
    private assetService: AssetsService,
    private editorService: EditorService,
  ) { }

  // this needs to be put in a public function so we can pass in grid information 
  public ngAfterViewInit(): void {
    // Background
    this.backgroundContext = this.backgroundCanvas.nativeElement.getContext('2d');
    this.backgroundContext.canvas.height = this.gridService.height * 32
    this.backgroundContext.canvas.width = this.gridService.width * 32
    this.canvasService.backgroundCTX = this.backgroundContext
    this.canvasService.backgroundCanvas = this.backgroundCanvas
    this.canvasService.backgroundCTX.scale(1, 1)

    // Foreground
    this.foregroundContext = this.foregroundCanvas.nativeElement.getContext('2d');
    this.foregroundContext.canvas.height = this.gridService.height * 32
    this.foregroundContext.canvas.width = this.gridService.width * 32
    this.canvasService.foregroundCTX = this.foregroundContext
    this.canvasService.foregroundCanvas = this.foregroundCanvas
    this.canvasService.foregroundCTX.scale(1, 1)

    // Overlay
    this.overlayContext = this.overlayCanvas.nativeElement.getContext('2d');
    this.overlayContext.canvas.height = this.gridService.height * 32
    this.overlayContext.canvas.width = this.gridService.width * 32
    this.canvasService.overlayCTX = this.overlayContext
    this.canvasService.overlayCanvas = this.overlayCanvas
    this.canvasService.overlayCTX.scale(1, 1)

    // Fog
    this.fogContext = this.fogCanvas.nativeElement.getContext('2d');
    this.fogContext.canvas.height = this.gridService.height * 32
    this.fogContext.canvas.width = this.gridService.width * 32
    this.canvasService.fogCTX = this.fogContext
    this.canvasService.fogCanvas = this.fogCanvas
    this.canvasService.fogCTX.scale(1, 1)

    // Fog
    this.blackoutContext = this.blackoutCanvas.nativeElement.getContext('2d');
    this.blackoutContext.canvas.height = this.gridService.height * 32
    this.blackoutContext.canvas.width = this.gridService.width * 32
    this.canvasService.blackoutCTX = this.blackoutContext
    this.canvasService.blackoutCanvas = this.blackoutCanvas
    this.canvasService.blackoutCTX.scale(1, 1)

  }

  @HostListener("document:keydown", ["$event"])
  public onKeyDown(event: KeyboardEvent): void {
    if (this.assetService.selectedGameComponent) {
      this.assetService.selectedGameComponent.setDirection(event)
    }

    if (event.key === "Control") {
      this.controlPressed = true
    }
  }

  @HostListener("document:keyup", ["$event"])
  public onKeyUp(event: KeyboardEvent): void {
    if (event.key === "Control") {
      this.controlPressed = false
    }
  }

  public onCanvasClick(event: any): void {
    this.mouseIsDown = true
    const clickX = event.offsetX
    const clickY = event.offsetY
    this.gridClick.emit({ clickX, clickY })
  }

  public onMouseMove(event: any): void {
    if (event.offsetX < 0 || event.offsetY < 0) { return }

    if (this.mouseIsDown && this.controlPressed ) { // && this.editorService.selectedAsset) {
      const cellStart = this.gridService.getGridCellByCoordinate(event.offsetX, event.offsetY)
     
      if (!cellStart) { return }
         const selectedAsset = this.editorService.selectedAsset
         cellStart.imageTile = selectedAsset
         cellStart.obstacle = true
         cellStart.visible = true

     
      // for(let i = 0; i < selectedAsset.obstacleObstructionX; i++) {
      //   for(let l = 0 ; l < selectedAsset.obstacleObstructionY; l++) {
      //    this.gridService.grid[`x${cellStart.x + i}:y${cellStart.y - l}`].obstacle = selectedAsset.obstacle
      //    this.gridService.grid[`x${cellStart.x + i}:y${cellStart.y - l}`].visible = true
      //   }
      // }

      if(!selectedAsset) {
        this.drawGrowableItems(cellStart)
      }
      this.assetService.addObstacleImage(cellStart)      
    }
  }

  public onMouseUp(event: any): void {
    this.mouseIsDown = false
  }


  private drawGrowableItems(selectedCell: Cell): void {
    // export const GrowableCliffs = {
    //   id: "DrawableDirtCliff",
    //   topLeftPanel: cliffs.find(panel => panel.position === GrowablePanelPosition.topLeftPanel),
    //   topCenterPanel: cliffs.find(panel => panel.position === GrowablePanelPosition.topCenterPanel),
    //   topRightPanel: cliffs.find(panel => panel.position === GrowablePanelPosition.topRightPanel),
    //   bottomLeftPanel: cliffs.find(panel => panel.position === GrowablePanelPosition.bottomLeftPanel),
    //   bottomCenterPanel: cliffs.find(panel => panel.position === GrowablePanelPosition.bottomCenterPanel),
    //   bottomRightPanel: cliffs.find(panel => panel.position === GrowablePanelPosition.bottomRightPanel),
    //   growableLeftPanel: cliffs.find(panel => panel.position === GrowablePanelPosition.growableLeftPanel),
    //   growableCenterPanel: cliffs.find(panel => panel.position === GrowablePanelPosition.growableCenterPanel),
    //   growableRightPanel: cliffs.find(panel => panel.position === GrowablePanelPosition.growableRightPanel),
    // }

    const growableCliff = GrowableTrees

    if(selectedCell.neighbors[0]) {
      selectedCell.neighbors[0].growableTile = growableCliff
      selectedCell.neighbors[0].obstacle = true
      selectedCell.neighbors[0].visible = true
    }
    if(selectedCell.neighbors[1]) {
      selectedCell.neighbors[1].growableTile = growableCliff
      selectedCell.neighbors[1].obstacle = true
      selectedCell.neighbors[1].visible = true
    }
    if(selectedCell.neighbors[4]) {
      selectedCell.neighbors[4].growableTile = growableCliff
      selectedCell.neighbors[4].obstacle = true
      selectedCell.neighbors[4].visible = true
    }




    selectedCell.growableTile = growableCliff
    selectedCell.obstacle = true
    selectedCell.visible = true
  
  }
}