import { GSM } from "../app.service.manager";
import { GameSettings } from "../models/game-settings";
import { DragAssetEventHandler } from "../services/game-event-handlers/drag-asset.handler";
import { DragSelectedAssetEventHandler } from "../services/game-event-handlers/drag-selected-asset.handler";
import { GMHoverAssetEventHandler } from "../services/game-event-handlers/gm-hover-asset.handler";
import { Painter } from "./painter";

export class MovingAssetPainter extends Painter {

  constructor() {
    super()
    super.start()
  }

  // Draws Grid Lines  
  public paint(): void {
    let eventState = GSM.GameEvent.getEvent("DragAssetEventHandler") as DragSelectedAssetEventHandler

    // if(!eventState) { 
      eventState = GSM.GameEvent.getEvent("DragSelectedAssetEventHandler") as DragSelectedAssetEventHandler
    // }

    if(!eventState?.draggingAsset) { return }
    const hoveringCell = GSM.Map.activeMap.getGridCellByCoordinate(GSM.GameEvent.mouseDetails.mouseX, GSM.GameEvent.mouseDetails.mouseY)
    
    console.log(eventState.asset.id)
    GSM.Canvas.foregroundCTX.drawImage(
      eventState.asset.image,
      eventState.asset.frameXPosition[1],
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

