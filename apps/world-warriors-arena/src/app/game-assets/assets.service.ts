import { Injectable } from "@angular/core";
import { CanvasService } from "../canvas/canvas.service";
import { DrawService } from "../engine/draw.service";
import { Engine } from "../engine/engine";
import { GridService } from "../grid/grid.service";
import { Asset } from "../models/assets.model";
import { Cell } from "../models/cell.model";
import { Character } from "./character";
import { clickAnimation } from "./click-animation";

@Injectable()
export class AssetsService {
  public gameComponents: Asset[] = []

  constructor(
    private drawService: DrawService,
    private canvas: CanvasService,
    private gridService: GridService,
    private engine: Engine) {

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
    const gridCell2 = this.gridService.grid[`x0:y2`]
    const gridCell3 = this.gridService.grid[`x3:y0`]
    const player = new Character(this.canvas, this.drawService, gridCell1, this.gridService)
    const player1 = new Character(this.canvas, this.drawService, gridCell2, this.gridService)
    const player2= new Character(this.canvas, this.drawService, gridCell3, this.gridService)

    gridCell1.occupiedBy = player  // <--- adding the character into the occupiedBy Spot
    gridCell2.occupiedBy = player1  // <--- adding the character into the occupiedBy Spot
    gridCell3.occupiedBy = player2  // <--- adding the character into the occupiedBy Spot

    player.animationFrame = 10
    player1.animationFrame = 10
    player2.animationFrame = 10

    this.engine.startAnimationTrigger(player)
    this.engine.startAnimationTrigger(player1)
    this.engine.startAnimationTrigger(player2)
    this.gameComponents.push(player)
    this.gameComponents.push(player1)
    this.gameComponents.push(player2)
  }

  public addClickAnimation(cell: Cell): void {
    const animation = new clickAnimation(this.canvas, this.drawService, this.engine, cell)
    animation.animationFrame = 2

    this.engine.startAnimationTrigger(animation)
    
    this.gameComponents.push(animation)
  }
}


