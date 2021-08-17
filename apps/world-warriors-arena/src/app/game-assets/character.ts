import { Injectable } from "@angular/core";
import { CanvasService } from "../canvas/canvas.service";
import { Asset } from "../models/assets.model";

export class Character extends Asset {
  constructor(
    public canvasService: CanvasService,
    public image = new Image()
  ) {
    super();
    const rndInt = Math.floor(Math.random() * 2) + 1

    image.src = `../../../assets/images/character_00${rndInt}.png`
    image.onload = function () {
      canvasService.ctx.imageSmoothingEnabled = false
      canvasService.ctx.drawImage(image, 26, 0, 26, 36, 0, 0, 26 * 2, 36 * 2)
    }
  }

  public frameCounter = 0
  public frameXPosition = [0, 26, 52, 26]
  public update() {
    this.canvasService.ctx.drawImage(this.image, this.frameXPosition[this.frameCounter], 0, 26, 36, 0, 0, 26 * 2, 36 * 2)
    if (this.frameCounter < 3) {
      this.frameCounter++
    } else {
      this.frameCounter = 0
    }
  }
}