import { Injectable } from "@angular/core";

import { removeFromArray } from "../common/functions";
import { ShortLivedAnimation } from "../game-assets/click-animation";
import { AnimationComponent } from "../models/assets.model";
import { DrawService } from "./draw-tools/draw.service";

@Injectable()
export class Engine {
  public assets: AnimationComponent[] = []
  public shortLivedAnimations: ShortLivedAnimation[] = []
  public frame: number = 1

  constructor(private drawService: DrawService) { }

  public startShortLiveAnimation(animation: ShortLivedAnimation): void {
    this.shortLivedAnimations.push(animation)
  }

  public endShortLivedAnimation(animation: ShortLivedAnimation): void {
    this.shortLivedAnimations = removeFromArray(this.shortLivedAnimations, animation => animation.id === animation.id)
  }

  public startAnimationTrigger(animationComponent: AnimationComponent) {
    this.assets.push(animationComponent)
  }

  public stopAnimation(animationComponent: AnimationComponent) {
    this.assets = removeFromArray(this.assets, (asset) => asset.id === animationComponent.id)
  }

  public startEngine(): any {
    this.assets.forEach(asset => {
      // runs the update function for sprite position updates.
      if(Array.isArray(asset.animationFrame)){
        // handles specific frames for uneven animation. example [3, 10, 15, 16, 17]
        if (asset.animationFrame.find(_frame => _frame === this.frame)) {
          asset.update()
          this.drawService.drawAnimatedAssets()
        }
      } else {
        // handles even frame animation. Example "5", which represents every 5 frames the update function are ran
        if(this.frame % asset.animationFrame === 0) {
          asset.update()
          this.drawService.drawAnimatedAssets()
        }
      }

      // asset motion frame, for moving from cell to cell
      if(this.frame % 1 === 0) {
       if(asset.moving) { 
          this.drawService.drawAnimatedAssets()
          asset.move()
       }
      }
    })

    if(this.shortLivedAnimations.length > 0) {
      this.shortLivedAnimations.forEach(animation => {
        if (this.frame % animation.animationFrame === 0) { 
          animation.update() 
          this.drawService.drawShortLivedAnimation(animation)
        }
      })
    }
  
    this.drawService.drawObstacles()
    this.drawService.drawEditableObject()

    requestAnimationFrame(this.startEngine.bind(this)); 

    this.frame >= 60 ? this.frame = 1 : this.frame++
  }
}
