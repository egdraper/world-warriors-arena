import { Injectable } from "@angular/core";
import { CanvasService } from "../canvas/canvas.service";
import { DrawService } from "../engine/draw.service";
import { Engine } from "../engine/engine";
import { Asset } from "../models/assets.model";
import { Character } from "./character";

@Injectable()
export class AssetsService {
  public gameComponents: Asset[] = []
  public image = new Image()

  constructor(
    private drawService: DrawService,
    private canvas: CanvasService,
    private engine: Engine) {
      this.image.src = `../../../assets/images/character_001.png`
     }

  public addCharacter(imgUrl?: string): void {
    const player = new Character(this.canvas, this.drawService, this.image)
    player.animationFrame = [20, 40, 60]

    this.engine.startAnimationTrigger(player)

    this.gameComponents.push(player)
  }
}


