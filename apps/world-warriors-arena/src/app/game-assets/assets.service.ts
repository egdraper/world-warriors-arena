import { Injectable } from "@angular/core";
import { CanvasService } from "../canvas/canvas.service";
import { DrawService } from "../engine/draw.service";
import { Engine } from "../engine/engine";
import { ShortestPath } from "../engine/shortest-path";
import { GridService } from "../grid/grid.service";
import { MotionAsset } from "../models/assets.model";
import { Cell } from "../models/cell.model";
import { Character } from "./character";
import { ClickAnimation } from "./click-animation";

@Injectable()
export class AssetsService {
  public gameComponents: MotionAsset[] = []
  public selectedGameComponent: MotionAsset

  constructor(
    private drawService: DrawService,
    private canvas: CanvasService,
    private shortestPath: ShortestPath,
    private gridService: GridService,
    private engine: Engine) { }

  public addObstacleImage(cell: Cell, imageUrl: string): void {
    cell.image = new Image()
    cell.image.src = imageUrl
    cell.obstacle = true
    this.gridService.obstacles.push(cell.id)
  }   

  public addCharacter(imgUrl?: string): void {
    // const rndInt = Math.floor(Math.random() * 5) + 1
    // const rndInt2 = Math.floor(Math.random() * 5) + 1
    // const gridCell = this.gridService.grid[`x${rndInt}:y${rndInt2}`]
    // const player = new Character(this.canvas, this.drawService, gridCell, this.gridService)

    // gridCell.occupiedBy = player  // <--- adding the character into the occupiedBy Spot

    // player.animationFrame = 10

    // this.engine.startAnimationTrigger(player)

    // this.gameComponents.push(player)


    const gridCell1 = this.gridService.grid[`x2:y2`]

    const player = new Character(this.canvas, this.drawService, gridCell1, this.gridService, this.shortestPath, this.engine)


    gridCell1.occupiedBy = player  // <--- adding the character into the occupiedBy Spot

    player.animationFrame = [20, 40, 60 ] // set to 10 for walking speed


    this.engine.startAnimationTrigger(player)

    this.gameComponents.push(player)
    
    this.drawService.clearFogLineOfSight(gridCell1)
    this.drawService.drawOnlyVisibleObstacle(gridCell1.id)

  }

  public addClickAnimation(cell: Cell, imgSrc: string): void {
    const animation = new ClickAnimation(52, this.engine, imgSrc, cell)
    

  }
}


