import { Injectable } from "@angular/core";
import { CanvasService } from "../canvas/canvas.service";
import { DrawService } from "../game-engine/draw-tools/draw.service";
import { Engine } from "../game-engine/engine";
import { ShortestPath } from "../game-engine/shortest-path";
import { GridService } from "../game-engine/grid.service";
import { MotionAsset } from "../models/assets.model";
import { Cell } from "../models/cell.model";
import { AssetsService } from "./assets.service";

export class Character extends MotionAsset {
  public frameCounter = 0
  public frameXPosition = [0, 26, 52, 26]
  public image = new Image()

  constructor(
    public imageUrl: string,
    public canvasService: CanvasService,
    public drawService: DrawService,
    public cell: Cell,
    public grid: GridService,
    public shortestPath: ShortestPath,
    public engine: Engine,
    public assetService: AssetsService
  ) {
    super(grid, shortestPath, engine, drawService, canvasService, assetService);
    
    // sets the starting cell location
    if(cell) {
      this.positionX = cell.posX
      this.positionY = cell.posY
    }

    // temp: Randomly chooses character sprites
    this.image.src = imageUrl

    this.image.onload = () => {
      this.canvasService.foregroundCTX.imageSmoothingEnabled = false
    }
  }
}

