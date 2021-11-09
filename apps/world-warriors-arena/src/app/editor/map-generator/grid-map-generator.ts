import { CanvasService } from "../../canvas/canvas.service";
import { GridService } from "../../game-engine/grid.service";
import { ShortestPath } from "../../game-engine/shortest-path";
import { Cell, GridMapCell, MapDetails } from "../../models/cell.model";
import { EditorService } from "../editor-palette/editor.service";
import { BaseMapGenerator } from "./base-map-generator";

export class GridMapGenerator extends BaseMapGenerator {
  constructor(
    public gridService: GridService,
    public shortestPath: ShortestPath,
    public editorService: EditorService,
    private canvasService: CanvasService,
  ) {
    super(editorService,shortestPath, gridService)
   }

  public generateMap(gridMapCell: GridMapCell, mapDetails: MapDetails) {
    this.mapDetails = mapDetails
    this.createNonObstructedPaths(gridMapCell)
  }

  public createNonObstructedPaths(gridMapCell: GridMapCell): void {
    let clearing: Cell[] = []
    gridMapCell.markers.forEach(marker => {
      try {
        clearing.push(this.gridService.getGridCellByCoordinate(marker.x * (gridMapCell.relationX * this.canvasService.scale), marker.y * (gridMapCell.relationY * this.canvasService.scale )))
      } catch { }
    })
    clearing = [...new Set(clearing)]
    clearing = clearing.filter(cell => cell)

    if (this.mapDetails.pathTypeId) {
      clearing.forEach(cell => {
        if (cell.neighbors[0]) { cell.neighbors[0].backgroundGrowableTileId = this.mapDetails.pathTypeId }
        if (cell.neighbors[1]) { cell.neighbors[1].backgroundGrowableTileId = this.mapDetails.pathTypeId }
        if (cell.neighbors[4]) { cell.neighbors[4].backgroundGrowableTileId = this.mapDetails.pathTypeId }
        cell.backgroundGrowableTileId = this.mapDetails.pathTypeId
      })
    }

    if (this.mapDetails.inverted) {
      this.addFullTerrain()
    } else {
      this.addRandomTerrain()
      this.createRandomizedBoarder()
    }

    this.clearOpening(clearing)
  }

  public addFullTerrain(): void {
    this.gridService.gridDisplay.forEach(row => {
      row.forEach(cell => {
        cell.growableTileId = this.mapDetails.terrainTypeId
        cell.obstacle = true
      })
    })
  }

  public clearOpening(path: Cell[]): void {
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