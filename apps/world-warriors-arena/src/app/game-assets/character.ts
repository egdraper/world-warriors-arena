import { Injectable } from "@angular/core";
import { CanvasService } from "../canvas/canvas.service";
import { DrawService } from "../game-engine/draw-tools/draw.service";
import { Engine } from "../game-engine/engine";
import { ShortestPath } from "../game-engine/shortest-path";
import { GridService } from "../game-engine/grid.service";
import { MotionAsset } from "../models/assets.model";
import { Cell } from "../models/cell.model";

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
  ) {
    super(grid, shortestPath, engine, drawService, canvasService);
    
    // sets the starting cell location
    this.positionX = cell.posX
    this.positionY = cell.posY

    // temp: Randomly chooses character sprites
    this.image.src = imageUrl

    this.image.onload = () => {
      this.canvasService.foregroundCTX.imageSmoothingEnabled = false
    }
  }
}

