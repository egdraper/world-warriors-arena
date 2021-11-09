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
  canvasSize: number;

  constructor(
    public canvasService: CanvasService,
    private gridService: GridService,
    private assetService: AssetsService,
    private editorService: EditorService,
    private engineService: Engine
  ) {

    this.engineService.onFire.subscribe((frame) => {
      if(this.rightArrowDown) {
        this.canvasService.scrollViewPort(1, 0, this.gridService)
      }
      if(this.leftArrowDown) {
        this.canvasService.scrollViewPort(-1, 0, this.gridService)
      }
      if(this.upArrowDown) {
        this.canvasService.scrollViewPort(0, -1, this.gridService)
      }
      if(this.downArrowDown) {
        this.canvasService.scrollViewPort(0, 1, this.gridService)
      }
    })
   }

  // this needs to be put in a public function so we can pass in grid information 
  public ngAfterViewInit(): void {
    let perfectHeight = window.innerHeight
    while (perfectHeight % (this.canvasService.scale * 32) !== 0) {
      perfectHeight--
    }

    this.canvasService.maxCellCountX = perfectHeight / (32 * this.canvasService.scale)

    this.canvasService.canvasSize = perfectHeight

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

    if (event.key === "Shift") {
      this.shiftPressed = false
    }

    if (event.key === "q") {
      this.editMode = !this.editMode
      setTimeout(() => {
        if (!this.editMode) {
          this.canvasService.createLargeImage(this.gridService.width * 32, this.gridService.height * 32, this.gridService)
        } else {
          this.canvasService.largeImageBackground = undefined
          this.canvasService.largeImageForeground = undefined
        }
      })
    }
  }


  public onCanvasClick(event: any): void {
    this.mouseIsDown = true

    const clickX = event.offsetX + (-1 * this.canvasService.canvasViewPortOffsetX * this.canvasService.scale)
    const clickY = event.offsetY + (-1 * this.canvasService.canvasViewPortOffsetY * this.canvasService.scale)

    const selectedCell = this.gridService.getGridCellByCoordinate(clickX, clickY)

    if (selectedCell.occupiedBy) {
      this.assetService.selectDeselectAsset(selectedCell)
    }

    if (!selectedCell.occupiedBy && this.assetService.selectedGameComponent) {
      this.assetService.selectedGameComponent.startMovement(this.assetService.selectedGameComponent.cell, selectedCell, this.assetService.gameComponents)
    }
    else {
      this.canvasService.centerOverAsset(this.assetService.selectedGameComponent, this.gridService.width, this.gridService.height)
    }

    this.onMouseMove(event)
  }

  public onMouseMove(event: any): void {
    const clickX = event.offsetX + (-1 * this.canvasService.canvasViewPortOffsetX * this.canvasService.scale)
    const clickY = event.offsetY + (-1 * this.canvasService.canvasViewPortOffsetY * this.canvasService.scale)

    this.hoveringCell = this.gridService.getGridCellByCoordinate(clickX, clickY)

    // Shift Pressed
    if (this.shiftPressed) {
      this.canvasService.scrollCanvas(clickX, clickY, GameSettings.scrollSpeed, GameSettings.scrollSensitivity)
    }

    // Control Pressed
    if (event.offsetX < 0 || event.offsetY < 0) { return }
    if (!this.mouseIsDown || !this.controlPressed) { return }

    this.canvasService.scrollCanvas(clickX, clickY, GameSettings.scrollSpeed, GameSettings.scrollSensitivity)

    if (this.gridService.inverted) { // Rename to this.gridService.removing or something
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
}