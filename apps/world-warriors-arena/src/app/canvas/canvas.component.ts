import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { AssetsService } from '../game-assets/assets.service';
import { GridService } from '../grid/grid.service';

import { CanvasService } from './canvas.service';

@Component({
  selector: 'world-warriors-arena-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent  {
  @ViewChild('overlayCanvas') overlayCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('foregroundCanvas') foregroundCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('backgroundCanvas') backgroundCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('fogCanvas') fogCanvas: ElementRef<HTMLCanvasElement>;
  @Output() gridClick = new EventEmitter<{clickX: number, clickY: number}>()

  public overlayContext: CanvasRenderingContext2D;
  public foregroundContext: CanvasRenderingContext2D;
  public backgroundContext: CanvasRenderingContext2D;
  public fogContext: CanvasRenderingContext2D;

  private mouseIsDown = false
  private controlPressed = false

  constructor(
    private canvasService: CanvasService,
    private gridService: GridService,
    private assetService: AssetsService
  ) { }

  // this needs to be put in a public function so we can pass in grid information 
  public ngAfterViewInit(): void {
    // Background
    this.backgroundContext = this.backgroundCanvas.nativeElement.getContext('2d');
    this.backgroundContext.canvas.height = this.gridService.height * 50
    this.backgroundContext.canvas.width = this.gridService.width * 50
    this.canvasService.backgroundCTX = this.backgroundContext
    this.canvasService.backgroundCanvas = this.backgroundCanvas
    this.canvasService.backgroundCTX.scale(1, 1)
    
    // Foreground
    this.foregroundContext = this.foregroundCanvas.nativeElement.getContext('2d');
    this.foregroundContext.canvas.height = this.gridService.height * 50
    this.foregroundContext.canvas.width = this.gridService.width * 50
    this.canvasService.foregroundCTX = this.foregroundContext
    this.canvasService.foregroundCanvas = this.foregroundCanvas
    this.canvasService.foregroundCTX.scale(1, 1)
    
    // Overlay
    this.overlayContext = this.overlayCanvas.nativeElement.getContext('2d');
    this.overlayContext.canvas.height = this.gridService.height * 50
    this.overlayContext.canvas.width = this.gridService.width * 50
    this.canvasService.overlayCTX = this.overlayContext
    this.canvasService.overlayCanvas = this.overlayCanvas
    this.canvasService.overlayCTX.scale(1, 1)

    // Fog
    this.fogContext = this.fogCanvas.nativeElement.getContext('2d');
    this.fogContext.canvas.height = this.gridService.height * 50
    this.fogContext.canvas.width = this.gridService.width * 50
    this.canvasService.fogCTX = this.fogContext
    this.canvasService.fogCanvas = this.fogCanvas
    this.canvasService.fogCTX.scale(1, 1)
        
  }

  @HostListener("document:keydown", ["$event"]) 
  public onKeyDown(event: KeyboardEvent): void {
    if(this.assetService.selectedGameComponent) {
      this.assetService.selectedGameComponent.setDirection(event)
    }

    if(event.key === "Control") {
      this.controlPressed = true
    }
  }

  @HostListener("document:keyup", ["$event"]) 
  public onKeyUp(event: KeyboardEvent): void {
    if(event.key === "Control") {
      this.controlPressed = false
    }
  }

  public onCanvasClick(event: any):void {
    // console.log(`click:${event.offsetX}`)
    this.mouseIsDown = true
     const clickX = event.offsetX
     const clickY = event.offsetY
     this.gridClick.emit({clickX, clickY})
  }

  public onMouseMove(event: any):void {
    if(this.mouseIsDown && this.controlPressed) {
      
      const cellStart = this.gridService.getGridCellByCoordinate(event.offsetX, event.offsetY)   
      if(!cellStart.obstacle) {
        const yrnd = Math.floor(Math.random() * 3) 
        const xrnd = Math.floor(Math.random() * 3)
        cellStart.imgIndexX = xrnd * 50
        cellStart.imgIndexY = yrnd * 80
        this.assetService.addObstacleImage(cellStart, `../../../assets/images/SPIKE-WALL-ALL2.png`)
      }
    }
  }

  public onMouseUp(event: any):void {
    // console.log(`up:${event.offsetX}`)
    this.mouseIsDown = false
  }
}
