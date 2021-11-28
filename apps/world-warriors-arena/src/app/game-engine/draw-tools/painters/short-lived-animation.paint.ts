import { CanvasService } from "../../../canvas/canvas.service"
import { EditorService } from "../../../editor/editor-palette/editor.service"
import { ShortLivedAnimation } from "../../../game-assets/click-animation"
import { GameSettings } from "../../../models/game-settings"
import { GridService } from "../../grid.service"
import { Painter } from "./painter"

export class ShortLivedAnimationPainter extends Painter {
  public animations: ShortLivedAnimation[] = []
  constructor(
    public canvasService: CanvasService,
    public gridService: GridService,
  ) { super() }
 
  public paint(): void {
    this.animations.forEach(animation => {
      this.canvasService.overlayCTX.clearRect(0, 0, this.gridService.activeGrid.width * 32 * GameSettings.scale, this.gridService.activeGrid.height * 32 * GameSettings.scale);

      if (!animation.cell) { return }
      this.canvasService.foregroundCTX.imageSmoothingEnabled = false
      this.canvasService.backgroundCTX.imageSmoothingEnabled = false
      this.canvasService.overlayCTX.imageSmoothingEnabled = false
      this.canvasService.overlayCTX.clearRect(animation.cell.posX, animation.cell.posY, 32, 32);

      this.canvasService.overlayCTX.drawImage(
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