import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { EditorService } from '../editor/editor-pallete/editor.service';
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

  private mouseIsDown = false
  private controlPressed = false
  private hoveringCell: Cell

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
    this.canvasService.backgroundCTX = this.backgroundContext
    this.canvasService.backgroundCanvas = this.backgroundCanvas
    this.canvasService.backgroundCTX.scale(1, 1)

    // Foreground
    this.foregroundContext = this.foregroundCanvas.nativeElement.getContext('2d');
    this.canvasService.foregroundCTX = this.foregroundContext
    this.canvasService.foregroundCanvas = this.foregroundCanvas
    this.canvasService.foregroundCTX.scale(1, 1)

    // Overlay
    this.overlayContext = this.overlayCanvas.nativeElement.getContext('2d');
    this.canvasService.overlayCTX = this.overlayContext
    this.canvasService.overlayCanvas = this.overlayCanvas
    this.canvasService.overlayCTX.scale(1, 1)

    // Fog
    this.fogContext = this.fogCanvas.nativeElement.getContext('2d');
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
      this.editorService.hoveringCell = this.hoveringCell 
    }
  }

  @HostListener("document:keyup", ["$event"])
  public onKeyUp(event: KeyboardEvent): void {
    if (event.key === "Control") {
      this.controlPressed = false
      this.editorService.hoveringCell = undefined 
    }
  }

  public onCanvasClick(event: any): void {
    this.mouseIsDown = true
    const clickX = event.offsetX
    const clickY = event.offsetY
    this.gridClick.emit({ clickX, clickY })

    this.onMouseMove(event)
  }

  public onMouseMove(event: any): void {
    this.hoveringCell = this.gridService.getGridCellByCoordinate(event.offsetX, event.offsetY)

    
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
      if(drawableItem.terrainType === TerrainType.Background) { this.editorService.backgroundDirty = true}
    }
  }

  public onMouseUp(event: any): void {
    this.mouseIsDown = false
  }
 
}