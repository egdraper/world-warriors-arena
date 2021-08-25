import { Injectable } from "@angular/core";
import { removeFromArray } from "../common/functions";
import { GameComponent } from "../models/assets.model";
import { DrawService } from "./draw.service";

@Injectable()
export class Engine {
  public assets: GameComponent[] = []
  public frame: number = 1

  constructor(private drawService: DrawService) { }

  public startAnimationTrigger(gameComponent: GameComponent) {
    this.assets.push(gameComponent)
  }

  public stopAnimation(gameComponent: GameComponent) {
    this.assets = removeFromArray(this.assets, (asset) => asset.id === gameComponent.id)
  }

  public startEngine(): any {
    this.assets.forEach(asset => {
      // runs the update function for sprite position updates.
      if(Array.isArray(asset.animationFrame)){
        // handles specific frames for uneven animation. example [3, 10, 15, 16, 17]
        if (asset.animationFrame.find(_frame => _frame === this.frame)) {
          asset.update()
        }
      } else {
        // handles even frame animation. Example "5", which represents every 5 frames the update function are ran
        if(this.frame % asset.animationFrame === 0) {
          asset.update()
        }
      }

      // asset motion frame, for moving from cell to cell
      if(this.frame % 1 === 0) {
        asset.move()
      }
    })
  
    this.drawService.drawAnimatedAssets()
    requestAnimationFrame(this.startEngine.bind(this)); 
    console.log(this.frame)
    this.frame >= 60 ? this.frame = 1 : this.frame++
  }
}
