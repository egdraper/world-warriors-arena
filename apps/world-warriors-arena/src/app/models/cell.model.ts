import { GameComponent, MotionAsset } from "./assets.model"

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
  occupiedBy?: MotionAsset
  imageTile?: SpriteTile;
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
  visionBlocking: boolean
  obstacle: boolean
  obstacleObstructionX: number
  obstacleObstructionY: number
  obstacleSide?: "right" | "left" | "top" | "bottom"
  allowForPassThrough?: boolean
  leftEndTileName?: string
  rightEndTileName?: string
  centerTileName?: string
  topEndTileName?: EndTile
  attachments?: TileAttachment[]
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
  public name: string = ""
  public width: number = 0
  public height: number = 0
  public grid?: {[cell: string]: Cell }
}
