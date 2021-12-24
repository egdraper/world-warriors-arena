import { GameSettings } from "./game-settings"

export const GRID_CELL_MULTIPLIER = 32

export class SpriteTileViewModel {
  id: string
  imageUrl: string
  tileLocation: {
    x: number,
    y: number
  }
  tileDimensions: { 
    width: number,
    height: number
  }
  displayOffset: { 
    x: number, 
    y: number
  }
  default?: boolean // maybe that can be stored separate, tells that for drawable terrain, if the algorithm cant find a match, show this tile.
  drawWhen?: {
    topNeighbor: boolean,
    topRightNeighbor: boolean,
    rightNeighbor: boolean,
    bottomRightNeighbor: boolean
    bottomNeighbor:boolean,
    bottomLeftNeighbor: boolean,
    leftNeighbor: boolean,
    topLeftNeighbor: boolean,
  }
}

export interface CellViewModel {
  id: string
  location: {x: number, y: number}
  sprite: SpriteTileViewModel
  isObstructed: boolean
}

export class BaseCell implements CellViewModel{
  public id: string
  public location: {x: number, y: number}
  public sprite: SpriteTileViewModel
  public position?: {x: number, y: number} 
  public isObstructed: boolean
  public neighbors: BaseCell[]
  
  constructor(cellViewModel: CellViewModel) {
    this.id = cellViewModel.id
    this.location = cellViewModel.location
    this.sprite = cellViewModel.sprite
    this.isObstructed = cellViewModel.isObstructed
    this.position = {x: (this.location.x * GameSettings.cellDimension), y: (this.location.y * GameSettings.cellDimension) }
  }
}


export interface GameMapViewModel {
  id: string
  name: string
  size: { width: number, height: number }
  gridLayers: {
    baseLayer: { [cell: string]: BaseCell }
    terrainLayer: { [cell: string]: BaseCell }
    partitionLayer: { [cell: string]: BaseCell }
    structureLayer: { [cell: string]: BaseCell }
    gatewayLayer: { [cell: string]: BaseCell }
  }
}

enum GridLayer {
  BaseLayer = "baseLayer",
  TerrainLayer = "terrainLayer",
  PartitionLayer = "partitionLayer",
  StructureLayer = "structureLayer",
  GatewayLayer = "gatewayLayer",
}

export class GameMap2 implements GameMapViewModel {
  id: string
  name: string
  size: {width: number, height: number }
  gridLayers: {
    baseLayer: { [cell: string]: BaseCell } = {}
    terrainLayer: { [cell: string]: BaseCell } = {}
    partitionLayer: { [cell: string]: BaseCell } = {}
    structureLayer: { [cell: string]: BaseCell } = {}
    gatewayLayer: { [cell: string]: BaseCell } = {}
  }

  public constructor(gameMapViewModel: GameMapViewModel) {
    this.id = gameMapViewModel.id
    this.name = gameMapViewModel.name
    this.size = gameMapViewModel.size
    this.gridLayers = gameMapViewModel.gridLayers  

    this.addNeighbors(GridLayer.BaseLayer)
    this.addNeighbors(GridLayer.GatewayLayer)
    this.addNeighbors(GridLayer.PartitionLayer)
    this.addNeighbors(GridLayer.StructureLayer)
    this.addNeighbors(GridLayer.TerrainLayer)
  }

  public iterate(layer: GridLayer, iteratorFunction: (BaseCell: BaseCell) => void ) {
    for (let h = 0; this.size.height; h++ ) {
      for (let w = 0; this.size.width; w++ ) {
        const cell = this.getCell(w, h, layer)
        if (cell) {
          iteratorFunction(cell)
        }
      }
    }
  }

  public getCell(x: number, y: number, layer: GridLayer): BaseCell {
    return this.gridLayers[layer][`x${x}:y${y}`]
  }

  public getGridCellByCoordinate(x: number, y: number, layer: GridLayer): BaseCell {
    while ((x % 32) !== 0) {
      x--
    }
    while ((y % 32) !== 0) {
      y--
    }
    return this.gridLayers[layer][`x${x / (32 * 1)}:y${y / (32 * 1)}`]
  }

  private addNeighbors(layer: GridLayer) {
      this.iterate(layer, (cell)=> {
        cell.neighbors = [];
        cell.neighbors[5] = this.gridLayers[layer][`x${cell.position.x + 1}:y${cell.position.y + 1}`];
        cell.neighbors[0] = this.gridLayers[layer][`x${cell.position.x}:y${cell.position.y - 1}`];
        cell.neighbors[2] = this.gridLayers[layer][`x${cell.position.x}:y${cell.position.y + 1}`];
        cell.neighbors[4] = this.gridLayers[layer][`x${cell.position.x + 1}:y${cell.position.y - 1}`];
        cell.neighbors[1] = this.gridLayers[layer][`x${cell.position.x + 1}:y${cell.position.y}`];
        cell.neighbors[6] = this.gridLayers[layer][`x${cell.position.x - 1}:y${cell.position.y + 1}`];
        cell.neighbors[3] = this.gridLayers[layer][`x${cell.position.x - 1}:y${cell.position.y}`];
        cell.neighbors[7] = this.gridLayers[layer][`x${cell.position.x - 1}:y${cell.position.y - 1}`];
    })
  }
}


export class GameMapCreatorAPI {
  public id? = "1"
  public name? = "newGrid"
  public size = { width: 15, height: 15 }
  public grid: { [cell: string]: BaseCell } = {}

  public baseLayer: { [cell: string]: BaseCell } = {}
  public terrainLayer: { [cell: string]: BaseCell } = {}
  public partitionLayer: { [cell: string]: BaseCell } = {}
  public structureLayer: { [cell: string]: BaseCell } = {}
  public gatewayLayer: { [cell: string]: BaseCell } = {}
  public creatureLayer: { [cell: string]: BaseCell } = {}

  public defaultSettings: DefaultMapSettings
  public gridDisplay: BaseCell[][] = [];
  public widthPx = 0
  public heightPx = 0
  public gridLoaded = false
  public includeGridLines = false
  public largeImage: LargeCanvasImage
  public selectedGameComponent: MotionAsset

  public changePageXOffset: number
  public changePageYOffset: number

  constructor(width: number, height: number, defaultMapSettings: DefaultMapSettings) {
    this.createDisplayArray()
    this.gridLoaded = true
  }

  

  private createDisplayArray() {
    let imgIndexX = 1
    let imgIndexY = 1

    for (let i = 0; i < this.height; i++) {
      for (let l = 0; l < this.width; l++) {
        this.grid[`x${l}:y${i}`] = this.grid[`x${l}:y${i}`]
          || {
            x: l,
            y: i,
            posX: l * 32,
            posY: i * 32,
            obstacle: this.defaultSettings.inverted ? true : false,
            id: `x${l}:y${i}`,
            growableTileId: this.defaultSettings.inverted ? this.defaultSettings.terrainTypeId : undefined
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

}