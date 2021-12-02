import { Injectable } from "@angular/core";
import { TerrainType } from "../game-assets/tile-assets.db";
import { MotionAsset } from "../models/assets.model";
import { Cell, DrawableTiles, SpriteTile } from "../models/cell.model";

@Injectable()
export class AssetsService {
  public gameComponents: MotionAsset[] = []
  public selectedGameComponent: MotionAsset
  public selectedGameComponents: MotionAsset[] = [] 
  public obstacles: string[] = []

  public obstaclesDirty: boolean = false
  public placementChanged: boolean = true

  public removeGameComponent(): void {
    this.gameComponents = this.gameComponents.filter(asset => asset != this.selectedGameComponent)
    this.selectedGameComponent = undefined
  }

  public getAssetFromCell(cell: Cell, gridId: string): MotionAsset {
    return this.gameComponents.find(asset => asset.gridId === gridId && asset.cell.id === cell.id)
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
  
  public selectAsset(asset: MotionAsset): void;
  public selectAsset(selectedCell: Cell, currentGridId: string): void
  public selectAsset(arg1: any, arg2?: any): void {
    if(arg2) {
      this.gameComponents.forEach(asset => asset.selectionIndicator = undefined)
      this.selectedGameComponent = this.gameComponents.find(asset => asset.cell.id === arg1.id && asset.gridId === arg2)
      this.selectedGameComponent.addSelectionIndicator()
    } else {
      this.gameComponents.forEach(asset => asset.selectionIndicator = undefined)
      this.selectedGameComponent = arg1
      this.selectedGameComponent.addSelectionIndicator()
    }
  }  
  
  public deselectAsset(): void {
    this.gameComponents.forEach(asset => asset.selectionIndicator = undefined)    
    this.selectedGameComponent = undefined
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
        selectedCell.neighbors[0].obstacle = true
      }
      if (selectedCell.neighbors[1]) {
        selectedCell.neighbors[1].growableTileId = drawableItem.id + drawableItem.layers
        selectedCell.neighbors[1].visible = true
        selectedCell.neighbors[1].obstacle = true
      }
      if (selectedCell.neighbors[4]) {
        selectedCell.neighbors[4].growableTileId = drawableItem.id + drawableItem.layers
        selectedCell.neighbors[4].obstacle = true
      }

      selectedCell.growableTileId = drawableItem.id + drawableItem.layers
      selectedCell.visible = true
    }
  }
}


