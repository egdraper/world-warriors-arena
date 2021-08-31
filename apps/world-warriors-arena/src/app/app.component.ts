import { Component } from '@angular/core';
import { CanvasService } from './canvas/canvas.service';
import { Engine } from './engine/engine';
import { AssetsService } from './game-assets/assets.service';
import { Cell } from './models/cell.model';
import { GridService } from './grid/grid.service';

@Component({
  selector: 'world-warriors-arena-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public selectedCell: Cell
  constructor(
    private engine: Engine,
    private assetService: AssetsService,
    private canvasService: CanvasService,
    public grid: GridService,
  ) {
    this.grid.createGrid(15, 15)
  }

  public ngOnInit(): void {
    this.engine.startEngine()
  }

  public ngAfterViewInit(): void {
    this.canvasService.drawGrid()
  }

  public onAddCharacterClick(): void {
    this.assetService.addCharacter()
  }

  public onGridClick(event: { clickX: number, clickY: number }): void {
    this.selectedCell = this.grid.getGridCellByCoordinate(event.clickX, event.clickY)
    const startCell = this.grid.getGridCellByCoordinate(300, 300)
    this.traceCell(startCell, this.selectedCell)
    // this.selectedCell = this.grid.getGridCellByCoordinate(event.clickX, event.clickY)

    // if (this.selectedCell.occupiedBy) {
    //   const character = this.selectedCell.occupiedBy
    //   this.assetService.gameComponents.forEach(asset => asset.selectionIndicator = undefined)
    //   this.assetService.selectedGameComponent = character
    //   this.assetService.selectedGameComponent.selectCharacter()
    // } else {
    //   if(this.assetService.selectedGameComponent) {
    //     this.assetService.selectedGameComponent.startMovement(this.assetService.selectedGameComponent.cell, this.selectedCell, this.assetService.gameComponents)
    //   }
    // //   this.assetService.addClickAnimation(this.selectedCell, `../../../assets/images/DestinationX.png`)
    // }
  }

  private traceCell(cell: Cell, obstacle: Cell): void {
    const ctx = this.canvasService.backgroundCTX
    ctx.beginPath();
    ctx.moveTo(cell.posX + 25, cell.posY + 25);

    let point1x
    let point1y

    let point2x
    let point2y
    if (cell.posX === obstacle.posX && cell.posY < obstacle.posY) {
      point1x = obstacle.posX
      point1y = obstacle.posY + 50
      point2x = obstacle.posX + 50
      point2y = obstacle.posY + 50
    } else if (cell.posX === obstacle.posX && cell.posY > obstacle.posY) {
      point1x = obstacle.posX
      point1y = obstacle.posY
      point2x = obstacle.posX + 50
      point2y = obstacle.posY
    } else if (cell.posY === obstacle.posY && cell.posX > obstacle.posX) {
      point1x = obstacle.posX
      point1y = obstacle.posY
      point2x = obstacle.posX
      point2y = obstacle.posY + 50
    } else if (cell.posY === obstacle.posY && cell.posX < obstacle.posX) {
      point1x = obstacle.posX + 50
      point1y = obstacle.posY
      point2x = obstacle.posX + 50
      point2y = obstacle.posY + 50
    } else if (cell.posX > obstacle.posX && cell.posY < obstacle.posY) {
      if (obstacle.neighbors[0].obstacle) {
        point1x = obstacle.posX + 50
        point1y = obstacle.posY
        point2x = obstacle.posX + 50
        point2y = obstacle.posY + 50
      } else if (obstacle.neighbors[1].obstacle) {
        point1x = obstacle.posX
        point1y = obstacle.posY
        point2x = obstacle.posX + 50
        point2y = obstacle.posY
      } else {
        point1x = obstacle.posX
        point1y = obstacle.posY
        point2x = obstacle.posX + 50
        point2y = obstacle.posY + 50
      }
    } else if (cell.posX < obstacle.posX && cell.posY < obstacle.posY) {
      if (obstacle.neighbors[3].obstacle) {
        point1x = obstacle.posX
        point1y = obstacle.posY
        point2x = obstacle.posX + 50
        point2y = obstacle.posY
      } else if (obstacle.neighbors[0].obstacle) {
        point1x = obstacle.posX
        point1y = obstacle.posY
        point2x = obstacle.posX
        point2y = obstacle.posY + 50
      } else {
        point1x = obstacle.posX
        point1y = obstacle.posY + 50
        point2x = obstacle.posX + 50
        point2y = obstacle.posY
      }
    } else if (cell.posX > obstacle.posX && cell.posY > obstacle.posY) {
      if (obstacle.neighbors[1].obstacle) {
        point1x = obstacle.posX 
        point1y = obstacle.posY + 50
        point2x = obstacle.posX + 50
        point2y = obstacle.posY + 50
      } else if (obstacle.neighbors[2].obstacle) {
        point1x = obstacle.posX + 50
        point1y = obstacle.posY
        point2x = obstacle.posX + 50
        point2y = obstacle.posY + 50
      } else {
        point1x = obstacle.posX
        point1y = obstacle.posY + 50
        point2x = obstacle.posX + 50
        point2y = obstacle.posY
      }
    } else if (cell.posX < obstacle.posX && cell.posY > obstacle.posY) {
      if (obstacle.neighbors[3].obstacle) {
        point1x = obstacle.posX
        point1y = obstacle.posY + 50
        point2x = obstacle.posX + 50
        point2y = obstacle.posY + 50
      } else if (obstacle.neighbors[2].obstacle) {
        point1x = obstacle.posX
        point1y = obstacle.posY
        point2x = obstacle.posX
        point2y = obstacle.posY + 50
      } else {
        point1x = obstacle.posX
        point1y = obstacle.posY
        point2x = obstacle.posX + 50
        point2y = obstacle.posY + 50
      }
    }

    const obstacle1 = this.checkForObstacle(cell.posX + 25, cell.posY + 25, point1x, point1y, obstacle)
    const obstacle2 = this.checkForObstacle(cell.posX + 25, cell.posY + 25, point2x, point2y, obstacle)

    if (obstacle1 && obstacle2) {
      return
    } else {
      ctx.lineTo(point1x, point1y);
      ctx.lineTo(point2x, point2y);
      ctx.lineTo(cell.posX + 25, cell.posY + 25);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = "black";
      ctx.fill();
    }
  }

  private checkForObstacle(centerX: number, centerY: number, pointX: number, pointY: number, obstacle: Cell): boolean {
    if (centerX < pointX && centerY < pointY) {
      const ylength = pointY - centerY
      const xLength = pointX - centerX
      console.log(ylength + "/" + xLength)
      console.log(ylength / 25 + "/" + xLength / 25)
      console.log(ylength / 5 + "/" + xLength / 5)

      const yRatio = ylength / 25
      const xRatio = xLength / 25

      let checkLocationY = centerY
      let checkLocationX = centerX

      let reachedDestination = false
      let foundObstacle = false

      while (!reachedDestination) {
        checkLocationX += xRatio
        checkLocationY += yRatio

        if (checkLocationX > pointX && checkLocationY > pointY) {
          reachedDestination = true
        } else {
          const cell = this.grid.getGridCellByCoordinate(checkLocationX, checkLocationY)
          console.log(obstacle.neighbors[0].id + "---" + cell.id)

          foundObstacle = cell.obstacle
          if (foundObstacle) {
            reachedDestination = true
          }

        }
      }

      return foundObstacle
    } else if (centerX < pointX && centerY > pointY) {
      const ylength = centerY - pointY
      const xLength = pointX - centerX
      console.log(ylength + "/" + xLength)
      console.log(ylength / 25 + "/" + xLength / 25)
      console.log(ylength / 5 + "/" + xLength / 5)

      const yRatio = ylength / 25
      const xRatio = xLength / 25

      let checkLocationY = centerY
      let checkLocationX = centerX

      let reachedDestination = false
      let foundObstacle = false

      while (!reachedDestination) {
        checkLocationX += xRatio
        checkLocationY -= yRatio

        if (checkLocationX === pointX && checkLocationY === pointY) {
          reachedDestination = true
        } else {
          const cell = this.grid.getGridCellByCoordinate(checkLocationX, checkLocationY)
          foundObstacle = cell.obstacle

          if (foundObstacle) {
            reachedDestination = true
          }
        }
      }

      return foundObstacle
    } else if (centerX > pointX && centerY > pointY) {
      const ylength = centerY - pointY
      const xLength = centerX - pointX
      console.log(ylength + "/" + xLength)
      console.log(ylength / 25 + "/" + xLength / 25)
      console.log(ylength / 5 + "/" + xLength / 5)

      const yRatio = ylength / 25
      const xRatio = xLength / 25

      let checkLocationY = centerY
      let checkLocationX = centerX

      let reachedDestination = false
      let foundObstacle = false

      while (!reachedDestination) {
        checkLocationX -= xRatio
        checkLocationY -= yRatio

        if (checkLocationX === pointX && checkLocationY === pointY) {
          reachedDestination = true
        } else {
          const cell = this.grid.getGridCellByCoordinate(checkLocationX, checkLocationY)
          foundObstacle = cell.obstacle

          if (foundObstacle) {
            reachedDestination = true
          }
        }
      }

      return foundObstacle
    } else if (centerX > pointX && centerY < pointY) {
      const ylength = pointY - centerY
      const xLength = centerX - pointX
      console.log(ylength + "/" + xLength)
      console.log(ylength / 25 + "/" + xLength / 25)
      console.log(ylength / 5 + "/" + xLength / 5)

      const yRatio = ylength / 25
      const xRatio = xLength / 25

      let checkLocationY = centerY
      let checkLocationX = centerX

      let reachedDestination = false
      let foundObstacle = false

      while (!reachedDestination) {
        checkLocationX -= xRatio
        checkLocationY += yRatio

        if (checkLocationX === pointX && checkLocationY === pointY) {
          reachedDestination = true
        } else {
          const cell = this.grid.getGridCellByCoordinate(checkLocationX, checkLocationY)
          foundObstacle = cell.obstacle

          if (foundObstacle) {
            reachedDestination = true
          }
        }
      }

      return foundObstacle
    }

    return false
  }
}
