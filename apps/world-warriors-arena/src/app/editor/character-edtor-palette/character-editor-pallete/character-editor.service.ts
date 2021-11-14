import { Injectable } from "@angular/core"
import { AssetsService } from "../../../game-assets/assets.service"
import { Character } from "../../../game-assets/character"
import { Engine } from "../../../game-engine/engine"
import { GridService } from "../../../game-engine/grid.service"
import { MotionAsset } from "../../../models/assets.model"
import { Cell } from "../../../models/cell.model"

@Injectable()
export class CharacterEditorService {
  public selectedCharacterUrl: HTMLImageElement
  public selectedCharacter: MotionAsset

  constructor(
    private assetService: AssetsService
  ) {}

  public addCharacter(cell: Cell, gridId: string, engine: Engine): void {
    this.selectedCharacter.gridId = gridId
    this.selectedCharacter.cell = cell

    const selectedCharacter = 
      new Character(
        this.selectedCharacter.image.src,
        this.selectedCharacter.canvasService,
        this.selectedCharacter.drawService,
        this.selectedCharacter.cell,
        this.selectedCharacter.grid, 
        this.selectedCharacter.shortestPath,
        this.selectedCharacter.engineService,
        this.assetService)

    selectedCharacter.animationFrame = [20, 40, 60] // set to 10 for walking speed
    engine.startAnimationTrigger(selectedCharacter)    
    this.assetService.gameComponents.push(selectedCharacter)    
    // this.drawService.clearFogLineOfSight(gridCell1)

  }
}