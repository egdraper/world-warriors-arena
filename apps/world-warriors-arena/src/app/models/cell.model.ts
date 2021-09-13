import { GameComponent, MotionAsset } from "./assets.model"

export interface Cell {
  id: string;
  x: number; // X Grid Coordinates
  y: number; // Y Grid Coordinates
  posX?: number; // X Pixel Coordinates
  posY?: number; // Y Pixel Coordinates
  obstacle?: boolean;
  neighbors?: Cell[];
  destination?: boolean;
  occupiedBy?: MotionAsset
  image?: HTMLImageElement;
  imgIndexX?: number; // X Pixel Location Sprite sheet
  imgIndexY?: number; // Y Pixel Location Sprite Sheet
  imgWidth?: number; // Sprite asset width
  imgHeight?: number; // Sprite asset height
  imgOffsetX?: number // X Offsets sprite asset grid
  imgOffsetY?: number // Y Offsets sprite asset on grid
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
