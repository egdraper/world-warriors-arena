import { v4 as uuidv4 } from 'uuid';
import { GridService } from '../grid/grid.service';
import { Cell } from './cell.model';

export abstract class GameComponent {
  public id: string
  public animationFrame: number[] | number = [10, 20, 30, 40, 50, 60]
  public cell: Cell = null

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public abstract update(): void
  public move(): void {}

  constructor() {
    this.id = uuidv4()
  }
}

export abstract class Asset extends GameComponent {
  //public name: string = ""
}

export abstract class MotionAsset extends Asset {
  public positionX = 0
  public positionY = 0
  public frameCounter = 0
  public frameXPosition = [0, 26, 52, 26]
  public image = new Image()

  constructor(public grid: GridService) {
    super()
  }
   
  public update() {
    if (this.frameCounter < 3) {
      this.frameCounter++
    } else {
      this.frameCounter = 0
    }
  }

  public move(startCell?: Cell, endingCell?: Cell) {
    this.positionX += 1
    this.positionY += 1

    if(this.positionY % 50 === 0 && this.positionX % 50 === 0) {
      this.cell = this.grid.grid[`x${this.positionX / 50}:y${this.positionY / 50}`]
      this.cell.occupiedBy = this
    }
  }
}


