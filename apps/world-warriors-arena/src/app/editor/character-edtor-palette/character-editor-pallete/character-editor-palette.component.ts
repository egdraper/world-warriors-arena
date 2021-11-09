import { Component, OnInit } from '@angular/core';
import { CanvasService } from '../../../canvas/canvas.service';
import { AssetsService } from '../../../game-assets/assets.service';
import { Character } from '../../../game-assets/character';
import { DrawService } from '../../../game-engine/draw-tools/draw.service';
import { Engine } from '../../../game-engine/engine';
import { GridService } from '../../../game-engine/grid.service';
import { ShortestPath } from '../../../game-engine/shortest-path';

@Component({
  selector: 'world-warriors-arena-character-editor-palette',
  templateUrl: './character-editor-palette.component.html',
  styleUrls: ['./character-editor-palette.component.scss']
})
export class CharacterEditorPaletteComponent implements OnInit {
  public characterImages: HTMLImageElement[] = []
  constructor(
    private assetService: AssetsService,
    private gridService: GridService,
    private shortestPath: ShortestPath,
    private engine: Engine,
    private drawService: DrawService,
    private canvas: CanvasService
  ) { }

  public ngOnInit(): void {
    // TODO: Automatically add images
    for (let i = 1; i < 40; i++) {
      const img = new Image()
      img.src = i > 9 ? `assets/images/character_0${i}.png` : `assets/images/character_00${i}.png`
      this.characterImages.push(img)
    }
  }

  public tileClick(image: HTMLImageElement): void {
    const gridCell1 = this.gridService.getGridCellByCoordinate(this.canvas.centerPointX, this.canvas.centerPointY)
    const player = new Character(image.src, this.canvas, this.drawService, gridCell1, this.gridService, this.shortestPath, this.engine)
    gridCell1.occupiedBy = player  // <--- adding the character into the occupiedBy Spot

    player.animationFrame = [20, 40, 60] // set to 10 for walking speed


    this.engine.startAnimationTrigger(player)

    this.assetService.gameComponents.push(player)

    this.drawService.clearFogLineOfSight(gridCell1)
  }


}
