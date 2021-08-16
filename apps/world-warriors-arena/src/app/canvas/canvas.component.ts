import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { CanvasService } from './canvas.service';

@Component({
  selector: 'world-warriors-arena-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent  {
  @ViewChild('myCanvas') myCanvas: ElementRef<HTMLCanvasElement>;
  @Input() height: number = 500
  @Input() width: number = 500

  public context: CanvasRenderingContext2D;

  constructor(private canvasService: CanvasService) {}

  public ngAfterViewInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d');
    this.context.canvas.height = this.height
    this.context.canvas.width = this.width
    this.canvasService.ctx = this.context
    this.canvasService.canvas = this.myCanvas
  }
}
