import { v4 as uuidv4 } from 'uuid';
import { Cell } from "./cell.model";
import { GSM } from "../app.service.manager";

export class ShortLivedAnimation {
  public image = new Image()

  public id: string
  public animationFrame = 1
  public cyclesRemaining = 0
  public longLive = false
  public frameXCounter = 0
  public frameYCounter = 0
  public frameXPosition = [0, 25, 50]
  public frameYPosition = [0, 25, 50]

  constructor(
    public numberOfCycles: number,
    public cell?: Cell
  ) {
    this.cyclesRemaining = numberOfCycles
    this.id = uuidv4()
  }

  public update(): void {
    if (this.cyclesRemaining === 0 && !this.longLive) {
      GSM.Engine.endShortLivedAnimation(this)
    }

    this.cyclesRemaining--
  }

  public forceStop(): void {
    GSM.Engine.endShortLivedAnimation(this)
  }
}

export class ClickAnimation extends ShortLivedAnimation {
  public animationFrame = 5

  constructor(
    public numberOfCycles: number,
    public imgSrc: string,
    public cell?: Cell
  ) {
    super(numberOfCycles)
    this.image.src = this.imgSrc

    GSM.Engine.shortLivedAnimations.push(this)
  }

  public update() {
    super.update()
    if (this.frameXCounter === 2 && this.frameYCounter === 2) {
      this.frameXCounter = 0
      this.frameYCounter = 0
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
