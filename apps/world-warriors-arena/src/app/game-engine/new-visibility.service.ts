import { Injectable } from "@angular/core";
import { GridService } from "./grid.service";
import { Cell, Point } from "../models/cell.model";

@Injectable()
export class NewFogOfWarService {
  public visibleCell = new Set<{ id: string, x: number, y: number }>()
  public visitedVisibleCell: { [id: string]: Cell[] } = {}
  public fogEnabled: boolean = false
  public edgeCells: Cell[] = []
  
  public visitedCells = new Set<Cell>()
  public nonObstructedCells: { [id: string]: Set<Cell> } = {}
  public fogOfWarRimPoints: { [id: string]: Cell[] } = {}
  public blackOutRimPoints: Array<Cell> = []

  constructor(
    private gridService: GridService
  ) { }

  public createCellLines(): void {
    this.findVisibleCellsEdges()
    this.gridService.activeGrid.gridDisplay.forEach(row => {
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


      const checkedCell = this.gridService.activeGrid.getGridCellByCoordinate(checkLocationX, checkLocationY)
      if (this.gridService.activeGrid.getGridCellByCoordinate(checkLocationX, checkLocationY)?.id === edgeCell.id) {
        reachedDestination = true
      } else {
        try {
          if (!checkedCell) {
            this.fogOfWarRimPoints[assetCell.id].push(null)
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
      if(checkedCell && assetCell) {
        if(!this.nonObstructedCells[assetCell.id]) { this.nonObstructedCells[assetCell.id] = new Set()}
        this.nonObstructedCells[assetCell.id].add(checkedCell)
      }
    }

    return foundObstacle
  }

  private traceStraitLine(assetCell: Cell, nextCell: Cell, edgeCell: Cell, direction: number): void {
    if (!nextCell) {
      this.fogOfWarRimPoints[assetCell.id].push(null)
      return
    }
    if (nextCell.obstacle) {
      this.addCenterPointForTracing(assetCell, nextCell, edgeCell)
      return
    } else {
      this.traceStraitLine(assetCell, nextCell.neighbors[direction], edgeCell, direction)
    }

  }

  private addCenterPointForTracing(centerCell: Cell, obstacleCell: Cell, edgeCell: Cell): void {
    let adjustmentY = 0
    let adjustmentX = 0
    if (centerCell.y > obstacleCell.y) {
      adjustmentY = -96
    }
    if (centerCell.x > obstacleCell.x) {
      adjustmentX = -64
    }
    if (centerCell.x < obstacleCell.x) {
      adjustmentX = 64
    }

    if (!this.fogOfWarRimPoints[centerCell.id].find(a => a && obstacleCell.id === a.id)) {
      obstacleCell.fogPointX = obstacleCell.posX + 16 + adjustmentX
      obstacleCell.fogPointY = obstacleCell.posY + 16 + adjustmentY
      this.fogOfWarRimPoints[centerCell.id].push(obstacleCell)
    }
  }


  public findVisibleCellsEdges(): void {
    this.edgeCells = []
    for (let a = 0; a <= this.gridService.activeGrid.width; a++) {
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



export class PointFinder {
  private static INF = 10000;
  // Driver Code

  public static check(point: Point, polygon: Point[]) {
    let size = polygon.length;

    if (this.isInside(polygon, size, point)) {
      console.log(JSON.stringify(point) + "Yes");
    }
    else {
      console.log(JSON.stringify(point) + "No");
    }
  }


  private static isInside(polygon: any[], length: number, point: Point) {
    // There must be at least 3 vertices in polygon[]
    if (length < 3) {
      return false;
    }
    // Create a point for line segment from p to infinite

    let extreme = new Point("XX", "xx", this.INF, point.y);
    // Count intersections of the above line
    // with sides of polygon
    let count = 0
    let i = 0;

    do {
      let next = (i + 1) % length;
      // Check if the line segment from 'p' to
      // 'extreme' intersects with the line
      // segment from 'polygon[i]' to 'polygon[next]'
      if (this.doIntersect(polygon[i], polygon[next], point, extreme)) {
        // If the point 'p' is colinear with line
        // segment 'i-next', then check if it lies
        // on segment. If it lies, return true, otherwise false
        if (this.orientation(polygon[i], point, polygon[next]) == 0) {
          return this.onSegment(polygon[i], point,
            polygon[next]);
        }
        count++;
      }
      i = next;
    } while (i != 0);
    // Return true if count is odd, false otherwise
    return (count % 2 == 1); // Same as (count%2 == 1)
  }

  private static onSegment(point1: Point, nextPoint: Point, variablePoint: Point) {
    if (nextPoint.x <= Math.max(point1.x, variablePoint.x) &&
      nextPoint.x >= Math.min(point1.x, variablePoint.x) &&
      nextPoint.y <= Math.max(point1.y, variablePoint.y) &&
      nextPoint.y >= Math.min(point1.y, variablePoint.y)) {
      return true;
    }
    return false;
  }

  private static orientation(point1: Point, nextPoint: Point, variablePoint: Point) {
    let val = (nextPoint.y - point1.y) * (variablePoint.x - nextPoint.x)
      - (nextPoint.x - point1.x) * (variablePoint.y - nextPoint.y);
    if (val == 0) {
      return 0; // collinear
    }
    return (val > 0) ? 1 : 2; // clock or counterclock wise
  }

  private static doIntersect(point1: Point, pointNext: Point, checkPoint: Point, extreme: Point) {
    // Find the four orientations needed for
    // general and special cases
    let o1 = this.orientation(point1, pointNext, checkPoint);
    let o2 = this.orientation(point1, pointNext, extreme);
    let o3 = this.orientation(checkPoint, extreme, point1);
    let o4 = this.orientation(checkPoint, extreme, pointNext);
    // General case
    if (o1 != o2 && o3 != o4) {
      return true;
    }
    // Special Cases
    // p1, q1 and p2 are collinear and
    // p2 lies on segment p1q1
    if (o1 == 0 && this.onSegment(point1, checkPoint, pointNext)) {
      return true;
    }
    // p1, q1 and p2 are collinear and
    // q2 lies on segment p1q1
    if (o2 == 0 && this.onSegment(point1, extreme, pointNext)) {
      return true;
    }
    // p2, q2 and p1 are collinear and
    // p1 lies on segment p2q2
    if (o3 == 0 && this.onSegment(checkPoint, point1, extreme)) {
      return true;
    }
    // p2, q2 and q1 are collinear and
    // q1 lies on segment p2q2
    if (o4 == 0 && this.onSegment(checkPoint, pointNext, extreme)) {
      return true;
    }
    // Doesn't fall in any of the above cases
    return false;
  }
}
