import { Injectable } from "@angular/core";
import { CanvasService } from "../canvas/canvas.service";
import { DrawService } from "../engine/draw.service";
import { Asset } from "../models/assets.model";
import { Cell } from "../models/cell.model";

export class Character extends Asset {
  public frameCounter = 0
  public frameXPosition = [0, 26, 52, 26]
  public image = new Image()
  
  constructor(
    public canvasService: CanvasService,
    public drawService: DrawService,
    public cell: Cell
    ) {
      super();
      const rndInt = Math.floor(Math.random() * 5) + 1
      this.image.src = `../../../assets/images/character_00${rndInt}.png`
      this.image.onload = () => {
      canvasService.foregroundCTX.imageSmoothingEnabled = false
    }
  }
 
  public update() {    
    if (this.frameCounter < 3) {
      this.frameCounter++
    } else {
      this.frameCounter = 0
    }
  }
}
