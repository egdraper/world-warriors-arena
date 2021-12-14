import { GSM } from "../../app.service.manager"
import { GameEventHandler } from "./base.handler"

export class DragSelectedAssetEventHandler extends GameEventHandler {
  public id = "DragSelectedAssetEventHandler"
  public assetImage: HTMLImageElement
  public draggingAsset = false

  public ctrlPressed = true
  public and() { return !!GSM.CharacterEditor.selectedCharacterImageUrl } 

  public startEventProcess(): void {
    this.draggingAsset = true
    this.assetImage = GSM.CharacterEditor.selectedCharacterImageUrl
    this.cursor.style = "grab"
  }
  
  public endEvent(): void {
    this.draggingAsset = false
    GSM.CharacterEditor.selectedCharacterImageUrl = undefined
    this.cursor.style = "auto"
  }
}
