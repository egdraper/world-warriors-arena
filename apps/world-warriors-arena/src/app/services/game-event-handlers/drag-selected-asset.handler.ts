import { GSM } from "../../app.service.manager"
import { MotionAsset } from "../../models/assets.model"
import { GameEventHandler } from "./base.handler"

export class DragSelectedAssetEventHandler extends GameEventHandler {
  public id = "DragSelectedAssetEventHandler"
  public asset: MotionAsset
  public draggingAsset = false

  public ctrlPressed = true
  public and() { return !!GSM.CharacterEditor.selectedCharacter } 

  public startEventProcess(): void {
    this.draggingAsset = true
    this.asset = GSM.CharacterEditor.selectedCharacter
    this.cursor.style = "grab"
  }
  
  public endEvent(): void {
    this.draggingAsset = false
    GSM.CharacterEditor.selectedCharacter = undefined
    this.cursor.style = "auto"
  }
}
