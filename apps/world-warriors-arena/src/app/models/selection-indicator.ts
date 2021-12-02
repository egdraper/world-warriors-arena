
import { GSM } from "../app.service.manager";
import { Engine } from "../services/engine.service";
import { ShortLivedAnimation } from "./click-animation";

export class SelectionIndicator extends ShortLivedAnimation {
  public image = new Image()

  constructor(
    public numberOfCycles: number,
    public imgSrc: string,
    public longLiving?: boolean
  ) {
    super(numberOfCycles)

    this.image.src = this.imgSrc
    GSM.Engine.shortLivedAnimations.push(this)
    this.longLive = true
  }

  public frameXCounter = 0
  public frameYCounter = 0
  public frameXPosition = [0, 25, 50]
  public frameYPosition = [0, 25, 50]

  public update() {
    super.update()
    if (this.frameXCounter === 2 && this.frameYCounter === 2) {
      
      return
    }

    if (this.frameXCounter < 2) {
      this.frameXCounter++
    } else {
      this.frameXCounter = 0
      this.frameYCounter++
    }
  }
}
