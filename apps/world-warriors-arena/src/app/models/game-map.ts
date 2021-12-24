import { LargeCanvasImage } from "../painters/large-image.paint"
import { MotionAsset } from "./assets.model"
import { Cell, DefaultMapSettings } from "./cell.model"

export class GameMap {
  public id? = "1"
  public name? = "newGrid"
  public height = 15
  public width = 15
  public grid: { [cell: string]: Cell } = {}
  public defaultSettings: DefaultMapSettings
  public gridDisplay: Cell[][] = [];
  public widthPx = 0
  public heightPx = 0
  public gridLoaded = false
  public includeGridLines = false
  public largeImage: LargeCanvasImage
  public selectedGameComponent: MotionAsset

  public changePageXOffset: number
  public changePageYOffset: number

  constructor(width: number, height: number, defaultMapSettings: DefaultMapSettings) {
    this.width = width
    this.height = height
    this.defaultSettings = defaultMapSettings
    this.generateGridFeatures()
    this.gridLoaded = true
  }
  
  public getGridCellByCoordinate(x: number, y: number): Cell {
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
  
  private generateGridFeatures() {
    this.createDisplayArray()
    this.addNeighbors()
  }

  private createDisplayArray() {
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
            obstacle: this.defaultSettings.inverted ? true : false,
            id: `x${l}:y${i}`,
            spriteTypeId: this.defaultSettings.inverted ? this.defaultSettings.terrainTypeId : undefined
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