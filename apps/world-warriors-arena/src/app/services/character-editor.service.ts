import { Injectable } from "@angular/core"
import { GSM } from "../app.service.manager"
import { Character } from "../models/character"
import { MotionAsset } from "../models/assets.model"
import { Cell } from "../models/cell.model"

@Injectable()
export class CharacterEditorService {
  public selectedCharacterImageUrl: HTMLImageElement

  public addCharacter(cell: Cell, gridId: string): void {
    const selectedCharacter = new Character(this.selectedCharacterImageUrl, cell, gridId, [20,40,60])
    selectedCharacter.gridId = gridId

    GSM.Engine.startAnimationTrigger(selectedCharacter)    
    GSM.Assets.gameComponents.push(selectedCharacter)
  }
}