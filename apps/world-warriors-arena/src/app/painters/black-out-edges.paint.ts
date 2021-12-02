import { GSM } from "../app.service.manager";
import { Painter } from "./painter";


export class BlackOutEdgesPainter extends Painter {
  // Draws Grid Lines  
  public paint(): void {
    if (!GSM.Map.activeGrid) { return }
    if (!GSM.Map.activeGrid.gridLoaded) { return }

    if (GSM.Canvas.blackoutCTX) {
      GSM.Canvas.blackoutCTX.fillStyle = 'black';
      GSM.Canvas.blackoutCTX.fillRect(
        0,
        0,
        32,
        GSM.Map.activeGrid.width * 32,
      )
    }

    if (GSM.Canvas.blackoutCTX) {
      GSM.Canvas.blackoutCTX.fillStyle = 'black';
      GSM.Canvas.blackoutCTX.fillRect(
        0,
        GSM.Map.activeGrid.height * 32 - 64,
        GSM.Map.activeGrid.width * 32,
        64,
      )

    }
  }

}