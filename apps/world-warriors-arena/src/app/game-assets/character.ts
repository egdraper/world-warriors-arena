import { Injectable } from "@angular/core";
import { CanvasService } from "../canvas/canvas.service";
import { DrawService } from "../engine/draw.service";
import { GridService } from "../grid/grid.service";
import { Asset, MotionAsset } from "../models/assets.model";
import { Cell } from "../models/cell.model";

export class Character extends MotionAsset {
  public frameCounter = 0
  public frameXPosition = [0, 26, 52, 26]
  public image = new Image()

  constructor(
    public canvasService: CanvasService,
    public drawService: DrawService,
    public cell: Cell,
    public grid: GridService
  ) {
    super(grid);
    
    // sets the starting cell location
    this.positionX = cell.posX
    this.positionY = cell.posY

    // temp: Randomly chooses character sprites
    const rndInt = Math.floor(Math.random() * 5) + 1
    this.image.src = `../../../assets/images/character_00${rndInt}.png`

    this.image.onload = () => {
      this.canvasService.foregroundCTX.imageSmoothingEnabled = false
    }
  }
}

