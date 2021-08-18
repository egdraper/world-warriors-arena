import { Injectable } from "@angular/core";
import { removeFromArray } from "../common/functions";
import { GameComponents } from "../models/assets.model";
import { DrawService } from "./draw.service";

@Injectable()
export class Engine {
  public assets: GameComponents[] = []
  public frame: number = 1

  constructor(private drawService: DrawService) { }

  public startAnimationTrigger(gameComponent: GameComponents) {
    this.assets.push(gameComponent)
  }

  public stopAnimation(gameComponent: GameComponents) {
    this.assets = removeFromArray(this.assets, (asset) => asset.id === gameComponent.id)
  }

  public startEngine(): any {
    this.assets.forEach(asset => {   
      if(Array.isArray(asset.animationFrame)){
        if (asset.animationFrame.find(_frame => _frame === this.frame)) {
          this.drawService.drawForground$.next()
          asset.update()
        }
      } else {
        if(this.frame % asset.animationFrame === 0) {
          asset.update()
          this.drawService.drawForground$.next()
        }
      }
    })
    requestAnimationFrame(this.startEngine.bind(this)); 
    this.frame >= 60 ? this.frame = 1 : this.frame++
  }
}
