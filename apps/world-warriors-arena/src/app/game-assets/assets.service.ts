import { Injectable } from "@angular/core";
import { CanvasService } from "../canvas/canvas.service";
import { DrawService } from "../engine/draw.service";
import { Engine } from "../engine/engine";
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
    private engine: Engine) {

     }

  public addCharacter(imgUrl?: string): void {
    const player = new Character(this.canvas, this.drawService)
    player.animationFrame = [20, 40, 60]

    this.engine.startAnimationTrigger(player)

    this.gameComponents.push(player)
  }

  public addClickAnimation(cell: Cell): void {
    const animation = new clickAnimation(this.canvas, this.drawService, this.engine, cell)
    animation.animationFrame = 2

    this.engine.startAnimationTrigger(animation)
    
    this.gameComponents.push(animation)
  }
}


