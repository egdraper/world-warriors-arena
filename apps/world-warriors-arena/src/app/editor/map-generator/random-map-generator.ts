import { ShortestPath } from "../../game-engine/shortest-path";
import { TerrainType } from "../../game-assets/tiles.db.ts/tile-assets.db";
import { GridService } from "../../game-engine/grid.service";
import { Cell } from "../../models/cell.model";
import { EditorService } from "../editor-palette/editor.service";

export class RandomMapGenerator {
  constructor(
    private editorService: EditorService,
    private shortestPath: ShortestPath,
    private gridService: GridService) { }

  public generateMap(width: number, height: number, terrainTypeId: string) {
    this.createNonObstructedPaths(width, height)
  }

  public createNonObstructedPaths(width: number, height: number): void {
    const randomLeft = Math.floor(Math.random() * (height - 3) + 3)
    const randomRight = Math.floor(Math.random() * (height - 3) + 3)

    let path
    for (let i = 0; i < 5; i++) {
      try {
        this.clearObstacles()
        this.randomlyPlaceLargeObstacles()
        this.addRandomTerrain()
        path = this.shortestPath.find(this.gridService.grid[`x0:y${randomLeft}`], this.gridService.grid[`x${width - 2}:y${randomRight}`], [])

      } catch { }

    }

    this.clearObstacles()
    path.forEach(cell => {
      if (cell.neighbors[0]) { cell.neighbors[0].backgroundGrowableTileId = "DrawableDirtRoad" }
      if (cell.neighbors[1]) { cell.neighbors[1].backgroundGrowableTileId = "DrawableDirtRoad" }
      if (cell.neighbors[4]) { cell.neighbors[4].backgroundGrowableTileId = "DrawableDirtRoad" }
      cell.backgroundGrowableTileId = "DrawableDirtRoad"
    })
    this.createRandomizedBoarder()
    this.clearOpening(path)
    this.editorService.backgroundDirty = true
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
    const randomConsistency = 2

    this.gridService.gridDisplay.forEach(row => {
      row.forEach(cell => {
        // Outer most layer
        if (cell.x < 2 || cell.x > this.gridService.width - 3) {
          cell.obstacle = true
          cell.growableTileId = "DrawableTree"
        }
        if (cell.y < 3 || cell.y > this.gridService.height - 3) {
          cell.obstacle = true
          cell.growableTileId = "DrawableTree"
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
        cell.neighbors[neighborIndex].growableTileId = "DrawableTree"
      }

      cell.obstacle = true
      cell.growableTileId = "DrawableTree"
    }
  }

  public randomlyPlaceLargeObstacles(): void {
    this.gridService.gridDisplay.forEach(row => {
      row.forEach(cell => {
        cell.obstacle = !!!Math.floor(Math.random() * 4)
      })
    })
  }


  public clearObstacles(): void {
    this.gridService.gridDisplay.forEach(row => {
      row.forEach(cell => {
        cell.obstacle = false
      })
    })
  }

  public addRandomTerrain(weight: number = 3 ): void {
    const randomY = Math.floor(Math.random() * this.gridService.height)
    const randomX = Math.floor(Math.random() * this.gridService.height)

    const startCell = this.gridService.getCell(randomX, randomY)
    startCell.obstacle = true
    startCell.growableTileId = "DrawableTree"

    for (let i = 0; i < 8; i++) {
      if (startCell.neighbors[i]) {
        startCell.neighbors[i].obstacle = true
        startCell.neighbors[i].growableTileId = "DrawableTree"

        this.populateCell(startCell, i, weight)
      }
    }
  }

  private populateCell(cell: Cell, neighborIndex: number, weight: number): void {
    const isPlaced = !!!Math.floor(Math.random() * weight)
    if (cell.neighbors[neighborIndex] && neighborIndex < 8 && isPlaced) {
      const neighbor = cell.neighbors[neighborIndex]

      for (let i = 0; i < 8; i++) {
        if (neighbor.neighbors[i]) {
          neighbor.neighbors[i].obstacle = true
          neighbor.neighbors[i].growableTileId = "DrawableTree"


          if (neighbor.neighbors[i].neighbors[0]) {
            neighbor.neighbors[i].neighbors[0].obstacle = true
            neighbor.neighbors[i].neighbors[0].growableTileId = "DrawableTree"
          }

          if (neighbor.neighbors[i].neighbors[1]) {
            neighbor.neighbors[i].neighbors[1].obstacle = true
            neighbor.neighbors[i].neighbors[1].growableTileId = "DrawableTree"
          }

          if (neighbor.neighbors[i].neighbors[4]) {
            neighbor.neighbors[i].neighbors[4].obstacle = true
            neighbor.neighbors[i].neighbors[4].growableTileId = "DrawableTree"
          }
        }

        this.populateCell(neighbor.neighbors[i], neighborIndex++, weight)
      }

    } else {
      return
    }
  }
}