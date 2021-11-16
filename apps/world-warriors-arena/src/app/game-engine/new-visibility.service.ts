import { Injectable } from "@angular/core";
import { GridService } from "./grid.service";
import { Cell } from "../models/cell.model";

@Injectable()
export class NewFogOfWarService {
  public visibleCell: { [id: string]: Cell[] } = {}
  public visitedVisibleCell: { [id: string]: Cell[] } = {}
  public fogEnabled: boolean = false
  public centerPoint: { [id: string]: { id: string, x: number, y: number }[] } = {}
  public edgeCells: Cell[] = []

  constructor(
    private gridService: GridService
  ) { }


  public createCellLines(): void {
    this.findVisibleCellsEdges()
    this.gridService.activeGrid.gridDisplay.forEach(row => {
      row.forEach(cell => {
        if (!cell.obstacle) {
          console.log(cell.id)
          this.visibleCell[cell.id] = []
          this.centerPoint[cell.id] = []
          this.visibleCell[cell.id].push(cell)
          this.edgeCells.forEach(edgeCell => {
            this.checkForObstacle(cell, edgeCell)
          })


          const cleanSet = new Set(this.centerPoint[cell.id])
          this.centerPoint[cell.id] = Array.from(cleanSet)

        }
      })
    })
  }

  // private revealObstacle(targetCell: Cell): void {
  //   const cells = this.visibleCell[targetCell.id]
  //   cells.forEach(cell => { 
  //     if(cell.obstacle) {
  //       for(let i = 0; cell.imageTile.tileHeight
  //       this.visibleCell[targetCell.id].push(this.gridService.activeGrid.getCell(`x${}:y${cell.obstacle.y}`))
  //     }

  //   })

  // }

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


      if (this.gridService.activeGrid.getGridCellByCoordinate(checkLocationX, checkLocationY)?.id === edgeCell.id) {
        reachedDestination = true
      } else {
        try {
          const checkedCell = this.gridService.activeGrid.getGridCellByCoordinate(checkLocationX, checkLocationY)
          if (!checkedCell) {
            this.centerPoint[assetCell.id].push(null)
            reachedDestination = true
          } else {
            // const visibleCells = this.visibleCell[assetCell.id]

            // if(!visibleCells.find(vc => vc.id === checkedCell.id)) {
            //   this.visibleCell[assetCell.id].push(checkedCell)
            // }           


            // for (let i = 0; i < 8; i++) {
            //   if (checkedCell.neighbors[i] && !this.visibleCell[assetCell.id].find(cell => cell.id === checkedCell.neighbors[i].id)) {
            //     this.visibleCell[assetCell.id].push(checkedCell.neighbors[i])
            //   }
            // }
            if (checkedCell.obstacle) {
              let adjustmentY = 0
              let adjustmentX = 0
              if(edgeCell.y === 0) {
                adjustmentY = -96
              }
              if(edgeCell.x === 0) {
                adjustmentX = -64
              }
              if(edgeCell.x > 1) {
                adjustmentX = 64
              }

              if (!this.centerPoint[assetCell.id].find(a => a && checkedCell.id === a.id)) {
                this.centerPoint[assetCell.id].push({ id: checkedCell.id, x: checkedCell.posX + 16 + adjustmentX, y: checkedCell.posY + 16 + adjustmentY })
              }
              reachedDestination = true
            }
          }
        


        } catch (e) {
        console.log(e, checkLocationX, checkLocationY)
      }

    }
  }

    return foundObstacle
  }

  private traceStraitLine(assetCell: Cell, nextCell: Cell, obstacle: Cell, direction: number): void {
  // if (!nextCell) { return }

  // if (!this.visibleCell[assetCell.id].find(cCell => nextCell.id === cCell.id)) {
  //   this.visibleCell[assetCell.id].push(nextCell)

  //   for (let i = 0; i < 8; i++) {
  //     if (nextCell.neighbors[i] && !this.visibleCell[assetCell.id].find(cell => cell.id === nextCell.neighbors[i].id)) {
  //       this.visibleCell[assetCell.id].push(nextCell.neighbors[i])
  //     }
  //   }
  // }
  // if (!nextCell || nextCell.obstacle) {
  //   return
  // } else {
  //   this.traceStraitLine(assetCell, nextCell.neighbors[direction], obstacle, direction)
  // }

}


  public findVisibleCellsEdges(): void {
  this.edgeCells = []
    for(let a = 0; a <= this.gridService.activeGrid.width; a++) {
  this.edgeCells.push(this.gridService.activeGrid.getCell(a, 0))
}
for (let a = 0; a < this.gridService.activeGrid.height; a++) {
  this.edgeCells.push(this.gridService.activeGrid.getCell(this.gridService.activeGrid.width - 1, a))
}
for (let a = this.gridService.activeGrid.width - 1; a >= 0; a--) {
  this.edgeCells.push(this.gridService.activeGrid.getCell(a, this.gridService.activeGrid.height - 1))
}
for (let a = this.gridService.activeGrid.height; a >= 0; a--) {
  this.edgeCells.push(this.gridService.activeGrid.getCell(0, a))
}
this.edgeCells = this.edgeCells.filter(a => a)
  }
}