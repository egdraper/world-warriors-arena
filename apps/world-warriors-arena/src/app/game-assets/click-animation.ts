import { Injectable } from "@angular/core";
import { CanvasService } from "../canvas/canvas.service";
import { DrawService } from "../engine/draw.service";
import { Engine } from "../engine/engine";
import { Asset } from "../models/assets.model";
import { Cell } from "../models/cell.model";

export class clickAnimation extends Asset {
  public image = new Image()
  constructor(
    public canvasService: CanvasService,
    public drawService: DrawService,
    public engineService: Engine,
    public cell: Cell,
    ) {
      super();
      this.image.src = `../../../assets/images/ExplosionClick1.png`
  }

  public frameXCounter = 0
  public frameYCounter = 0
  public frameXPosition = [0, 25, 50]
  public frameYPosition = [0, 25, 50]
 
  public update() {
    this.canvasService.overlayCTX.clearRect(0, 0, 1500, 1500);
    this.canvasService.overlayCTX.drawImage(
      this.image,
      this.frameXPosition[this.frameXCounter],
      this.frameYPosition[this.frameYCounter], 
      25,
      25,
      this.cell.posX,
      this.cell.posY,
      25 * 2,
      25 * 2
    )
  
    if(this.frameXCounter === 2 && this.frameYCounter === 2) {
      this.engineService.stopAnimation(this)
    }

    if (this.frameXCounter < 2) {
      this.frameXCounter++
    } else {
      this.frameXCounter = 0
      this.frameYCounter++
    }    
  }
}
