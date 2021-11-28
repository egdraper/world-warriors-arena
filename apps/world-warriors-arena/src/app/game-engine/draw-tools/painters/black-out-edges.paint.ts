import { CanvasService } from "../../../canvas/canvas.service"
import { GridService } from "../../grid.service"
import { Painter } from "./painter"

export class BlackOutEdgesPainter extends Painter {
  constructor(
    public canvasService: CanvasService,
    public gridService: GridService
  ) { super() }

  // Draws Grid Lines  
  public paint(): void {
    if (!this.gridService.activeGrid) { return }
    if (!this.gridService.activeGrid.gridLoaded) { return }

    if (this.canvasService.blackoutCTX) {
      this.canvasService.blackoutCTX.fillStyle = 'black';
      this.canvasService.blackoutCTX.fillRect(
        0,
        0,
        32,
        this.gridService.activeGrid.width * 32,
      )
    }

    if (this.canvasService.blackoutCTX) {
      this.canvasService.blackoutCTX.fillStyle = 'black';
      this.canvasService.blackoutCTX.fillRect(
        0,
        this.gridService.activeGrid.height * 32 - 64,
        this.gridService.activeGrid.width * 32,
        64,
      )

    }
  }

}