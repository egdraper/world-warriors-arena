import { Injectable } from "@angular/core";
import { CanvasService } from "../canvas/canvas.service";
import { DrawService } from "../engine/draw.service";
import { Engine } from "../engine/engine";
import { ShortestPath } from "../engine/shortest-path";
import { GridService } from "../grid/grid.service";
import { MotionAsset } from "../models/assets.model";
import { Cell } from "../models/cell.model";

export class Character extends MotionAsset {
  public frameCounter = 0
  public frameXPosition = [0, 26, 52, 26]
  public image = new Image()

  constructor(
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
    const rndInt = Math.floor(Math.random() * 40) + 1
    if(rndInt < 10) {
    this.image.src = `../../../assets/images/character_00${rndInt}.png`
    } else {
      this.image.src = `../../../assets/images/character_0${rndInt}.png`
    }

    this.image.onload = () => {
      this.canvasService.foregroundCTX.imageSmoothingEnabled = false
    }
  }
}

