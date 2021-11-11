import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { EditorService } from '../editor/editor-palette/editor.service';
import { AssetsService } from '../game-assets/assets.service';
import { growableItems, TerrainType } from '../game-assets/tiles.db.ts/tile-assets.db';
import { Engine } from '../game-engine/engine';
import { GridService } from '../game-engine/grid.service';
import { Cell } from '../models/cell.model';
import { GameSettings } from '../models/game-settings';
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
  @ViewChild('drawCanvas') drawingCanvas: ElementRef<HTMLCanvasElement>;
  @Output() gridClick = new EventEmitter<{ clickX: number, clickY: number }>()

  public overlayContext: CanvasRenderingContext2D;
  public foregroundContext: CanvasRenderingContext2D;
  public backgroundContext: CanvasRenderingContext2D;
  public fogContext: CanvasRenderingContext2D;
  public blackoutContext: CanvasRenderingContext2D;
  public drawingContext: CanvasRenderingContext2D;
  public hoveringCell: Cell
  public editMode = true

  private mouseIsDown = false
  private controlPressed = false
  private shiftPressed = false
  private rightArrowDown = false
  private leftArrowDown = false
  private upArrowDown = false
  private downArrowDown = false

  private rightQuadrant = false
  private leftQuadrant = false
  private bottomQuadrant = false
  private topQuadrant = false

  private setPortal = false
  private portalEntry: Cell

  constructor(
    public canvasService: CanvasService,
    private gridService: GridService,
    private assetService: AssetsService,
    private editorService: EditorService,
    private engineService: Engine
  ) {
    this.subscribeToEngine() 
  }

  // this needs to be put in a public function so we can pass in grid information 
  public ngAfterViewInit(): void {
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

    // Fog
    this.drawingContext = this.drawingCanvas.nativeElement.getContext('2d');
    this.canvasService.drawingCTX = this.drawingContext
    this.canvasService.drawingCanvas = this.drawingCanvas
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

    if (event.key === "Shift") {
      this.shiftPressed = true
    }

    if (event.key === "ArrowRight") {
      this.rightArrowDown = true
    }
    if (event.key === "ArrowLeft") {
      this.leftArrowDown = true
    }
    if (event.key === "ArrowUp") {
      this.upArrowDown = true
    }
    if (event.key === "ArrowDown") {
      this.downArrowDown = true
    }
    if (event.key === "e") {
      this.setPortal = true
    }
  }

  @HostListener("document:keyup", ["$event"])
  public onKeyUp(event: KeyboardEvent): void {
    if (event.key === "Control") {
      this.controlPressed = false
      this.editorService.hoveringCell = undefined
    }

    if (event.key === "ArrowRight") {
      this.rightArrowDown = false
    }
    if (event.key === "ArrowLeft") {
      this.leftArrowDown = false
    }
    if (event.key === "ArrowUp") {
      this.upArrowDown = false
    }
    if (event.key === "ArrowDown") {
      this.downArrowDown = false
    }

    if (event.key === "Delete") {
      this.assetService.selectedGameComponent.cell.occupiedBy = undefined
    }

    if (event.key === "Shift") {
      this.shiftPressed = false
      this.topQuadrant = false
      this.bottomQuadrant = false
      this.rightQuadrant = false
      this.leftQuadrant = false
    }

    if (event.key === "e") {
      this.setPortal = false
    }

    if (event.key === "q") {
      if(!this.gridService.activeGrid) { return }

      this.editMode = !this.editMode
      setTimeout(() => {
        if (!this.editMode) {
          this.gridService.activeGrid.largeImage.createLargeImage(this.gridService.activeGrid.width * 32, this.gridService.activeGrid.height * 32, this.gridService)
        } else {
          if(this.gridService.activeGrid) {
            this.gridService.activeGrid.largeImage.background = undefined
            this.gridService.activeGrid.largeImage.foreground = undefined
          }
        }
      })
    }
  }


  public onCanvasClick(event: any): void {

    
    this.mouseIsDown = true
    
    const clickX = event.offsetX + (-1 * this.canvasService.canvasViewPortOffsetX * GameSettings.scale)
    const clickY = event.offsetY + (-1 * this.canvasService.canvasViewPortOffsetY * GameSettings.scale)

    
    const selectedCell = this.gridService.activeGrid.getGridCellByCoordinate(clickX, clickY)
   
    if(this.setPortal) {
      this.portalEntry = selectedCell
      console.log(this.portalEntry)
      return
    }

    if(this.portalEntry) {
      this.portalEntry.portalTo = {gridId: this.gridService.activeGrid.id, cell: selectedCell}
      console.log(this.portalEntry.portalTo)
      this.portalEntry = undefined
      return
    }

    if (selectedCell.occupiedBy) {
      this.assetService.selectDeselectAsset(selectedCell)
    }

    if (!selectedCell.occupiedBy && this.assetService.selectedGameComponent) {
      this.assetService.selectedGameComponent.startMovement(this.assetService.selectedGameComponent.cell, selectedCell, this.assetService.gameComponents)
    }
    else {
      this.canvasService.centerOverAsset(this.assetService.selectedGameComponent, this.gridService.activeGrid.width, this.gridService.activeGrid.height)
    }

    this.onMouseMove(event)
  }

  public onMouseMove(event: any): void {
    if(!this.gridService.activeGrid) { return }

    const clickX = event.offsetX + (-1 * this.canvasService.canvasViewPortOffsetX * GameSettings.scale)
    const clickY = event.offsetY + (-1 * this.canvasService.canvasViewPortOffsetY * GameSettings.scale)

    this.hoveringCell = this.gridService.activeGrid.getGridCellByCoordinate(clickX, clickY)

    // Shift dow
    if (this.shiftPressed) {
      this.rightQuadrant = clickX > (-1 * this.canvasService.canvasViewPortOffsetX + this.canvasService.canvasSize) - this.canvasService.canvasSize / 3 
      this.bottomQuadrant = clickY > (-1 * this.canvasService.canvasViewPortOffsetY + this.canvasService.canvasSize) - this.canvasService.canvasSize / 3
      this.topQuadrant = clickX < (-1 * this.canvasService.canvasViewPortOffsetX + this.canvasService.canvasSize / 3) && (this.canvasService.canvasViewPortOffsetX < 0)
      this.leftQuadrant = clickY < (-1 * this.canvasService.canvasViewPortOffsetY + this.canvasService.canvasSize / 3) && (this.canvasService.canvasViewPortOffsetY < 0)
    }

    // Control Pressed
    if (event.offsetX < 0 || event.offsetY < 0) { return }
    if (!this.mouseIsDown || !this.controlPressed) { return }

    this.rightQuadrant = clickX > (-1 * this.canvasService.canvasViewPortOffsetX + this.canvasService.canvasSize) - 96
    this.bottomQuadrant = clickY > (-1 * this.canvasService.canvasViewPortOffsetY + this.canvasService.canvasSize) - 96
    this.topQuadrant = clickX < (-1 * this.canvasService.canvasViewPortOffsetX + 96) && (this.canvasService.canvasViewPortOffsetX < 0)
    this.leftQuadrant = clickY < (-1 * this.canvasService.canvasViewPortOffsetY + 96) && (this.canvasService.canvasViewPortOffsetY < 0)

    if (this.gridService.activeGrid.inverted) { // Rename to this.gridService.removing or something
      this.assetService.addInvertedMapAsset(this.hoveringCell)
      this.editorService.backgroundDirty = true
    } else if (this.mouseIsDown && this.controlPressed) {
      const selectedAsset = this.editorService.selectedAsset
      const drawableItem = growableItems.find(item => item.id === this.editorService.selectedGrowableAsset)

      this.assetService.addMapAsset(this.hoveringCell, selectedAsset, drawableItem)
      if (drawableItem.terrainType === TerrainType.Background) { this.editorService.backgroundDirty = true }
    }
    this.assetService.obstaclesDirty = true
  }

  public onMouseUp(event: any): void {
    this.mouseIsDown = false
  }

  public subscribeToEngine(): void {
    this.engineService.onFire.subscribe((frame) => {
      if (this.rightArrowDown) {
        this.canvasService.scrollViewPort(1, 0, this.gridService)
      }
      if (this.leftArrowDown) {
        this.canvasService.scrollViewPort(-1, 0, this.gridService)
      }
      if (this.upArrowDown) {
        this.canvasService.scrollViewPort(0, -1, this.gridService)
      }
      if (this.downArrowDown) {
        this.canvasService.scrollViewPort(0, 1, this.gridService)
      }

      if (this.rightQuadrant) {
        console.log("r" + this.rightQuadrant)
        this.canvasService.scrollViewPort(1, 0, this.gridService)
      }
      
      if (this.leftQuadrant) {
        this.canvasService.scrollViewPort(0, -1, this.gridService)
      }
      
      if (this.topQuadrant) {
        this.canvasService.scrollViewPort(-1, 0, this.gridService)
      }
      
      if (this.bottomQuadrant) {
        this.canvasService.scrollViewPort(0, 1, this.gridService)
      }
    })
  }
}