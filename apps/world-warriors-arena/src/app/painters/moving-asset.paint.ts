import { GSM } from "../app.service.manager";
import { DragSelectedAssetEventHandler } from "../services/game-event-handlers/drag-selected-asset.handler";
import { Painter } from "./painter";

export class MovingAssetPainter extends Painter {

  constructor() {
    super()
    super.start()
  }

  // Draws Grid Lines  
  public paint(): void {
    let eventState = GSM.GameEvent.getEvent("DragAssetEventHandler") as DragSelectedAssetEventHandler

    if(!eventState.draggingAsset) { 
      eventState = GSM.GameEvent.getEvent("DragSelectedAssetEventHandler") as DragSelectedAssetEventHandler
    }

    if(!eventState?.draggingAsset) { return }
    const hoveringCell = GSM.Map.activeMap.getGridCellByCoordinate(GSM.GameEvent.mouseDetails.mouseX, GSM.GameEvent.mouseDetails.mouseY)
    GSM.Canvas.foregroundCTX.clearRect(0, 0, GSM.Map.activeMap.width * 32, GSM.Map.activeMap.height * 32);
    GSM.Canvas.foregroundCTX.drawImage(
      eventState.assetImage,
      26,
      0,
      25,
      36,
      hoveringCell.posX - 8,
      hoveringCell.posY - 58,
      50,
      80
    )
  }
}

