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
  @ViewChild('drawCanvas') drawingCanvas: ElementRef<HTMLCanvasElement>;
  @Output() gridClick = new EventEmitter<{ clickX: number, clickY: number }>()

  public overlayContext: CanvasRenderingContext2D;
  public foregroundContext: CanvasRenderingContext2D;
  public backgroundContext: CanvasRenderingContext2D;
  public fogContext: CanvasRenderingContext2D;
  public blackoutContext: CanvasRenderingContext2D;
  public drawingContext: CanvasRenderingContext2D;
  public hoveringCell: Cell

  public drawing = true

  private mouseIsDown = false
  private controlPressed = false
  private shiftPressed = false
  canvasSize: number;

  constructor(
    public canvasService: CanvasService,
    private gridService: GridService,
    private assetService: AssetsService,
    private editorService: EditorService,
  ) { }

  // this needs to be put in a public function so we can pass in grid information 
  public ngAfterViewInit(): void {
    this.canvasService.canvasSize = window.innerHeight <= 1536 ? window.innerHeight : 1536
    // this.canvasService.canvasSize = 32 * 32


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
      this.canvasService.adustViewPort(-32, 0)
    }
    if (event.key === "ArrowLeft") {
      // console.log("AAA")
      this.canvasService.adustViewPort(32, 0)
    }
    if (event.key === "ArrowUp") {
      this.canvasService.adustViewPort(0, 32)
    }
    if (event.key === "ArrowDown") {
      this.canvasService.adustViewPort(0, -32)
    }
  }

  @HostListener("document:keyup", ["$event"])
  public onKeyUp(event: KeyboardEvent): void {
    if (event.key === "Control") {
      this.controlPressed = false
      this.editorService.hoveringCell = undefined
    }

    if (event.key === "Shift") {
      this.shiftPressed = false
    }

    if (event.key === "a") {
      this.drawing = !this.drawing
      setTimeout(()=> {
        if(this.drawing) {
           this.createLargeImage()
        } else {
          this.canvasService.largeImageBackground = undefined
          this.canvasService.largeImageForeground = undefined
        }

      })
    }
  }

  public createLargeImage() {
    this.canvasService.drawingCTX.canvas.height = this.gridService.width * 32
    this.canvasService.drawingCTX.canvas.width = this.gridService.height * 32
    this.canvasService.drawingCTX.scale(this.canvasService.scale, this.canvasService.scale)

    this.drawObstacles(this.canvasService.drawingCTX)
    
    const bimg = this.canvasService.drawingCanvas.nativeElement.toDataURL("image/png")
    const fimg = this.canvasService.drawingCanvas.nativeElement.toDataURL("image/png")
    const bimage = new Image()
    const fimage = new Image()
    bimage.src = bimg
    fimage.src = fimg
    this.canvasService.largeImageBackground = bimage
    this.canvasService.largeImageForeground = fimage

 
  }

  public drawObstacles(ctx: CanvasRenderingContext2D): void {
    this.gridService.gridDisplay.forEach(row => {
      row.forEach((cell: Cell) => {
        this.drawOnBackgroundCell(cell, ctx)
        this.drawOnCell(cell, ctx)
      })
    })
  }

  private drawOnCell(cell: Cell, ctx: CanvasRenderingContext2D): void {
    if(cell.imageTile) {
    ctx.drawImage(
      cell.imageTile.spriteSheet,
      cell.imageTile.spriteGridPosX * cell.imageTile.multiplier,
      cell.imageTile.spriteGridPosY * cell.imageTile.multiplier,
      cell.imageTile.tileWidth * cell.imageTile.multiplier,
      cell.imageTile.tileHeight * cell.imageTile.multiplier,
      cell.posX + cell.imageTile.tileOffsetX,
      cell.posY + cell.imageTile.tileOffsetY,
      cell.imageTile.tileWidth * (cell.imageTile.sizeAdjustment || cell.imageTile.multiplier),
      cell.imageTile.tileHeight * (cell.imageTile.sizeAdjustment || cell.imageTile.multiplier)
    )
    }
  }

  public drawOnBackgroundCell(cell: Cell, ctx: CanvasRenderingContext2D): void {
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(
      cell.backgroundTile.spriteSheet,
      cell.backgroundTile.spriteGridPosX[0] * 32,
      cell.backgroundTile.spriteGridPosY[0] * 32,
      32,
      32,
      cell.posX,
      cell.posY,
      32,
      32
    )
  }

  public onCanvasClick(event: any): void {
    this.mouseIsDown = true

    const clickX = event.offsetX + (-1 * this.canvasService.canvasViewPortOffsetX)
    const clickY = event.offsetY + (-1 * this.canvasService.canvasViewPortOffsetY)

    const selectedCell = this.gridService.getGridCellByCoordinate(clickX, clickY)

    if (selectedCell.occupiedBy) {
      this.assetService.selectDeselectAsset(selectedCell)
    }

    if (!selectedCell.occupiedBy && this.assetService.selectedGameComponent) {
      this.assetService.selectedGameComponent.startMovement(this.assetService.selectedGameComponent.cell, selectedCell, this.assetService.gameComponents)
    }

    // } else {
    //   // select Asset
    //   this.canvasService.resetViewport()
    //   const assetXPos = -1 * this.assetService.selectedGameComponent.cell.posX + this.canvasService.centerPointX
    //   const assetYPos = -1 * this.assetService.selectedGameComponent.cell.posY + this.canvasService.centerPointY
    //   this.canvasService.adustViewPort(assetXPos, assetYPos)
    // }

    this.onMouseMove(event)
  }

  public onMouseMove(event: any): void {
    const clickX = event.offsetX + (-1 * this.canvasService.canvasViewPortOffsetX)
    const clickY = event.offsetY + (-1 * this.canvasService.canvasViewPortOffsetY)

    this.hoveringCell = this.gridService.getGridCellByCoordinate(clickX, clickY)

    // Shift Pressed
    if (this.shiftPressed) {
      this.canvasService.scrollCanvas(clickX, clickY, 32, 160)
    }


    // Control Pressed
    if (event.offsetX < 0 || event.offsetY < 0) { return }
    if (!this.mouseIsDown || !this.controlPressed) { return }

    this.canvasService.scrollCanvas(clickX, clickY)

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