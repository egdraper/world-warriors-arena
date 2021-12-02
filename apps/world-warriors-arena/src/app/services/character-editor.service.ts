import { Injectable } from "@angular/core"
import { GSM } from "../app.service.manager"
import { Character } from "../models/character"
import { MotionAsset } from "../models/assets.model"
import { Cell } from "../models/cell.model"

@Injectable()
export class CharacterEditorService {
  public selectedCharacterUrl: HTMLImageElement
  public selectedCharacter: MotionAsset

  public addCharacter(cell: Cell, gridId: string): void {
    this.selectedCharacter.gridId = gridId
    this.selectedCharacter.cell = cell

    const selectedCharacter = 
      new Character(this.selectedCharacter.image.src, this.selectedCharacter.cell)

    selectedCharacter.animationFrame = [20, 40, 60] // set to 10 for walking speed
    GSM.Engine.startAnimationTrigger(selectedCharacter)    
    GSM.Assets.gameComponents.push(selectedCharacter)
  }
}