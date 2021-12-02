import { Injectable } from "@angular/core";
import { GridService } from "./map.service";
import { Cell, Point } from "../models/cell.model";
import { DebugSettings } from "../models/game-settings";
import { GSM } from "../app.service.manager";

@Injectable()
export class NewFogOfWarService {
  public edgeCells: Cell[] = []
  public visitedCells = new Set<Cell>()
  public blackOutRimPoints: Array<Cell> = []
  public nonObstructedCells: { [id: string]: Set<Cell> } = {}
  public fogOfWarRimPoints: { [id: string]: Cell[] } = {}


  public createCellLines(): void {
    this.findVisibleCellsEdges()
    GSM.Map.activeGrid.gridDisplay.forEach(row => {
      row.forEach(cell => {
        if (!cell.obstacle) {
          cell.revealed = false
          console.log(cell.id)
          this.fogOfWarRimPoints[cell.id] = []
          this.edgeCells.forEach(edgeCell => {
            this.checkForObstacle(cell, edgeCell)
          })

          const cleanSet = new Set(this.fogOfWarRimPoints[cell.id])
          this.fogOfWarRimPoints[cell.id] = Array.from(cleanSet)

        }
      })
    })
  }

  private checkForObstacle(assetCell: Cell, edgeCell: Cell): boolean {
    const assetCellCenterX: number = assetCell.posX + 16
    const assetCellCenterY: number = assetCell.posY + 16

    const upLine = assetCell.x === edgeCell.x && assetCell.y > edgeCell.y
    const rightLine = assetCell.y === edgeCell.y && assetCell.x < edgeCell.x
    const downLine = assetCell.x === edgeCell.x && assetCell.y < edgeCell.y
    const leftLine = assetCell.y === edgeCell.y && assetCell.x > edgeCell.x
    const bottomRightQuadrant = assetCellCenterX < edgeCell.posX && assetCellCenterY < edgeCell.posY
    const bottomLeftQuadrant = assetCellCenterX > edgeCell.posX && assetCellCenterY < edgeCell.posY
    const topRightQuadrant = assetCellCenterX < edgeCell.posX && assetCellCenterY > edgeCell.posY
    const topLeftQuadrant = assetCellCenterX > edgeCell.posX && assetCellCenterY > edgeCell.posY

    if (upLine) {
      this.traceStraitLine(assetCell, assetCell, edgeCell, 0)
    } else if (rightLine) {
      this.traceStraitLine(assetCell, assetCell, edgeCell, 1)
    } else if (downLine) {
      this.traceStraitLine(assetCell, assetCell, edgeCell, 2)
    } else if (leftLine) {
      this.traceStraitLine(assetCell, assetCell, edgeCell, 3)
    } else if (bottomRightQuadrant) {
      const xRatioMultiplier = 1
      const yRatioMultiplier = 1
      const yLength = (edgeCell.posY + 16) - assetCellCenterY
      const xLength = (edgeCell.posX + 16) - assetCellCenterX

      return this.traceLine(assetCell, xRatioMultiplier, yRatioMultiplier, yLength, xLength, assetCellCenterX, assetCellCenterY, edgeCell)
    } else if (topRightQuadrant) {
      const xRatioMultiplier = 1
      const yRatioMultiplier = -1
      const yLength = assetCellCenterY - (edgeCell.posY + 16)
      const xLength = (edgeCell.posX + 16) - assetCellCenterX

      return this.traceLine(assetCell, xRatioMultiplier, yRatioMultiplier, yLength, xLength, assetCellCenterX, assetCellCenterY, edgeCell)
    } else if (topLeftQuadrant) {
      const xRatioMultiplier = -1
      const yRatioMultiplier = -1
      const yLength = assetCellCenterY - (edgeCell.posY + 16)
      const xLength = assetCellCenterX - (edgeCell.posX + 16)

      return this.traceLine(assetCell, xRatioMultiplier, yRatioMultiplier, yLength, xLength, assetCellCenterX, assetCellCenterY, edgeCell)
    } else if (bottomLeftQuadrant) {
      const xRatioMultiplier = -1
      const yRatioMultiplier = 1
      const yLength = (edgeCell.posY + 16) - assetCellCenterY
      const xLength = assetCellCenterX - (edgeCell.posX + 16)

      return this.traceLine(assetCell, xRatioMultiplier, yRatioMultiplier, yLength, xLength, assetCellCenterX, assetCellCenterY, edgeCell)
    }

    return false
  }

  private traceLine(assetCell: Cell, xRatioMultiplier: number, yRatioMultiplier: number, yLength: number, xLength: number, assetCenterX: number, assetCenterY: number, edgeCell: Cell): boolean {
    const yRatio = Math.round(yLength / 64)
    const xRatio = Math.round(xLength / 64)
    let checkLocationY = assetCenterY
    let checkLocationX = assetCenterX

    let reachedDestination = false
    let foundObstacle = false

    while (!reachedDestination) {
      checkLocationX += (xRatio * xRatioMultiplier)
      checkLocationY += (yRatio * yRatioMultiplier)

      const checkedCell = GSM.Map.activeGrid.getGridCellByCoordinate(checkLocationX, checkLocationY)
      if (GSM.Map.activeGrid.getGridCellByCoordinate(checkLocationX, checkLocationY)?.id === edgeCell.id) {
        reachedDestination = true
      } else {
        try {
          if (!checkedCell) {
            this.addCenterPointForTracing(assetCell, edgeCell, edgeCell)
            reachedDestination = true
          } else {
            if (checkedCell.obstacle) {
              this.addCenterPointForTracing(assetCell, checkedCell, edgeCell)
              reachedDestination = true
            }
          }

        } catch (e) {
          console.log(e, checkLocationX, checkLocationY)
        }

      }
      if (checkedCell && assetCell) {
        this.addNonObstructedCell(assetCell, checkedCell)
      }
    }

    return foundObstacle
  }

  private traceStraitLine(assetCell: Cell, nextCell: Cell, edgeCell: Cell, direction: number): void {
    if (!nextCell) {
      this.fogOfWarRimPoints[assetCell.id].push(edgeCell)
      return
    }
    if (nextCell.obstacle) {
      this.addCenterPointForTracing(assetCell, nextCell, edgeCell)
      return
    } else {
      this.addNonObstructedCell(assetCell, nextCell)
      this.traceStraitLine(assetCell, nextCell.neighbors[direction], edgeCell, direction)
    }
  }

  private addCenterPointForTracing(centerCell: Cell, obstacleCell: Cell, edgeCell: Cell): void {
    let adjustmentY = 0
    let adjustmentX = 0

    if (DebugSettings.fogOffset && !DebugSettings.fogDebug) {
      if (centerCell.y > obstacleCell.y) {
        adjustmentY = -96
      }
      if (centerCell.x > obstacleCell.x) {
        adjustmentX = -64
      }
      if (centerCell.x < obstacleCell.x) {
        adjustmentX = 64
      }
    }


    if (!this.fogOfWarRimPoints[centerCell.id].find(a => a && obstacleCell.id === a.id)) {
      obstacleCell.fogPointX = obstacleCell.posX + 16 + adjustmentX
      obstacleCell.fogPointY = obstacleCell.posY + 16 + adjustmentY
      this.fogOfWarRimPoints[centerCell.id].push(obstacleCell)
    }
  }

  private addNonObstructedCell(assetCell: Cell, nonObstructedCell: Cell): void {
    if (!this.nonObstructedCells[assetCell.id]) { this.nonObstructedCells[assetCell.id] = new Set() }
    this.nonObstructedCells[assetCell.id].add(nonObstructedCell)
  }


  public findVisibleCellsEdges(): void {
    this.edgeCells = []
    for (let a = 0; a <= GSM.Map.activeGrid.width; a++) {
      this.edgeCells.push(GSM.Map.activeGrid.getCell(a, 0))
    }
    for (let a = 0; a < GSM.Map.activeGrid.height; a++) {
      this.edgeCells.push(GSM.Map.activeGrid.getCell(GSM.Map.activeGrid.width - 1, a))
    }
    for (let a = GSM.Map.activeGrid.width - 1; a >= 0; a--) {
      this.edgeCells.push(GSM.Map.activeGrid.getCell(a, GSM.Map.activeGrid.height - 1))
    }
    for (let a = GSM.Map.activeGrid.height; a >= 0; a--) {
      this.edgeCells.push(GSM.Map.activeGrid.getCell(0, a))
    }
    this.edgeCells = this.edgeCells.filter(a => a)
  }
}
