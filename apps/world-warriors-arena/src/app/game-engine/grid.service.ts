import { Injectable } from '@angular/core';
import { CanvasService } from '../canvas/canvas.service';
import { MotionAsset } from '../models/assets.model';
import { Cell, GridDetails, RelativePositionCell } from '../models/cell.model';
import { LargeCanvasImage } from './draw-tools/large-image';

export class Grid {
  public id? = "1"
  public name? = "newGrid"
  public height = 15
  public width = 15
  public grid: { [cell: string]: Cell } = {}
  public gridDisplayLite: GridDetails
  public gridDisplay: Cell[][] = [];
  public widthPx = 0
  public heightPx = 0
  public inverted = true
  public gridDirty = false
  public gridLoaded = false
  public includeGridLines = false
  public largeImage: LargeCanvasImage
  public drawBlackoutImage = false
  public selectedGameComponent: MotionAsset

  constructor(gridDetails: GridDetails) {
    this.height = gridDetails.height
    this.width = gridDetails.width
  }
  
  public getGridCellByCoordinate(x: number, y: number): Cell {
    // while (x % (32 * GameSettings.scale) !== 0) {
    //   x--
    // }
    // while (y % (32 * GameSettings.scale) !== 0) {
    //   y--
    // }
    while (x % (32 * 1) !== 0) {
      x--
    }
    while (y % (32 * 1) !== 0) {
      y--
    }
    return this.grid[`x${x / (32 * 1)}:y${y / (32 * 1)}`]
  }

  public getCell(x: number, y: number): Cell {
    return this.grid[`x${x}:y${y}`]
  }
}

@Injectable()
export class GridService {
  public grids: {[gridId: string]: Grid} = {}
  public gridIds: string[] = []
  public activeGrid: Grid
  public hoveringCell: Cell

  private index = 0

  constructor(private canvasService: CanvasService) { }

  public switchGrid(gridId: string): Grid {
    this.activeGrid = this.grids[gridId]
    this.canvasService.resetViewport()
    
    return this.activeGrid
  }

  public createNewGrid(width: number, height: number, invertedDrawableTerrainId?: string, inverted: boolean = false) {
    const gridDetails: GridDetails = {
      width,
      height,
    }

    // Grid Setup
    const newGrid = new Grid(gridDetails)
    newGrid.largeImage = new LargeCanvasImage(this.canvasService.drawingCanvas, this.canvasService.drawingCTX)
    newGrid.inverted = inverted
    this.generateGrid(newGrid, invertedDrawableTerrainId)
    newGrid.gridLoaded = true
    newGrid.id = this.index.toString()
    // Set Grid
    this.gridIds.push(this.index.toString())
    this.grids[(this.index++).toString()] = newGrid
    this.activeGrid = newGrid
    this.canvasService.resetViewport()
    
  }
  
  private generateGrid(grid: Grid, invertedDrawableTerrainId?: string, name: string = "No Name") {
    grid.gridDisplayLite = {
      height: grid.height,
      width: grid.width,
      name
    }
    this.createDisplayArray(grid, invertedDrawableTerrainId)
    this.addNeighbors(grid)
  }

  private createDisplayArray(grid: Grid, invertedDrawableTerrainId?: string) {
    let imgIndexX = 1
    let imgIndexY = 1

    for (let i = 0; i < grid.height; i++) {
      grid.gridDisplay[i] = [];

      for (let l = 0; l < grid.width; l++) {
        grid.grid[`x${l}:y${i}`] = grid && grid.grid[`x${l}:y${i}`]
          ? grid.grid[`x${l}:y${i}`]
          : {
            x: l,
            y: i,
            posX: l * 32,
            posY: i * 32,
            obstacle: grid.inverted ? true : false,
            id: `x${l}:y${i}`,
            growableTileId: grid.inverted ? invertedDrawableTerrainId : undefined
          };

        imgIndexX++

        if (imgIndexX > 3 && imgIndexY < 3) {
          imgIndexX = 1
          imgIndexY++
        } else if (imgIndexX > 3 && imgIndexY >= 3) {
          imgIndexX = 1
          imgIndexY = 1
        }
        grid.gridDisplay[i][l] = grid.grid[`x${l}:y${i}`];
      }
    }
  }

  private addNeighbors(grid: Grid) {
    for (let i = 0; i < grid.height; i++) {
      for (let l = 0; l < grid.width; l++) {
        const cell = grid.grid[`x${l}:y${i}`];
        cell.neighbors = [];
        cell.neighbors[5] = grid.grid[`x${l + 1}:y${i + 1}`];
        cell.neighbors[0] = grid.grid[`x${l}:y${i - 1}`];
        cell.neighbors[2] = grid.grid[`x${l}:y${i + 1}`];
        cell.neighbors[4] = grid.grid[`x${l + 1}:y${i - 1}`];
        cell.neighbors[1] = grid.grid[`x${l + 1}:y${i}`];
        cell.neighbors[6] = grid.grid[`x${l - 1}:y${i + 1}`];
        cell.neighbors[3] = grid.grid[`x${l - 1}:y${i}`];
        cell.neighbors[7] = grid.grid[`x${l - 1}:y${i - 1}`];
      }
    }
  }
}