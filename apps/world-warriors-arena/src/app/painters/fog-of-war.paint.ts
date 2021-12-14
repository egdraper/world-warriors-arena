
import { GSM } from "../app.service.manager";
import { Cell } from "../models/cell.model";
import { DebugSettings } from "../models/game-settings";
import { Painter } from "./painter";

export class FogOfWarPainter extends Painter {
  // Draws Grid Lines  
  public paint(): void {
    this.drawFog()
    this.revealFog()
  }

  private drawFog(): void {
    if (!GSM.Canvas.fogCTX || !GSM.Map.activeMap) { return }
    GSM.Canvas.fogCTX.imageSmoothingEnabled = false
    GSM.Canvas.fogCTX.filter = "none";
    GSM.Canvas.fogCTX.globalCompositeOperation = 'destination-over'
    GSM.Canvas.fogCTX.clearRect(0, 0, GSM.Map.activeMap.width * 32, GSM.Map.activeMap.height * 32);
    GSM.Canvas.fogCTX.fillStyle = 'black';
    GSM.Canvas.fogCTX.globalAlpha = .8;
    GSM.Canvas.fogCTX.fillRect(
      0,
      0,
      GSM.Map.activeMap.width * 32,
      GSM.Map.activeMap.height * 32
    )
  }

  private revealFog(): void {
    if (GSM.Assets.selectedGameComponent) {
      // const centerCells = GSM.FogOfWar.fogOfWarRimPoints[GSM.Assets.selectedGameComponent.cell.id]
      const centerCells = GSM.FogOfWar.getSingleView(GSM.Assets.selectedGameComponent.cell)
      GSM.Canvas.fogCTX.globalCompositeOperation = 'destination-out'
      
      if(!DebugSettings.fogDebug && DebugSettings.fogFeather) {
        GSM.Canvas.fogCTX.filter = "blur(35px)";  // "feather"
      }

      this.clearOutVisibleArea(centerCells, GSM.Canvas.fogCTX)
    }
  }

  private clearOutVisibleArea(centerCells: Cell[], ctx: CanvasRenderingContext2D): void {
    if (centerCells.length === 0) {
      debugger
      return
    }
    ctx.beginPath()
    ctx.lineWidth = 1;
    try {
      ctx.moveTo(centerCells[0].fogPointX, centerCells[0].fogPointY)
    } catch {
      debugger
    }

    centerCells.forEach((cell: Cell, index: number) => {
      if (index != 0 && cell) {
        if (index % 1 === 0) {
          ctx.lineTo(cell.fogPointX, cell.fogPointY)
        }
      }
    })
    ctx.closePath();
    if (DebugSettings.fogDebug) {
      ctx.stroke();
      ctx.globalAlpha = .8;
      ctx.fill()
    } else {
      ctx.fill();
    }
    

    if (DebugSettings.fogDebug) {
      ctx.beginPath();
      ctx.fillRect(centerCells[0].fogPointX, centerCells[0].fogPointY, 5, 5)
      ctx.stroke();

      centerCells.forEach((cell: Cell, index: number) => {
        if (index != 0 && cell) {
          if (index % 1 === 0) {
            ctx.beginPath();
            ctx.fillRect(cell.fogPointX, cell.fogPointY, 5, 5)
            ctx.stroke();
          }
        }
      })
    }
  }
}