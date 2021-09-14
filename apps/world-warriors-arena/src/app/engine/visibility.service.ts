import { Injectable } from "@angular/core";
import { CanvasService } from "../canvas/canvas.service";
import { GridService } from "../grid/grid.service";
import { Cell } from "../models/cell.model";

@Injectable() 
export class FogOfWarService {
  public visibleCell: {[id: string]: any[]} = {}
  public visitedVisibleCell: {[id: string]: any[]} = {}
  public fogEnabled: boolean = false

  constructor(
    private canvasService: CanvasService,
    private gridService: GridService
    ) { }

  public preloadVisibility(): void {  
    this.gridService.gridDisplay.forEach(row => {
      row.forEach(cell => {
        if(!cell.obstacle) {
          this.visibleCell[cell.id] = []
          this.gridService.obstacles.forEach(id => {
            this.traceCell(cell, this.gridService.grid[id])
          })
        }
      })
    })  
  }

  public traceCell(cell: Cell, obstacle: Cell): void {
    const ctx = this.canvasService.fogCTX
    ctx.beginPath();
    ctx.moveTo(cell.posX + 25, cell.posY + 25);
    const straitDownLine = cell.posX === obstacle.posX && cell.posY < obstacle.posY
    const straitUpLine = cell.posX === obstacle.posX && cell.posY > obstacle.posY
    const straitLeftLine = cell.posY === obstacle.posY && cell.posX > obstacle.posX
    const straitRightLIne = cell.posY === obstacle.posY && cell.posX < obstacle.posX
    const bottomLeftQuadrant = cell.posX > obstacle.posX && cell.posY < obstacle.posY
    const bottomRightQuadrant = cell.posX < obstacle.posX && cell.posY < obstacle.posY
    const topLeftQuadrant = cell.posX > obstacle.posX && cell.posY > obstacle.posY
    const topRightQuadrant = cell.posX < obstacle.posX && cell.posY > obstacle.posY

    let point1x
    let point1y

    let point2x
    let point2y

    let point1offsetX
    let point1offsetY
    let point2offsetX
    let point2offsetY
    if (straitDownLine) {
      point1x = obstacle.posX
      point1y = obstacle.posY 
      point2x = obstacle.posX + 50
      point2y = obstacle.posY 
      point1offsetX = point1x 
      point1offsetY = point1y + 50
      point2offsetX = point2x 
      point2offsetY = point2y + 50
    } else if (straitUpLine) {
      point1x = obstacle.posX
      point1y = obstacle.posY + 50
      point2x = obstacle.posX + 50
      point2y = obstacle.posY + 50
      point1offsetX = point1x 
      point1offsetY = point1y - 50
      point2offsetX = point2x 
      point2offsetY = point2y - 50
    } else if (straitLeftLine) {
      point1x = obstacle.posX + 50
      point1y = obstacle.posY
      point2x = obstacle.posX + 50
      point2y = obstacle.posY + 50
      point1offsetX = point1x - 50
      point1offsetY = point1y 
      point2offsetX = point2x - 50
      point2offsetY = point2y 
    } else if (straitRightLIne) {
      point1x = obstacle.posX 
      point1y = obstacle.posY 
      point2x = obstacle.posX 
      point2y = obstacle.posY + 50
      point1offsetX = point1x + 50
      point1offsetY = point1y 
      point2offsetX = point2x + 50
      point2offsetY = point2y 
    } else if (bottomLeftQuadrant) {
      if (obstacle.neighbors[0].obstacle) {
        point1x = obstacle.posX + 50
        point1y = obstacle.posY
        point2x = obstacle.posX + 50
        point2y = obstacle.posY + 50
        point1offsetX = point1x - 50
        point1offsetY = point1y 
        point2offsetX = point2x - 50
        point2offsetY = point2y
      } else if (obstacle.neighbors[1].obstacle) {
        point1x = obstacle.posX
        point1y = obstacle.posY
        point2x = obstacle.posX + 50
        point2y = obstacle.posY
        point1offsetX = point1x 
        point1offsetY = point1y + 50
        point2offsetX = point2x 
        point2offsetY = point2y + 50
      } else {
        point1x = obstacle.posX
        point1y = obstacle.posY
        point2x = obstacle.posX + 50
        point2y = obstacle.posY + 50
        point1offsetX = point1x 
        point1offsetY = point1y + 50
        point2offsetX = point2x 
        point2offsetY = point2y + 50
      }
    } else if (bottomRightQuadrant) {
      if (obstacle.neighbors[3].obstacle) {
        point1x = obstacle.posX
        point1y = obstacle.posY
        point2x = obstacle.posX + 50
        point2y = obstacle.posY
        point1offsetX = point1x
        point1offsetY = point1y + 50
        point2offsetX = point2x
        point2offsetY = point2y + 50
      } else if (obstacle.neighbors[0].obstacle) {
        point1x = obstacle.posX
        point1y = obstacle.posY
        point2x = obstacle.posX
        point2y = obstacle.posY + 50
        point1offsetX = point1x + 50
        point1offsetY = point1y 
        point2offsetX = point2x + 50
        point2offsetY = point2y 
      } else {
        point1x = obstacle.posX
        point1y = obstacle.posY + 50
        point2x = obstacle.posX + 50
        point2y = obstacle.posY
        point1offsetX = point1x + 50
        point1offsetY = point1y 
        point2offsetX = point2x + 50
        point2offsetY = point2y 
      }
    } else if (topLeftQuadrant) {
      if (obstacle.neighbors[1].obstacle) {
        point1x = obstacle.posX
        point1y = obstacle.posY + 50
        point2x = obstacle.posX + 50
        point2y = obstacle.posY + 50
        point1offsetX = point1x 
        point1offsetY = point1y - 50
        point2offsetX = point2x 
        point2offsetY = point2y - 50
      } else if (obstacle.neighbors[2].obstacle) {
        point1x = obstacle.posX + 50
        point1y = obstacle.posY
        point2x = obstacle.posX + 50
        point2y = obstacle.posY + 50
        point1offsetX = point1x - 50
        point1offsetY = point1y 
        point2offsetX = point2x - 50
        point2offsetY = point2y 
      } else {
        point1x = obstacle.posX
        point1y = obstacle.posY + 50
        point2x = obstacle.posX + 50
        point2y = obstacle.posY
        point1offsetX = point1x - 50
        point1offsetY = point1y 
        point2offsetX = point2x - 50
        point2offsetY = point2y 
      }
    } else if (topRightQuadrant) {
      if (obstacle.neighbors[3].obstacle) {
        point1x = obstacle.posX
        point1y = obstacle.posY + 50
        point2x = obstacle.posX + 50
        point2y = obstacle.posY + 50
        point1offsetX = point1x 
        point1offsetY = point1y - 50
        point2offsetX = point2x 
        point2offsetY = point2y - 50
      } else if (obstacle.neighbors[2].obstacle) {
        point1x = obstacle.posX
        point1y = obstacle.posY
        point2x = obstacle.posX
        point2y = obstacle.posY + 50
        point1offsetX = point1x + 50
        point1offsetY = point1y 
        point2offsetX = point2x + 50
        point2offsetY = point2y 
      } else {
        point1x = obstacle.posX
        point1y = obstacle.posY
        point2x = obstacle.posX + 50
        point2y = obstacle.posY + 50
        point1offsetX = point1x + 50
        point1offsetY = point1y 
        point2offsetX = point2x + 50
        point2offsetY = point2y 
      }
    }

    const obstacle1 = this.checkForObstacle(cell.posX + 25, cell.posY + 25, point1x, point1y, obstacle)
    const obstacle2 = this.checkForObstacle(cell.posX + 25, cell.posY + 25, point2x, point2y, obstacle)

    if (obstacle1 && obstacle2) {
      return
    } else {
      console.log(cell.id)
      const object = {
        playerPointX: cell.posX + 25, 
        playerPointY: cell.posY + 25,
        obstaclePoint1X: point1x,
        obstaclePoint1Y: point1y,
        obstaclePoint2X: point2x,
        obstaclePoint2Y: point2y,
        point1offsetX,
        point1offsetY,
        point2offsetX,
        point2offsetY,
        obstacle: obstacle
      }
      console.log(object)
      this.visibleCell[cell.id].push(object)
    }
  }

  private checkForObstacle(centerX: number, centerY: number, pointX: number, pointY: number, obstacle: Cell): boolean {
    const assetCell = this.gridService.getGridCellByCoordinate(centerX, centerY)

    


    const upLine = assetCell.x === obstacle.x && assetCell.y > obstacle.y
    const rightLine = assetCell.y === obstacle.y && assetCell.x < obstacle.x
    const downLine = assetCell.x === obstacle.x && assetCell.y < obstacle.y
    const leftLine = assetCell.y === obstacle.y && assetCell.x > obstacle.x
    const bottomRightQuadrant = centerX < pointX && centerY < pointY
    const bottomLeftQuadrant = centerX > pointX && centerY < pointY
    const topRightQuadrant = centerX < pointX && centerY > pointY
    const topLeftQuadrant = centerX > pointX && centerY > pointY
    
    if (upLine) {
      return this.traceStraitLine(assetCell, obstacle, 0)
    } else if (rightLine) {
      return this.traceStraitLine(assetCell, obstacle, 1)
    } else if (downLine) {
      return this.traceStraitLine(assetCell, obstacle, 2)
    } else if (leftLine) {
      return this.traceStraitLine(assetCell, obstacle, 3)
    } else if (bottomRightQuadrant) {
      const xRatioMultiplier = 1
      const yRatioMultiplier = 1
      const yLength = pointY - centerY
      const xLength = pointX - centerX

      return this.traceLine(xRatioMultiplier, yRatioMultiplier, yLength, xLength, centerX, centerY, pointX, pointY, obstacle)
    } else if (topRightQuadrant) {
      const xRatioMultiplier = 1
      const yRatioMultiplier = -1
      const yLength = centerY - pointY
      const xLength = pointX - centerX

      return this.traceLine(xRatioMultiplier, yRatioMultiplier, yLength, xLength, centerX, centerY, pointX, pointY, obstacle)
    } else if (topLeftQuadrant) {
      const xRatioMultiplier = -1
      const yRatioMultiplier = -1
      const yLength = centerY - pointY
      const xLength = centerX - pointX

      return this.traceLine(xRatioMultiplier, yRatioMultiplier, yLength, xLength, centerX, centerY, pointX, pointY, obstacle)
    } else if (bottomLeftQuadrant) {
      const xRatioMultiplier = -1
      const yRatioMultiplier = 1
      const yLength = pointY - centerY
      const xLength = centerX - pointX

      return this.traceLine(xRatioMultiplier, yRatioMultiplier, yLength, xLength, centerX, centerY, pointX, pointY, obstacle)
    } 

    return false
  }

  private traceLine(xRatioMultiplier: number, yRatioMultiplier: number, yLength: number, xLength: number, centerX: number, centerY: number, pointX: number, pointY: number, obstacle: Cell): boolean {
    const yRatio = yLength / 25
    const xRatio = xLength / 25

    let checkLocationY = centerY
    let checkLocationX = centerX

    let reachedDestination = false
    let foundObstacle = false

    while (!reachedDestination) {
      checkLocationX += (xRatio * xRatioMultiplier)
      checkLocationY += (yRatio * yRatioMultiplier)

      if (checkLocationX === pointX && checkLocationY === pointY) {
        reachedDestination = true
      } else {
        try {
        const cell = this.gridService.getGridCellByCoordinate(checkLocationX, checkLocationY)
        foundObstacle = cell.obstacle
        if (foundObstacle) {
          reachedDestination = true
        }
       } catch (e) {
         console.log(e, checkLocationX, checkLocationY)
       }

      }
    }

    return foundObstacle
  }

  private traceStraitLine(assetCell: Cell, obstacle: Cell, direction: number): boolean {

    if (assetCell.neighbors[direction].obstacle ) { 
      return assetCell.neighbors[direction].id !== obstacle.id
    }

        
    if (assetCell.id === obstacle.id) {
      return false
    } else {
      return this.traceStraitLine(assetCell.neighbors[direction], obstacle, direction)
    }
  }

}