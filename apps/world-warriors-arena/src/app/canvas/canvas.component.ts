import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { EditorService } from '../editor/editor-palette/editor.service';
import { AssetsService } from '../game-assets/assets.service';
import { growableItems, TerrainType } from '../game-assets/tiles.db.ts/tile-assets.db';
import { GridService } from '../game-engine/grid.service';
import { Cell } from '../models/cell.model';
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
  public hoveringCell: Cell

  private mouseIsDown = false
  private controlPressed = false

  constructor(
    public canvasService: CanvasService,
    private gridService: GridService,
    private assetService: AssetsService,
    private editorService: EditorService,
  ) { }

  // this needs to be put in a public function so we can pass in grid information 
  public ngAfterViewInit(): void {
    this.canvasService.canvasSize = window.innerHeight <= 1344 ? window.innerHeight : 1344 

    this.canvasService.centerPointX = Math.floor(this.canvasService.canvasSize / 2)
    this.canvasService.centerPointY = Math.floor(this.canvasService.canvasSize / 2)
    // Background
    this.backgroundContext = this.backgroundCanvas.nativeElement.getContext('2d');
    this.canvasService.backgroundCTX = this.backgroundContext
    this.canvasService.backgroundCanvas = this.backgroundCanvas
  

    // Foreground
    this.foregroundContext = this.foregroundCanvas.nativeElement.getContext('2d');
    this.canvasService.foregroundCTX = this.foregroundContext
    this.canvasService.foregroundCanvas = this.foregroundCanvas

    // Overlay
    this.overlayContext = this.overlayCanvas.nativeElement.getContext('2d');
    this.canvasService.overlayCTX = this.overlayContext
    this.canvasService.overlayCanvas = this.overlayCanvas

    // Fog
    this.fogContext = this.fogCanvas.nativeElement.getContext('2d');
    this.canvasService.fogCTX = this.fogContext
    this.canvasService.fogCanvas = this.fogCanvas

    // Fog
    this.blackoutContext = this.blackoutCanvas.nativeElement.getContext('2d');
    this.canvasService.blackoutCTX = this.blackoutContext
    this.canvasService.blackoutCanvas = this.blackoutCanvas
  }

  @HostListener("document:keydown", ["$event"])
  public onKeyDown(event: KeyboardEvent): void {
    if (this.assetService.selectedGameComponent) {
      this.assetService.selectedGameComponent.setDirection(event)
    }

    if (event.key === "Control") {
      this.controlPressed = true
      this.editorService.hoveringCell = this.hoveringCell 
    }

    if (event.key === "ArrowRight") {
      this.canvasService.adustViewPort(-30, 0)
    }
    if (event.key === "ArrowLeft") {
      // console.log("AAA")
      this.canvasService.adustViewPort(30, 0)
    }
    if (event.key === "ArrowUp") {
      this.canvasService.adustViewPort(0, 30)
    }
    if (event.key === "ArrowDown") {
      this.canvasService.adustViewPort(0, -30)
    }
  }

  @HostListener("document:keyup", ["$event"])
  public onKeyUp(event: KeyboardEvent): void {
    if (event.key === "Control") {
      this.controlPressed = false
      this.editorService.hoveringCell = undefined 
    }

    if( event.key === "Enter") {
      this.canvasService.resetViewPortal()
    }
  }

  public onCanvasClick(event: any): void {
    this.mouseIsDown = true
    const clickX = event.offsetX + (-1 * this.canvasService.canvasViewPortOffsetX)
    const clickY = event.offsetY + (-1 * this.canvasService.canvasViewPortOffsetY)

    const selectedCell = this.gridService.getGridCellByCoordinate(clickX, clickY)
    
    // determine movement or selection
    const hasAsset = this.assetService.checkForAsset(selectedCell)

    if(this.assetService.selectedGameComponent && !hasAsset) {
      // move Asset
      this.assetService.selectedGameComponent.startMovement(this.assetService.selectedGameComponent.cell, selectedCell, this.assetService.gameComponents)
    } else {
      // select Asset
      this.canvasService.resetViewport()
      const assetXPos = -1 * this.assetService.selectedGameComponent.cell.posX + this.canvasService.centerPointX
      const assetYPos = -1 * this.assetService.selectedGameComponent.cell.posY + this.canvasService.centerPointY
      this.canvasService.adustViewPort(assetXPos, assetYPos)
    }
    
    this.onMouseMove(event)
  }

  public onMouseMove(event: any): void {
    const clickX = event.offsetX + (-1 * this.canvasService.canvasViewPortOffsetX)
    const clickY = event.offsetY + (-1 * this.canvasService.canvasViewPortOffsetY)
    
    this.hoveringCell = this.gridService.getGridCellByCoordinate(clickX, clickY)
    
    if (event.offsetX < 0 || event.offsetY < 0) { return }
    if (!this.mouseIsDown || !this.controlPressed) { return }
    
    if(this.gridService.inverted ) {
      this.assetService.addInvertedMapAsset(this.hoveringCell)
      this.editorService.backgroundDirty = true
    } else if (this.mouseIsDown && this.controlPressed) {
      this.editorService
      const selectedAsset = this.editorService.selectedAsset
      const drawableItem = growableItems.find(item => item.id === this.editorService.selectedGrowableAsset)

      this.assetService.addMapAsset(this.hoveringCell, selectedAsset, drawableItem)
      if(drawableItem.terrainType === TerrainType.Background) { this.editorService.backgroundDirty = true }
    }
    this.assetService.obstaclesDirty = true
  }

  public onMouseUp(event: any): void {
    this.mouseIsDown = false
  }
 
}