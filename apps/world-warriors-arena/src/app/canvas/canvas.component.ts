import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { DrawService } from '../engine/draw.service';
import { GridService } from '../grid/grid.service';

import { CanvasService } from './canvas.service';

@Component({
  selector: 'world-warriors-arena-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent  {
  @ViewChild('forgroundCanvas') forgroundCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('backgroundCanvas') backgroundCanvas: ElementRef<HTMLCanvasElement>;
  @Output() gridClick = new EventEmitter<{clickX: number, clickY: number}>()

  public forgroundContext: CanvasRenderingContext2D;
  public backgroundContext: CanvasRenderingContext2D;

  constructor(
    private canvasService: CanvasService,
    private gridService: GridService,
  ) { }

  // this needs to be put in a public function so we can pass in grid information 
  public ngAfterViewInit(): void {
    // Forground
    this.forgroundContext = this.forgroundCanvas.nativeElement.getContext('2d');
    this.forgroundContext.canvas.height = this.gridService.height * 50
    this.forgroundContext.canvas.width = this.gridService.width * 50
    this.canvasService.forgroundCTX = this.forgroundContext
    this.canvasService.forgroundCanvas = this.forgroundCanvas
    
    // Background
    this.backgroundContext = this.backgroundCanvas.nativeElement.getContext('2d');
    this.backgroundContext.canvas.height = this.gridService.height * 50
    this.backgroundContext.canvas.width = this.gridService.width * 50
    this.canvasService.backgroundCTX = this.forgroundContext
    this.canvasService.backgroundCanvas = this.forgroundCanvas
    
    this.canvasService.forgroundCTX.scale(1, 1)
    this.canvasService.backgroundCTX.scale(1, 1)
  }

  public onCanvasClick(event: any):void {
     const clickX = event.offsetX
     const clickY = event.offsetY
     this.gridClick.emit({clickX, clickY})
  }
}
