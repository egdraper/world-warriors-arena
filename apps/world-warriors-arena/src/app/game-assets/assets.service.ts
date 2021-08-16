import { Injectable } from "@angular/core";
import { CanvasService } from "../canvas/canvas.service";
import { Engine } from "../engine/engine";
import { Asset } from "../models/assets.model";
import { Character } from "./character";

@Injectable()
export class AssetsService {
  public gameComponents: Asset[] = []

  constructor(
    private canvas: CanvasService,
    private engine: Engine) { }

  public addCharacter(imgUrl?: string): void {
    const player = new Character(this.canvas)
    player.animationFrame = [20, 40, 60]

    this.engine.startAnimationTrigger(player)

    this.gameComponents.push(player)
  }
}


