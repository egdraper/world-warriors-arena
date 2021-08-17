import { v4 as uuidv4 } from 'uuid';

export abstract class GameComponents {
  public id: string
  public animationFrame: number[] = [10, 20, 30, 40, 50, 60]

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public update(): void { }

  constructor() {
    this.id = uuidv4()
  }
}

export abstract class Asset extends GameComponents {
  //public name: string = ""
}



export class motionAsset extends Asset {



}
