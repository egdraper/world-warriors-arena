import { v4 as uuidv4 } from 'uuid';
import { Cell } from './cell.model';

export abstract class GameComponents {
  public id: string
  public animationFrame: number[] | number = [10, 20, 30, 40, 50, 60]
  public cell: Cell = null

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public abstract update(): void

  constructor() {
    this.id = uuidv4()
  }
}

export abstract class Asset extends GameComponents {
  //public name: string = ""
}

export abstract class MotionAsset extends Asset {
  public frameCounter = 0
  public frameXPosition = [0, 26, 52, 26]
  public image = new Image()
}


