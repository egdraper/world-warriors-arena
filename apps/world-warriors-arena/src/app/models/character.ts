import { GSM } from "../app.service.manager";
import { MotionAsset } from "./assets.model";
import { Cell } from "./cell.model";

export class Character extends MotionAsset {
  public frameCounter = 0
  public frameXPosition = [0, 26, 52, 26]
  public image

  constructor(
    public imageUrl: HTMLImageElement,
    public cell: Cell,
    public gridId: string,
    public animationFrame: number[]
  ) {
    super();
    
    // sets the starting cell location
    if(cell) {
      this.positionX = cell.posX
      this.positionY = cell.posY
    }

    // temp: Randomly chooses character sprites
    this.image = imageUrl

    this.image.onload = () => {
      GSM.Canvas.foregroundCTX.imageSmoothingEnabled = false
    }
  }
}

