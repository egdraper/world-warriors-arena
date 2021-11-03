import { CanvasService } from "../../canvas/canvas.service";
import { GridService } from "../../game-engine/grid.service";
import { Cell, GridMapCell, MapDetails } from "../../models/cell.model";

export class GridMapGenerator {
  private mapDetails: MapDetails

  constructor(
    private gridService: GridService,
    private canvasService: CanvasService,
  ) { }

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

  public createRandomizedBoarder(): void {
    const randomConsistency = 4

    this.gridService.gridDisplay.forEach(row => {
      row.forEach(cell => {
        // Outer most layer
        if (cell.x < 2 || cell.x > this.gridService.width - 3) {
          cell.obstacle = true
          cell.growableTileId = this.mapDetails.terrainTypeId
        }
        if (cell.y < 3 || cell.y > this.gridService.height - 3) {
          cell.obstacle = true
          cell.growableTileId = this.mapDetails.terrainTypeId
        }

        // left side 2nd layer
        if (cell.x === 2) {
          this.setEdgeLayerRandomization(cell, 0)
        }
        // left side 3rd layer
        if (cell.x === 3 && cell.neighbors[3].obstacle && cell.neighbors[0] && cell.neighbors[0].neighbors[3].obstacle) {
          this.setEdgeLayerRandomization(cell, 0)
        }

        // top side 2nd layer
        if (cell.y === 3) {
          this.setEdgeLayerRandomization(cell, 1)
        }
        // Top side 3rd Layer
        if (cell.y === 4 && cell.neighbors[0].obstacle && cell.neighbors[1] && cell.neighbors[1].neighbors[0].obstacle) {
          this.setEdgeLayerRandomization(cell, 1)
        }
      })
    })

    this.gridService.gridDisplay.forEach(row => {
      row.forEach(cell => {
        // right side 2nd layers
        if (cell.x === this.gridService.width - 3) {
          this.setEdgeLayerRandomization(cell, 2)
        }

        // bottom side 2nd layer
        if (cell.y === this.gridService.height - 3) {
          this.setEdgeLayerRandomization(cell, 1)
        }
      })
    })

    this.gridService.gridDisplay.forEach(row => {
      row.forEach(cell => {
        // right side 3rd layer
        if (cell.x === this.gridService.width - 4 && cell.neighbors[1].obstacle && cell.neighbors[2] && cell.neighbors[2].neighbors[1].obstacle) {
          this.setEdgeLayerRandomization(cell, 2)
        }
        // bottom side 3rd layer
        if (cell.y === this.gridService.height - 4 && cell.neighbors[2].obstacle && cell.neighbors[1] && cell.neighbors[1].neighbors[2].obstacle) {
          this.setEdgeLayerRandomization(cell, 1)
        }
      })
    })
  }

  public setEdgeLayerRandomization(cell: Cell, neighborIndex: number): void {
    const random = !!!Math.floor(Math.random() * 2)
    if (random) {
      if (cell.neighbors[neighborIndex]) {
        cell.neighbors[neighborIndex].obstacle = true
        cell.neighbors[neighborIndex].growableTileId = this.mapDetails.terrainTypeId
      }

      cell.obstacle = true
      cell.growableTileId = this.mapDetails.terrainTypeId
    }
  }

  public randomlyPlaceLargeObstacles(): void {
    this.gridService.gridDisplay.forEach(row => {
      row.forEach(cell => {
        cell.obstacle = !!!Math.floor(Math.random() * 4)
      })
    })
  }


  public addRandomTerrain(weight: number = 3): void {

    for (let i = 0; i < this.gridService.width; i++) {
      const randomY = Math.floor(Math.random() * this.gridService.height)
      const randomX = Math.floor(Math.random() * this.gridService.height)

      const startCell = this.gridService.getCell(randomX, randomY)
      startCell.obstacle = true
      startCell.growableTileId = this.mapDetails.terrainTypeId

      for (let i = 0; i < 8; i++) {
        if (startCell.neighbors[i]) {
          startCell.neighbors[i].obstacle = true
          startCell.neighbors[i].growableTileId = this.mapDetails.terrainTypeId

          this.populateCell(startCell, i, weight)
        }
      }
    }
  }

  private populateCell(cell: Cell, neighborIndex: number, weight: number): void {
    const isPlaced = !!!Math.floor(Math.random() * weight)
    if (!cell) { return }
    if (cell.neighbors[neighborIndex] && neighborIndex < 8 && isPlaced) {
      const neighbor = cell.neighbors[neighborIndex]

      for (let i = 0; i < 8; i++) {
        if (neighbor.neighbors[i]) {
          neighbor.neighbors[i].obstacle = true
          neighbor.neighbors[i].growableTileId = this.mapDetails.terrainTypeId


          if (neighbor.neighbors[i].neighbors[0]) {
            neighbor.neighbors[i].neighbors[0].obstacle = true
            neighbor.neighbors[i].neighbors[0].growableTileId = this.mapDetails.terrainTypeId
          }

          if (neighbor.neighbors[i].neighbors[1]) {
            neighbor.neighbors[i].neighbors[1].obstacle = true
            neighbor.neighbors[i].neighbors[1].growableTileId = this.mapDetails.terrainTypeId
          }

          if (neighbor.neighbors[i].neighbors[4]) {
            neighbor.neighbors[i].neighbors[4].obstacle = true
            neighbor.neighbors[i].neighbors[4].growableTileId = this.mapDetails.terrainTypeId
          }
        }

        this.populateCell(neighbor.neighbors[i], neighborIndex++, weight)
      }

    } else {
      return
    }
  }
}