import { GSM } from "../app.service.manager";
import { MotionAsset } from "../models/assets.model";
import { Cell } from "../models/cell.model";

export class Character extends MotionAsset {
  public frameCounter = 0
  public frameXPosition = [0, 26, 52, 26]
  public image = new Image()

  constructor(
    public imageUrl: string,
    public cell: Cell,
  ) {
    super();
    
    // sets the starting cell location
    if(cell) {
      this.positionX = cell.posX
      this.positionY = cell.posY
    }

    // temp: Randomly chooses character sprites
    this.image.src = imageUrl

    this.image.onload = () => {
      GSM.Canvas.foregroundCTX.imageSmoothingEnabled = false
    }
  }
}

