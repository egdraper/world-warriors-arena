import { TerrainType } from "../game-assets/tile-assets.db"

export const GRID_CELL_MULTIPLIER = 32

export interface Cell {
  id: string;
  x: number; // X Grid Coordinates
  y: number; // Y Grid Coordinates
  posX?: number; // X Pixel Coordinates
  posY?: number; // Y Pixel Coordinates
  obstacle?: boolean;
  visible?: boolean;
  neighbors?: Cell[];
  destination?: boolean;
  imageTile?: SpriteTile;
  growableTileId?: string
  growableTileOverride?: boolean
  backgroundTile?: SpriteBackgroundTile;
  backgroundGrowableTileId?: string
  portalTo?: {gridId: string, cell: Cell}
  revealed?: boolean
  fogPointX?: number
  fogPointY?: number  
}

export class TileAttachment {
  neighborPosition: number // 0 up; 1 right; 2 down; 3 left, 4 up/right, 5 down/right, 6 down/left, 7 up/left
  tileName: string
  xOffset?: number
  yOffset?: number
}

export class EndTile {
  name: string
  offset: number
}

export class SpriteBackgroundTile {
  id: string
  spriteSheet: HTMLImageElement
  spriteGridPosX: number[]
  spriteGridPosY: number[]
  lowWeight?: number
  highWeight?: number
  rarity?: number // express on a random placement how often it should be seen 1 being once in 20 on average
}

export class Point {
  constructor(
    public id: string,
    public edgeId: string,
    public x: number,
    public y: number
  ) { }
}

export enum GrowablePanelPosition {
  topLeftPanel = "topLeftPanel",
  topCenterPanel = "topCenterPanel",
  topRightPanel = "topRightPanel",
  growableLeftPanel = "growableLeftPanel",
  growableCenterPanel = "growableCenterPanel",
  growableRightPanel = "growableRightPanel",
  bottomLeftPanel = "bottomLeftPanel",
  bottomCenterPanel = "bottomCenterPanel",
  bottomRightPanel = "bottomRightPanel",
  bottomLeftPanelAngle = "bottomLeftPanelAngle",
  bottomRightPanelAngle = "bottomRightPanelAngle",
  bottomLeftPanelFillerAngle = "bottomLeftPanelFillerAngle",
  bottomRightPanelFillerAngle = "bottomRightPanelFillerAngle",
}

export class SpriteTile {
  id: string
  spriteSheet: HTMLImageElement
  spriteGridPosX: number
  spriteGridPosY: number
  tileHeight: number
  tileWidth: number
  tileOffsetX: number
  tileOffsetY: number
  multiplier: number
  sizeAdjustment?: number
  visionBlocking?: boolean
  obstacle: boolean
  obstacleObstructionX?: number
  obstacleObstructionY?: number
  position?: GrowablePanelPosition
  default?: boolean
  obstacleSide?: "right" | "left" | "top" | "bottom"
  allowForPassThrough?: boolean
  addon?: string
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

export interface RelativePositionCell extends Cell {
  distance: number;
}

export interface Neighbor {
  cell: Cell;
}

export interface Visited {
  cell?: Cell
  steps?: {
    distance?: number,
    odd?: boolean,
    moves?: number
  }
  checked?: boolean;
}

export class GridDetails {
  public name?: string = ""
  public width = 0
  public height = 0
  public grid?: {[cell: string]: Cell }
}

export class DrawableTiles {
  public id: string
  public terrainType: TerrainType
  public name: string
  public spritesTiles: SpriteTile[]
  public inverted?: boolean
  public layers?: number
  public spriteSheetOffsetX?: number
  public spriteSheetOffsetY?: number
}

export class GridMapCell {
  gridCanvas?: HTMLCanvasElement
  context?: CanvasRenderingContext2D
  x: number
  y: number
  relationX?: number
  relationY?: number
  markers?: {x: number, y: number}[]
}

export enum MapPosition {
  left = "left",
  right = "right",
  top = "top",
  bottom = "bottom",
  start = "start"
}

export class DefaultMapSettings {
  autoGeneratedMap: boolean
  terrainTypeId: string
  backgroundTypeId: string
  pathTypeId: string
  inverted: boolean
}

export enum MarkerIconType {
  mapTransition = "Map Transition",
  portal = "Portal",
  query = "Query"
}

export class MousePosition {
  public mousePosX: number
  public mousePosY: number
  public cell: Cell
}
