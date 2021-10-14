import { ThisReceiver } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { CanvasService } from "../canvas/canvas.service";
import { EditorService } from "../editor/editor-pallete/editor.service";
import { DrawService } from "../game-engine/draw-tools/draw.service";
import { Engine } from "../game-engine/engine";
import { ShortestPath } from "../game-engine/shortest-path";
import { GridService } from "../game-engine/grid.service";
import { MotionAsset } from "../models/assets.model";
import { Cell, DrawableTiles, SpriteBackgroundTile, SpriteTile, TileAttachment } from "../models/cell.model";
import { Character } from "./character";
import { ClickAnimation } from "./click-animation";
import { getBackgroundCollection, growableItems, TerrainType } from "./tiles.db.ts/tile-assets.db";

@Injectable()
export class AssetsService {
  public gameComponents: MotionAsset[] = []
  public selectedGameComponent: MotionAsset
  public obstacles: string[] = []

  constructor(
    private drawService: DrawService,
    private canvas: CanvasService,
    private shortestPath: ShortestPath,
    private gridService: GridService,
    private engine: Engine,
  ) {

  }

  public addInvertedMapAsset(selectedCell: Cell): void {
    selectedCell.growableTileId = undefined
    selectedCell.obstacle = false
    selectedCell.imageTile = undefined

    for (let i = 0; i < 8; i++) {
      if (selectedCell.neighbors[i]) {
        selectedCell.neighbors[i].growableTileId = undefined
        selectedCell.neighbors[i].imageTile = undefined
        selectedCell.neighbors[i].obstacle = false
      }
    }

    // TODO: We need to remove obstacles rather than add them here
    // this.obstacles.push(selectedCell.id)
  }

  public addMapAsset(selectedCell: Cell, selectedAsset: SpriteTile, drawableItem?: DrawableTiles): void {
    if (!selectedCell) { return }

    selectedCell.imageTile = selectedAsset
    selectedCell.obstacle = true
    selectedCell.visible = true

    if (!selectedAsset) {
      this.addRequiredNeighborTiles(selectedCell, drawableItem)
    }

    if(selectedAsset && selectedCell.imageTile.id) {
      selectedCell.growableTileOverride = true
    } else {
      selectedCell.growableTileOverride = false
    }

    this.obstacles.push(selectedCell.id)
  }

  public addCharacter(imgUrl?: string): void {
    const gridCell1 = this.gridService.grid[`x2:y2`]
    const player = new Character(imgUrl, this.canvas, this.drawService, gridCell1, this.gridService, this.shortestPath, this.engine)
    gridCell1.occupiedBy = player  // <--- adding the character into the occupiedBy Spot

    player.animationFrame = [20, 40, 60] // set to 10 for walking speed


    this.engine.startAnimationTrigger(player)

    this.gameComponents.push(player)

    this.drawService.clearFogLineOfSight(gridCell1)
    // this.drawService.drawOnlyVisibleObstacle(gridCell1.id)
  }

  private addRequiredNeighborTiles(selectedCell: Cell, drawableItem: DrawableTiles): void {
   
    if (drawableItem.terrainType === TerrainType.Background) {
      selectedCell.backgroundGrowableTileId = drawableItem.id + drawableItem.layers

      if (selectedCell.neighbors[0]) {
        selectedCell.neighbors[0].backgroundGrowableTileId = drawableItem.id +  drawableItem.layers
      }
      if (selectedCell.neighbors[1]) {
        selectedCell.neighbors[1].backgroundGrowableTileId = drawableItem.id + drawableItem.layers
      }
      if (selectedCell.neighbors[4]) {
        selectedCell.neighbors[4].backgroundGrowableTileId = drawableItem.id +  drawableItem.layers
      }
    } else if (drawableItem.terrainType === TerrainType.Block) {

      if (selectedCell.neighbors[0]) {
        selectedCell.neighbors[0].growableTileId = drawableItem.id + drawableItem.layers
        selectedCell.neighbors[0].visible = true
      }
      if (selectedCell.neighbors[1]) {
        selectedCell.neighbors[1].growableTileId = drawableItem.id + drawableItem.layers
        selectedCell.neighbors[1].visible = true
      }
      if (selectedCell.neighbors[4]) {
        selectedCell.neighbors[4].growableTileId = drawableItem.id + drawableItem.layers
        selectedCell.neighbors[4].visible = true
      }

      selectedCell.growableTileId = drawableItem.id + drawableItem.layers
      selectedCell.visible = true
    }
  }
}


