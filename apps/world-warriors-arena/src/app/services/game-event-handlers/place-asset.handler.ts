import { GSM } from "../../app.service.manager"
import { GameEventHandler } from "./base.handler"

export class PlaceAssetEventHandler extends GameEventHandler {
  public id = "PlaceAssetEventHandler"

  public mouseDown = true
  public and() { return !!GSM.CharacterEditor.selectedCharacterImageUrl } 

  public startEventProcess(): void {
    const selectedCell = GSM.Map.activeMap.getGridCellByCoordinate(this.mouseEventDetails.mouseX, this.mouseEventDetails.mouseY)
    GSM.CharacterEditor.addCharacter(selectedCell, GSM.Map.activeMap.id)
    this.cursor.style = "grab"
  }
  
  public endEvent(): void {
    this.cursor.style = "auto"
  }
}
