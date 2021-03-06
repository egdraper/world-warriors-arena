import { GSM } from "../app.service.manager"
import { Cell, DefaultMapSettings } from "../models/cell.model"
import { GameMap } from "../models/game-map"

export class BaseMapGenerator {
  public static autoFillBackgroundTerrain(map: GameMap, collectionId: string) {
    for (let h = 0; h < map.height; h++) {
      for (let w = 0; w < map.width; w++) {
        let spriteSheet
        let xPos = 0
        let yPos = 0
        const cell = map.grid[`x${w}:y${h}`]

        //Randomly generates random texture
        let weight = 0
        GSM.Editor.findBackgroundCollection(collectionId).forEach(tile => {
          tile.lowWeight = weight
          weight += tile.rarity
          tile.highWeight = weight
        })

        const rand = Math.floor(Math.random() * weight);
        spriteSheet = GSM.Editor.findBackgroundCollection(collectionId)[0].spriteSheet

        GSM.Editor.findBackgroundCollection(collectionId).forEach(tile => {
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

  protected static clearOpening(path: Cell[]): void {
    path.forEach(cell => {
      cell.obstacle = false
      cell.spriteTypeId = undefined

      for (let i = 0; i < 8; i++) {
        if (cell.neighbors[i]) {
          cell.neighbors[i].obstacle = false
          cell.neighbors[i].spriteTypeId = undefined
          for (let l = 0; l < 8; l++) {
            if (cell.neighbors[i].neighbors[l]) {
              cell.neighbors[i].neighbors[l].obstacle = false
              cell.neighbors[i].neighbors[l].spriteTypeId = undefined
            }
          }
        }
      }
    })
  }

  protected static createRandomizedBoarder(map: GameMap, defaultMapSettings: DefaultMapSettings): void {
    map.gridDisplay.forEach(row => {
      row.forEach(cell => {
        // Outer most layer
        if (cell.x < 2 || cell.x > map.width - 3) {
          cell.obstacle = true
          cell.spriteTypeId = defaultMapSettings.terrainTypeId
        }
        if (cell.y < 3 || cell.y > map.height - 3) {
          cell.obstacle = true
          cell.spriteTypeId = defaultMapSettings.terrainTypeId
        }

        // left side 2nd layer
        if (cell.x === 2) {
          this.setEdgeLayerRandomization(cell, 0, defaultMapSettings)
        }
        // left side 3rd layer
        if (cell.x === 3 && cell.neighbors[3].obstacle && cell.neighbors[0] && cell.neighbors[0].neighbors[3].obstacle) {
          this.setEdgeLayerRandomization(cell, 0, defaultMapSettings)
        }

        // top side 2nd layer
        if (cell.y === 3) {
          this.setEdgeLayerRandomization(cell, 1, defaultMapSettings)
        }
        // Top side 3rd Layer
        if (cell.y === 4 && cell.neighbors[0].obstacle && cell.neighbors[1] && cell.neighbors[1].neighbors[0].obstacle) {
          this.setEdgeLayerRandomization(cell, 1, defaultMapSettings)
        }
      })
    })

    map.gridDisplay.forEach(row => {
      row.forEach(cell => {
        // right side 2nd layers
        if (cell.x === map.width - 3) {
          this.setEdgeLayerRandomization(cell, 2, defaultMapSettings)
        }

        // bottom side 2nd layer
        if (cell.y === map.height - 3) {
          this.setEdgeLayerRandomization(cell, 1, defaultMapSettings)
        }
      })
    })

    map.gridDisplay.forEach(row => {
      row.forEach(cell => {
        // right side 3rd layer
        if (cell.x === map.width - 4 && cell.neighbors[1].obstacle && cell.neighbors[2] && cell.neighbors[2].neighbors[1].obstacle) {
          this.setEdgeLayerRandomization(cell, 2, defaultMapSettings)
        }
        // bottom side 3rd layer
        if (cell.y === map.height - 4 && cell.neighbors[2].obstacle && cell.neighbors[1] && cell.neighbors[1].neighbors[2].obstacle) {
          this.setEdgeLayerRandomization(cell, 1, defaultMapSettings)
        }
      })
    })
  }

  protected static setEdgeLayerRandomization(cell: Cell, neighborIndex: number, defaultMapSettings: DefaultMapSettings): void {
    const random = !Math.floor(Math.random() * 2)
    if (random) {
      if (cell.neighbors[neighborIndex]) {
        cell.neighbors[neighborIndex].obstacle = true
        cell.neighbors[neighborIndex].spriteTypeId = defaultMapSettings.terrainTypeId
      }

      cell.obstacle = true
      cell.spriteTypeId = defaultMapSettings.terrainTypeId
    }
  }

  protected static randomlyPlaceInvisibleObstacles(map: GameMap): void {
    map.gridDisplay.forEach(row => {
      row.forEach(cell => {
        cell.obstacle = !Math.floor(Math.random() * 4)
      })
    })
  }


  protected static addRandomTerrain(map: GameMap, defaultMapSettings: DefaultMapSettings, weight: number = 3): void {
    for (let i = 0; i < map.width; i++) {
      const randomY = Math.floor(Math.random() * map.height)
      const randomX = Math.floor(Math.random() * map.height)

      const startCell = map.getCell(randomX, randomY)
      startCell.obstacle = true
      startCell.spriteTypeId = defaultMapSettings.terrainTypeId

      for (let i = 0; i < 8; i++) {
        if (startCell.neighbors[i]) {
          startCell.neighbors[i].obstacle = true
          startCell.neighbors[i].spriteTypeId = defaultMapSettings.terrainTypeId

          this.populateCell(startCell, i, weight, defaultMapSettings)
        }
      }
    }
  }

  protected static terrainCleanup(map: GameMap): void {
    map.gridDisplay.forEach(row => {
      row.forEach(cell => {
        if(cell.spriteTypeId) {          
          if((cell.neighbors[1] && !cell.neighbors[1].spriteTypeId) && (cell.neighbors[3] && !cell.neighbors[3].spriteTypeId)) {
            cell.spriteTypeId = undefined
            cell.obstacle = false
          }

          if((cell.neighbors[0] && !cell.neighbors[0].spriteTypeId) && (cell.neighbors[2] && !cell.neighbors[2].spriteTypeId)) {
            cell.spriteTypeId = undefined
            cell.obstacle = false
          }
        }
      })
    })
  }

  protected static populateCell(cell: Cell, neighborIndex: number, weight: number, defaultMapSettings: DefaultMapSettings): void {
    const isPlaced = !Math.floor(Math.random() * weight)
    if (!cell) { return }
    if (cell.neighbors[neighborIndex] && neighborIndex < 8 && isPlaced) {
      const neighbor = cell.neighbors[neighborIndex]

      for (let i = 0; i < 8; i++) {
        if (neighbor.neighbors[i]) {
          neighbor.neighbors[i].obstacle = true
          neighbor.neighbors[i].spriteTypeId = defaultMapSettings.terrainTypeId


          if (neighbor.neighbors[i].neighbors[0]) {
            neighbor.neighbors[i].neighbors[0].obstacle = true
            neighbor.neighbors[i].neighbors[0].spriteTypeId = defaultMapSettings.terrainTypeId
          }

          if (neighbor.neighbors[i].neighbors[1]) {
            neighbor.neighbors[i].neighbors[1].obstacle = true
            neighbor.neighbors[i].neighbors[1].spriteTypeId = defaultMapSettings.terrainTypeId
          }

          if (neighbor.neighbors[i].neighbors[4]) {
            neighbor.neighbors[i].neighbors[4].obstacle = true
            neighbor.neighbors[i].neighbors[4].spriteTypeId = defaultMapSettings.terrainTypeId
          }
        }

        this.populateCell(neighbor.neighbors[i], neighborIndex++, weight, defaultMapSettings)
      }

    } else {
      return
    }
  }
  
  protected static clearObstacles(map: GameMap): void {
    map.gridDisplay.forEach(row => {
      row.forEach(cell => {
        cell.obstacle = false
      })
    })
  }
}