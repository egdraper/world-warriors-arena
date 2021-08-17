import { ThisReceiver } from "@angular/compiler";
import { CONTEXT_NAME } from "@angular/compiler/src/render3/view/util";
import { ElementRef, Injectable } from "@angular/core";
import { GridService } from "../grid/grid.service";

@Injectable()
export class CanvasService {
  constructor(private gridService: GridService) { }

  public canvas: ElementRef<HTMLCanvasElement>;
  public ctx: CanvasRenderingContext2D;

  public drawGrid(): void {
    const image = new Image()
    image.src = `../../../assets/images/grass1.png`
    image.onload = () => {
      for (let h = 0; h < this.gridService.height; h++) {
        for (let w = 0; w < this.gridService.width; w++) {
          const xrnd = Math.floor(Math.random() * 3)
          const yrnd = Math.floor(Math.random() * 3)

          this.ctx.imageSmoothingEnabled = false
          this.ctx.drawImage(image, xrnd * 25, yrnd * 25, 50, 50, h * 50, w * 50, 50, 50)
        }
      }

      for (let h = 0; h <= this.gridService.height; h++) {
        for (let w = 0; w <= this.gridService.width; w++) {
          this.ctx.beginPath()
          this.ctx.moveTo(w * 50, h * 50)
          this.ctx.lineTo(w * 50 , (h * 50) + 50)
          this.ctx.lineWidth = 1;
          this.ctx.strokeStyle = "rgba(0, 0 ,0,.5)"
          this.ctx.stroke()

    
          this.ctx.beginPath()
          this.ctx.moveTo(w * 50, h * 50)
          this.ctx.lineTo((w * 50) + 50, h * 50)
          this.ctx.strokeStyle = "rgba(0,0,0,.5)"
          this.ctx.lineWidth = 1;
          this.ctx.stroke()
        }
      }
    }
  }
}