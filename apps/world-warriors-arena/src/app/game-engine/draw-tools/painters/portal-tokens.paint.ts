import { CanvasService } from "../../../canvas/canvas.service";
import { GameMarkersService } from "../../../game-assets/game-markers";
import { Engine } from "../../engine";
import { GridService } from "../../grid.service";
import { Painter } from "./painter";


export class GameMarkerPainter extends Painter {
  constructor(
    public canvasService: CanvasService,
    public gridService: GridService,
    public gameMarkers: GameMarkersService,
  ) {
    super()
    Engine.onFire.subscribe(this.paint.bind(this))
  }

  // Draws Grid Lines  
  public paint(): void {
    if (this.gridService.activeGrid) {
      this.gameMarkers.markerIcons.forEach(icon => {
        if(this.gridService.activeGrid.id !== icon.mapId) { return }
       
        this.canvasService.foregroundCTX.drawImage(
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