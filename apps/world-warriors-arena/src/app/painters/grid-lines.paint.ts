import { GSM } from "../app.service.manager";
import { Painter } from "./painter";

export class GridLinePainter extends Painter {
  // Draws Grid Lines  
  public paint(): void {
    for (let h = 0; h <= GSM.Map.activeGrid.height; h++) {
      for (let w = 0; w <= GSM.Map.activeGrid.width; w++) {
        // Horizontal lines
        GSM.Canvas.backgroundCTX.beginPath()
        GSM.Canvas.backgroundCTX.moveTo(w * 32, h * 32)
        GSM.Canvas.backgroundCTX.lineTo(w * 32, (h * 32) + 32)
        GSM.Canvas.backgroundCTX.lineWidth = 1;
        GSM.Canvas.backgroundCTX.strokeStyle = "rgba(255, 255 ,255,.5)"
        GSM.Canvas.backgroundCTX.stroke()

        // Vertical Lines
        GSM.Canvas.backgroundCTX.beginPath()
        GSM.Canvas.backgroundCTX.moveTo(w * 32, h * 32)
        GSM.Canvas.backgroundCTX.lineTo((w * 32) + 32, h * 32)
        GSM.Canvas.backgroundCTX.strokeStyle = "rgba(255,255,0,.5)"
        GSM.Canvas.backgroundCTX.lineWidth = 1;
        GSM.Canvas.backgroundCTX.stroke()
      }
    }
  }
}

