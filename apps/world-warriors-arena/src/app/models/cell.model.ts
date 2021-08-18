import { GameComponents, MotionAsset } from "./assets.model"

export interface Cell {
  id: string;
  x: number;
  y: number;
  posX?: number;
  posY?: number;
  obstacle?: boolean;
  neighbors?: Cell[];
  destination?: boolean;
  occupiedBy?: MotionAsset
  imgUrl?: string;
  imgIndexX?: number;
  imgIndexY?: number;
  imgWidth?: number;
  imgHeight?: number;
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
