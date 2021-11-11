import { Injectable } from "@angular/core";
import { MotionAsset } from "../models/assets.model";
import { Cell, DrawableTiles, SpriteTile } from "../models/cell.model";
import { TerrainType } from "./tiles.db.ts/tile-assets.db";

@Injectable()
export class AssetsService {
  public gameComponents: MotionAsset[] = []
  public selectedGameComponent: MotionAsset
  public obstacles: string[] = []

  public obstaclesDirty: boolean = false

  constructor() { }

  public removeGameComponent(): void {
    this.gameComponents = this.gameComponents.filter(asset => asset != this.selectedGameComponent)
    this.selectedGameComponent.cell.occupiedBy = undefined
    this.selectedGameComponent = undefined
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

  public selectDeselectAsset(selectedCell: Cell): void {
    this.gameComponents.forEach(asset => asset.selectionIndicator = undefined)
    
    if (selectedCell.occupiedBy && this.selectedGameComponent !== selectedCell.occupiedBy) {
      this.selectedGameComponent = selectedCell.occupiedBy
      this.selectedGameComponent.addSelectionIndicator()
    } else {
      this.selectedGameComponent = undefined
    }
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


