import { GSM } from "../app.service.manager";
import { Cell, DefaultMapSettings, GridMapCell } from "../models/cell.model";
import { GameMap } from "../models/game-map";
import { GameSettings } from "../models/game-settings";
import { BaseMapGenerator } from "./base-map-generator";

export class GridMapGenerator extends BaseMapGenerator {
  public static generateMap(map: GameMap, gridMapCell: GridMapCell, defaultMapSettings: DefaultMapSettings) {
    this.createNonObstructedPaths(map, gridMapCell, defaultMapSettings)
  }

  public static createNonObstructedPaths(map: GameMap, gridMapCell: GridMapCell, defaultMapSettings: DefaultMapSettings): void {
    let clearing: Cell[] = []
    gridMapCell.markers.forEach(marker => {
      try {
        clearing.push(GSM.Map.activeMap.getGridCellByCoordinate(marker.x * (gridMapCell.relationX * GameSettings.scale), marker.y * (gridMapCell.relationY * GameSettings.scale)))
      } catch { console.log("error")}
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
      this.addRandomTerrain(map, defaultMapSettings)
      this.createRandomizedBoarder(map, defaultMapSettings)
    }

    this.clearOpening(clearing)
  }

  public static addFullTerrain(defaultMapSettings: DefaultMapSettings): void {
    GSM.Map.activeMap.gridDisplay.forEach(row => {
      row.forEach(cell => {
        cell.spriteType = defaultMapSettings.terrainTypeId
        cell.obstacle = true
      })
    })
  }

  protected static clearOpening(path: Cell[]): void {
    path.forEach(cell => {
      cell.obstacle = false
      cell.spriteType = undefined

      for (let i = 0; i < 8; i++) {
        if (cell.neighbors[i]) {
          cell.neighbors[i].obstacle = false
          cell.neighbors[i].spriteType = undefined
          for (let l = 0; l < 8; l++) {
            if (cell.neighbors[i].neighbors[l]) {
              cell.neighbors[i].neighbors[l].obstacle = false
              cell.neighbors[i].neighbors[l].spriteType = undefined
            }
          }
        }
      }
    })
  }
}