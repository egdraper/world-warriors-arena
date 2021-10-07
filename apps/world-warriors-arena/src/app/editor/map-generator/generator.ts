import { ShortestPath } from "../../engine/shortest-path";
import { TerrainType } from "../../game-assets/tiles.db.ts/tile-assets.db";
import { GridService } from "../../grid/grid.service";
import { Cell } from "../../models/cell.model";
import { EditorService } from "../editor-pallete/editor.service";

export class MapGenerator {
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
        path = this.shortestPath.find(this.gridService.grid[`x0:y${randomLeft}`], this.gridService.grid[`x${width - 2}:y${randomRight}`], [])

      } catch { }

    }

    this.clearObstacles()
    path.forEach(cell => {
      if (cell.neighbors[0]) { cell.neighbors[0].backgroundGrowableTileId = "DrawableDirtRoad" }
      if (cell.neighbors[1]) { cell.neighbors[0].backgroundGrowableTileId = "DrawableDirtRoad" }
      if (cell.neighbors[4]) { cell.neighbors[2].backgroundGrowableTileId = "DrawableDirtRoad" }
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
        if (cell.x < 2 || cell.x > this.gridService.width - 3) {
          cell.obstacle = true
          cell.growableTileId = "DrawableTree"
        }
        if (cell.y < 3 || cell.y > this.gridService.height - 3) {
          cell.obstacle = true
          cell.growableTileId = "DrawableTree"
        }

        // left side
        if (cell.x === 2) {
          const random = !!!Math.floor(Math.random() * randomConsistency)
          if (random) {
            if (cell.neighbors[0]) {
              cell.neighbors[0].obstacle = true
              cell.neighbors[0].growableTileId = "DrawableTree"
            }

            cell.obstacle = true
            cell.growableTileId = "DrawableTree"
          }
        }
        if (cell.x === 3 && cell.neighbors[3].obstacle && cell.neighbors[0] && cell.neighbors[0].neighbors[3].obstacle) {
          const random = !!!Math.floor(Math.random() * randomConsistency)
          if (random) {
            if (cell.neighbors[0]) {
              cell.neighbors[0].obstacle = true
              cell.neighbors[0].growableTileId = "DrawableTree"
            }

            cell.obstacle = true
            cell.growableTileId = "DrawableTree"
          }
        }

        // Top Side
        if (cell.y === 3) {
          const random = !!!Math.floor(Math.random() * randomConsistency)
          if (random) {
            if (cell.neighbors[1]) {
              cell.neighbors[1].obstacle = true
              cell.neighbors[1].growableTileId = "DrawableTree"
            }

            cell.obstacle = true
            cell.growableTileId = "DrawableTree"
          }
        }
        if (cell.y === 4 && cell.neighbors[0].obstacle && cell.neighbors[1] && cell.neighbors[1].neighbors[0].obstacle) {
          const random = !!!Math.floor(Math.random() * randomConsistency)
          if (random) {
            if (cell.neighbors[1]) {
              cell.neighbors[1].obstacle = true
              cell.neighbors[1].growableTileId = "DrawableTree"
            }

            cell.obstacle = true
            cell.growableTileId = "DrawableTree"
          }
        }
      })
    })

    this.gridService.gridDisplay.forEach(row => {
      row.forEach(cell => {
        // Right Side and bottom side bottom layer
        if (cell.x === this.gridService.width - 3) {
          const random = !!!Math.floor(Math.random() * randomConsistency)
          if (random) {
            if (cell.neighbors[2]) {
              cell.neighbors[2].obstacle = true
              cell.neighbors[2].growableTileId = "DrawableTree"
            }

            cell.obstacle = true
            cell.growableTileId = "DrawableTree"
          }
        }

        if (cell.y === this.gridService.height - 3) {
          const random = !!!Math.floor(Math.random() * randomConsistency)
          if (random) {
            if (cell.neighbors[1]) {
              cell.neighbors[1].obstacle = true
              cell.neighbors[1].growableTileId = "DrawableTree"
            }

            cell.obstacle = true
            cell.growableTileId = "DrawableTree"
          }
        }
      })
    })

    this.gridService.gridDisplay.forEach(row => {
      row.forEach(cell => {
        // Right and bottom Side topLayer
        if (cell.x === this.gridService.width - 4 && cell.neighbors[1].obstacle && cell.neighbors[2] && cell.neighbors[2].neighbors[1].obstacle) {
          const random = !!!Math.floor(Math.random() * randomConsistency)
          if (random) {
            if (cell.neighbors[2]) {
              cell.neighbors[2].obstacle = true
              cell.neighbors[2].growableTileId = "DrawableTree"
            }

            cell.obstacle = true
            cell.growableTileId = "DrawableTree"
          }
        }

        if (cell.y === this.gridService.height - 4 && cell.neighbors[2].obstacle && cell.neighbors[1] && cell.neighbors[1].neighbors[2].obstacle) {
          const random = !!!Math.floor(Math.random() * randomConsistency)
          if (random) {
            if (cell.neighbors[1]) {
              cell.neighbors[1].obstacle = true
              cell.neighbors[1].growableTileId = "DrawableTree"
            }

            cell.obstacle = true
            cell.growableTileId = "DrawableTree"
          }
        }
      })
    })
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
}