
import { GSM } from "../app.service.manager";
import { Engine } from "../services/engine.service";
import { Painter } from "./painter";


export class GameMarkerPainter extends Painter {
  constructor(
  ) {
    super()
    Engine.onFire.subscribe(this.paint.bind(this))
  }

  // Draws Grid Lines  
  public paint(): void {
    if (GSM.Map.activeMap) {
      GSM.GameMarker.markerIcons.forEach(icon => {
        if(GSM.Map.activeMap.id !== icon.mapId) { return }
       
        GSM.Canvas.foregroundCTX.drawImage(
          icon.image,
          icon.hovering ? icon.hoverSpritePosX : icon.spritePosX,
          icon.hovering ? icon.hoverSpritePosY : icon.spritePosY,
          icon.width,
          icon.height,
          icon.displayPosX,
          icon.displayPosY,
          icon.width,
          icon.width
        )
      })
    }
  }

}