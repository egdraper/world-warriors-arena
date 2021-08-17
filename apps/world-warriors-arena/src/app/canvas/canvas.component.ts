import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

import { CanvasService } from './canvas.service';

@Component({
  selector: 'world-warriors-arena-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent  {
  @ViewChild('myCanvas') myCanvas: ElementRef<HTMLCanvasElement>;
  @Input() height: number = 10
  @Input() width: number = 10
  
  @Output() gridClick = new EventEmitter<{clickX: number, clickY: number}>()

  public context: CanvasRenderingContext2D;

  constructor(private canvasService: CanvasService) {}

  public ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d');
    this.context.canvas.height = this.height * 50
    this.context.canvas.width = this.width * 50
    this.canvasService.ctx = this.context
    this.canvasService.canvas = this.myCanvas
  }

  public onCanvasClick(event: any):void {
     const clickX = event.offsetX
     const clickY = event.offsetY
     this.gridClick.emit({clickX, clickY})
  }
}
