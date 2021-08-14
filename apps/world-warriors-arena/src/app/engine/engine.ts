import { Injectable } from "@angular/core";
import { removeFromArray } from "../common/functions";
import { GameComponents } from "../models/assets.model";

@Injectable()
export class Engine {
  public assets: GameComponents[] = []
  public frame: number = 1

  public startAnimationTrigger(gameComponent: GameComponents) {
    this.assets.push(gameComponent)
  }

  public stopAnimation(gameComponent: GameComponents) {
    this.assets = removeFromArray(this.assets, (asset) => asset.id === gameComponent.id)
  }

  public startEngine(): any {
    this.assets.forEach(asset => {   
      if (asset.animationFrame.find(_frame => _frame === this.frame)) {
        asset.update()
      }
    })

    requestAnimationFrame(this.startEngine.bind(this));
    this.frame >= 60 ? this.frame = 1 : this.frame++
  }
}
