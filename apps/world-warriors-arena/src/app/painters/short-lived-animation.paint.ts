
import { GSM } from "../app.service.manager";
import { ShortLivedAnimation } from "../models/click-animation";
import { GameSettings } from "../models/game-settings";
import { Painter } from "./painter"

export class ShortLivedAnimationPainter extends Painter {
  public animations: ShortLivedAnimation[] = []
 
  public paint(): void {
    this.animations.forEach(animation => {
      GSM.Canvas.overlayCTX.clearRect(0, 0, GSM.Map.activeGrid.width * 32 * GameSettings.scale, GSM.Map.activeGrid.height * 32 * GameSettings.scale);

      if (!animation.cell) { return }
      GSM.Canvas.foregroundCTX.imageSmoothingEnabled = false
      GSM.Canvas.backgroundCTX.imageSmoothingEnabled = false
      GSM.Canvas.overlayCTX.imageSmoothingEnabled = false
      GSM.Canvas.overlayCTX.clearRect(animation.cell.posX, animation.cell.posY, 32, 32);

      GSM.Canvas.overlayCTX.drawImage(
        animation.image,
        animation.frameXPosition[animation.frameXCounter],
        animation.frameYPosition[animation.frameYCounter],
        25,
        25,
        animation.cell.posX,
        animation.cell.posY,
        32,
        32
      )
    })
  }
}