import { GSM } from "../app.service.manager";
import { Cell, DefaultMapSettings, GridMapCell } from "../models/cell.model";
import { GameSettings } from "../models/game-settings";
import { BaseMapGenerator } from "./base-map-generator";

export class GridMapGenerator extends BaseMapGenerator {
  public static generateMap(gridMapCell: GridMapCell, defaultMapSettings: DefaultMapSettings) {
    this.createNonObstructedPaths(gridMapCell, defaultMapSettings)
  }

  public static createNonObstructedPaths(gridMapCell: GridMapCell, defaultMapSettings: DefaultMapSettings): void {
    let clearing: Cell[] = []
    gridMapCell.markers.forEach(marker => {
      try {
        clearing.push(GSM.Map.activeGrid.getGridCellByCoordinate(marker.x * (gridMapCell.relationX * GameSettings.scale), marker.y * (gridMapCell.relationY * GameSettings.scale)))
      } catch { }
    })
    clearing = [...new Set(clearing)]
    clearing = clearing.filter(cell => cell)

    if (defaultMapSettings.pathTypeId) {
      clearing.forEach(cell => {
        if (cell.neighbors[0]) { cell.neighbors[0].backgroundGrowableTileId = defaultMapSettings.pathTypeId }
        if (cell.neighbors[1]) { cell.neighbors[1].backgroundGrowableTileId = defaultMapSettings.pathTypeId }
        if (cell.neighbors[4]) { cell.neighbors[4].backgroundGrowableTileId = defaultMapSettings.pathTypeId }
        cell.backgroundGrowableTileId = defaultMapSettings.pathTypeId
      })
    }

    if (defaultMapSettings.inverted) {
      this.addFullTerrain(defaultMapSettings)
    } else {
      this.addRandomTerrain(defaultMapSettings)
      this.createRandomizedBoarder(defaultMapSettings)
    }

    this.clearOpening(clearing)
  }

  public static addFullTerrain(defaultMapSettings: DefaultMapSettings): void {
    GSM.Map.activeGrid.gridDisplay.forEach(row => {
      row.forEach(cell => {
        cell.growableTileId = defaultMapSettings.terrainTypeId
        cell.obstacle = true
      })
    })
  }

  protected static clearOpening(path: Cell[]): void {
    path.forEach(cell => {
      cell.obstacle = false
      cell.growableTileId = undefined

      for (let i = 0; i < 8; i++) {
        if (cell.neighbors[i]) {
          cell.neighbors[i].obstacle = false
          cell.neighbors[i].growableTileId = undefined
          for (let l = 0; l < 8; l++) {
            if (cell.neighbors[i].neighbors[l]) {
              cell.neighbors[i].neighbors[l].obstacle = false
              cell.neighbors[i].neighbors[l].growableTileId = undefined
            }
          }
        }
      }
    })
  }
}