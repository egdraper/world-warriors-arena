import { Injectable } from "@angular/core";
import { CanvasService } from "../canvas/canvas.service";
import { DrawService } from "../engine/draw.service";
import { Asset } from "../models/assets.model";

export class Character extends Asset {
  public image = new Image()
  constructor(
    public canvasService: CanvasService,
    public drawService: DrawService
    ) {
      super();
      const rndInt = Math.floor(Math.random() * 5) + 1
      this.image.src = `../../../assets/images/character_00${rndInt}.png`
    this.image.onload = () => {
      canvasService.forgroundCTX.imageSmoothingEnabled = false
      canvasService.forgroundCTX.drawImage(this.image, 26, 0, 26, 36, 0, 0, 26 * 2, 36 * 2)
    }
  }

  public frameCounter = 0
  public frameXPosition = [0, 26, 52, 26]
  public update() {
    this.canvasService.forgroundCTX.drawImage(this.image, this.frameXPosition[this.frameCounter], 0, 26, 36, 0, 0, 26 * 2, 36 * 2)
    if (this.frameCounter < 3) {
      this.frameCounter++
    } else {
      this.frameCounter = 0
    }
  }
}
