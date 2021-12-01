import { Injectable } from '@angular/core';
import { CanvasService } from '../canvas/canvas.service';
import { MotionAsset } from '../models/assets.model';
import { Cell, GridDetails, RelativePositionCell } from '../models/cell.model';
import { LargeCanvasImage } from './draw-tools/painters/large-image.paint';

export class Grid {
  public id? = "1"
  public name? = "newGrid"
  public height = 15
  public width = 15
  public grid: { [cell: string]: Cell } = {}
  public gridDetails: GridDetails
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

  constructor(gridDetails: GridDetails, defaultTerrainId: string, inverted?: boolean) {
    this.height = gridDetails.height
    this.width = gridDetails.width

    this.inverted = inverted
    this.generateGrid(defaultTerrainId)
    this.gridLoaded = true
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

  
  public generateGrid(defaultTerrainId?: string, name: string = "No Name") {
    this.createDisplayArray(defaultTerrainId)
    this.addNeighbors()
  }

  private createDisplayArray(invertedDrawableTerrainId?: string) {
    let imgIndexX = 1
    let imgIndexY = 1

    for (let i = 0; i < this.height; i++) {
      this.gridDisplay[i] = [];

      for (let l = 0; l < this.width; l++) {
        this.grid[`x${l}:y${i}`] = this.grid[`x${l}:y${i}`]
          || {
            x: l,
            y: i,
            posX: l * 32,
            posY: i * 32,
            obstacle: this.inverted ? true : false,
            id: `x${l}:y${i}`,
            growableTileId: this.inverted ? invertedDrawableTerrainId : undefined
          };

        imgIndexX++

        if (imgIndexX > 3 && imgIndexY < 3) {
          imgIndexX = 1
          imgIndexY++
        } else if (imgIndexX > 3 && imgIndexY >= 3) {
          imgIndexX = 1
          imgIndexY = 1
        }
        this.gridDisplay[i][l] = this.grid[`x${l}:y${i}`];
      }
    }
  }

  private addNeighbors() {
    for (let i = 0; i < this.height; i++) {
      for (let l = 0; l < this.width; l++) {
        const cell = this.grid[`x${l}:y${i}`];
        cell.neighbors = [];
        cell.neighbors[5] = this.grid[`x${l + 1}:y${i + 1}`];
        cell.neighbors[0] = this.grid[`x${l}:y${i - 1}`];
        cell.neighbors[2] = this.grid[`x${l}:y${i + 1}`];
        cell.neighbors[4] = this.grid[`x${l + 1}:y${i - 1}`];
        cell.neighbors[1] = this.grid[`x${l + 1}:y${i}`];
        cell.neighbors[6] = this.grid[`x${l - 1}:y${i + 1}`];
        cell.neighbors[3] = this.grid[`x${l - 1}:y${i}`];
        cell.neighbors[7] = this.grid[`x${l - 1}:y${i - 1}`];
      }
    }
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

  public createNewGrid(width: number, height: number, defaultTerrainId?: string, inverted: boolean = false): void {
    const gridDetails: GridDetails = {
      width,
      height,
    }

    // Grid Setup
    const newGrid = new Grid(gridDetails, defaultTerrainId, inverted)
    
    newGrid.largeImage = new LargeCanvasImage(this.canvasService.drawingCanvas, this.canvasService.drawingCTX)
    newGrid.id = this.index.toString()
   
    // Set Grid
    this.gridIds.push(newGrid.id)
    this.grids[newGrid.id] = newGrid
    this.activeGrid = newGrid
    this.canvasService.resetViewport()
  }  
}