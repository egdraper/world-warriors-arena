import { GridService } from "../../game-engine/grid.service"
import { ShortestPath } from "../../game-engine/shortest-path"
import { Cell, MapDetails } from "../../models/cell.model"
import { EditorService } from "../editor-palette/editor.service"

export class BaseMapGenerator {
  protected mapDetails: MapDetails

  constructor(
    public editorService: EditorService,
    public shortestPath: ShortestPath,
    public gridService: GridService
  ) { 
  }

  public autoFillBackgroundTerrain(collectionId: string) {
    for (let h = 0; h < this.gridService.activeGrid.height; h++) {
      for (let w = 0; w < this.gridService.activeGrid.width; w++) {
        let spriteSheet
        let xPos = 0
        let yPos = 0
        const cell = this.gridService.activeGrid.grid[`x${w}:y${h}`]

        //Randomly generates random texture
        let weight = 0
        this.editorService.findBackgroundCollection(collectionId).forEach(tile => {
          tile.lowWeight = weight
          weight += tile.rarity
          tile.highWeight = weight
        })

        const rand = Math.floor(Math.random() * weight);
        spriteSheet = this.editorService.findBackgroundCollection(collectionId)[0].spriteSheet

        this.editorService.findBackgroundCollection(collectionId).forEach(tile => {
          if (rand < tile.highWeight && rand >= tile.lowWeight) {
            xPos = Math.floor(Math.random() * tile.spriteGridPosX.length)
            yPos = Math.floor(Math.random() * tile.spriteGridPosY.length)
            xPos = tile.spriteGridPosX[xPos]
            yPos = tile.spriteGridPosY[yPos]
            spriteSheet = tile.spriteSheet
          }
        })

        cell.backgroundTile = {
          id: `x${xPos}:Y${yPos}${collectionId}`,
          spriteSheet: spriteSheet,
          spriteGridPosX: [xPos],
          spriteGridPosY: [yPos],
          rarity: 0
        }
      }
    }
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

    this.gridService.activeGrid.gridDisplay.forEach(row => {
      row.forEach(cell => {
        // Outer most layer
        if (cell.x < 2 || cell.x > this.gridService.activeGrid.width - 3) {
          cell.obstacle = true
          cell.growableTileId = this.mapDetails.terrainTypeId
        }
        if (cell.y < 3 || cell.y > this.gridService.activeGrid.height - 3) {
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

    this.gridService.activeGrid.gridDisplay.forEach(row => {
      row.forEach(cell => {
        // right side 2nd layers
        if (cell.x === this.gridService.activeGrid.width - 3) {
          this.setEdgeLayerRandomization(cell, 2)
        }

        // bottom side 2nd layer
        if (cell.y === this.gridService.activeGrid.height - 3) {
          this.setEdgeLayerRandomization(cell, 1)
        }
      })
    })

    this.gridService.activeGrid.gridDisplay.forEach(row => {
      row.forEach(cell => {
        // right side 3rd layer
        if (cell.x === this.gridService.activeGrid.width - 4 && cell.neighbors[1].obstacle && cell.neighbors[2] && cell.neighbors[2].neighbors[1].obstacle) {
          this.setEdgeLayerRandomization(cell, 2)
        }
        // bottom side 3rd layer
        if (cell.y === this.gridService.activeGrid.height - 4 && cell.neighbors[2].obstacle && cell.neighbors[1] && cell.neighbors[1].neighbors[2].obstacle) {
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
    this.gridService.activeGrid.gridDisplay.forEach(row => {
      row.forEach(cell => {
        cell.obstacle = !!!Math.floor(Math.random() * 4)
      })
    })
  }


  public addRandomTerrain(weight: number = 3): void {
    for (let i = 0; i < this.gridService.activeGrid.width; i++) {
      const randomY = Math.floor(Math.random() * this.gridService.activeGrid.height)
      const randomX = Math.floor(Math.random() * this.gridService.activeGrid.height)

      const startCell = this.gridService.activeGrid.getCell(randomX, randomY)
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

  public terrainCleanup(): void {
    this.gridService.activeGrid.gridDisplay.forEach(row => {
      row.forEach(cell => {
        if(cell.growableTileId) {          
          if((cell.neighbors[1] && !cell.neighbors[1].growableTileId) && (cell.neighbors[3] && !cell.neighbors[3].growableTileId)) {
            cell.growableTileId = undefined
            cell.obstacle = false
          }

          if((cell.neighbors[0] && !cell.neighbors[0].growableTileId) && (cell.neighbors[2] && !cell.neighbors[2].growableTileId)) {
            cell.growableTileId = undefined
            cell.obstacle = false
          }
        }
      })
    })
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
  
  public clearObstacles(): void {
    this.gridService.activeGrid.gridDisplay.forEach(row => {
      row.forEach(cell => {
        cell.obstacle = false
      })
    })
  }
}