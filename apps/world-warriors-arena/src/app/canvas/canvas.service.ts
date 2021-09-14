import { ThisReceiver } from "@angular/compiler";
import { CONTEXT_NAME } from "@angular/compiler/src/render3/view/util";
import { ElementRef, Injectable } from "@angular/core";
import { RouterLinkWithHref } from "@angular/router";
import { DrawService } from "../engine/draw.service";
import { GridService } from "../grid/grid.service";

@Injectable()
export class CanvasService {
  private image = new Image()
  
  public overlayCanvas: ElementRef<HTMLCanvasElement>;
  public overlayCTX: CanvasRenderingContext2D;
  
  public foregroundCanvas: ElementRef<HTMLCanvasElement>;
  public foregroundCTX: CanvasRenderingContext2D;
   
  public backgroundCanvas: ElementRef<HTMLCanvasElement>;
  public backgroundCTX: CanvasRenderingContext2D;
  
  public fogCanvas: ElementRef<HTMLCanvasElement>;
  public fogCTX: CanvasRenderingContext2D;

  public blackoutCanvas: ElementRef<HTMLCanvasElement>;
  public blackoutCTX: CanvasRenderingContext2D;

  constructor(
    private gridService: GridService,
    ) {
    this.image.src = `../../../assets/images/StoneFloor1.png`
    this.image.onload = () => {
      this.drawGrid()
      // this.drawService.drawBackground$.subscribe(this.drawGrid.bind(this))
    }
  }

  public drawGrid(): void {
    for (let h = 0; h < this.gridService.height; h++) {
      for (let w = 0; w < this.gridService.width; w++) {
        const xrnd = Math.floor(Math.random() * 3)


        this.backgroundCTX.imageSmoothingEnabled = false
        this.backgroundCTX.drawImage(this.image, xrnd * 25, 0, 50, 50, h * 50, w * 50, 50 * 2, 50 * 2)
      }
    }

    for (let h = 0; h <= this.gridService.height; h++) {
      for (let w = 0; w <= this.gridService.width; w++) {
        this.backgroundCTX.beginPath()
        this.backgroundCTX.moveTo(w * 50, h * 50)
        this.backgroundCTX.lineTo(w * 50, (h * 50) + 50)
        this.backgroundCTX.lineWidth = 1;
        this.backgroundCTX.strokeStyle = "rgba(255, 255 ,255,.5)"
        this.backgroundCTX.stroke()


        this.backgroundCTX.beginPath()
        this.backgroundCTX.moveTo(w * 50, h * 50)
        this.backgroundCTX.lineTo((w * 50) + 50, h * 50)
        this.backgroundCTX.strokeStyle = "rgba(255,255,0,.5)"
        this.backgroundCTX.lineWidth = 1;
        this.backgroundCTX.stroke()
      }
    }
  }
}