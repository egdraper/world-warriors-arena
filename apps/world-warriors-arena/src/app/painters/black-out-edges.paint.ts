import { GSM } from "../app.service.manager";
import { Painter } from "./painter";


export class BlackOutEdgesPainter extends Painter {
  // Draws Grid Lines  
  public paint(): void {
    if (!GSM.Map.activeMap) { return }
    if (!GSM.Map.activeMap.gridLoaded) { return }

    if (GSM.Canvas.blackoutCTX) {
      GSM.Canvas.blackoutCTX.fillStyle = 'black';
      GSM.Canvas.blackoutCTX.fillRect(
        0,
        0,
        32,
        GSM.Map.activeMap.width * 32,
      )
    }

    if (GSM.Canvas.blackoutCTX) {
      GSM.Canvas.blackoutCTX.fillStyle = 'black';
      GSM.Canvas.blackoutCTX.fillRect(
        0,
        GSM.Map.activeMap.height * 32 - 64,
        GSM.Map.activeMap.width * 32,
        64,
      )

    }
  }

}