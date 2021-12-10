import { GSM } from "../app.service.manager";
import { GameSettings } from "../models/game-settings";
import { DragAssetEventHandler } from "../services/game-event-handlers/drag-asset.handler";
import { GMHoverAssetEventHandler } from "../services/game-event-handlers/gm-hover-asset.handler";
import { Painter } from "./painter";

export class MovingAssetPainter extends Painter {

  constructor() {
    super()
    super.start()
  }

  // Draws Grid Lines  
  public paint(): void {
    const eventState = GSM.PlayerEvent.getEvent("DragAssetEventHandler") as DragAssetEventHandler
    if(!eventState?.draggingAsset) { return }
    console.log(eventState?.id)

    const hoveringCell = GSM.Map.activeMap.getGridCellByCoordinate(GSM.PlayerEvent.hoverDetails.mouseX, GSM.PlayerEvent.hoverDetails.mouseY)

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

