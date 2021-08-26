import { Engine } from "../engine/engine";
import { v4 as uuidv4 } from 'uuid';
import { Cell } from "../models/cell.model";
import { CanvasService } from "../canvas/canvas.service";

export class ShortLivedAnimation {
  public id: string
  public animationFrame: number = 1
  public cyclesRemaining: number = 0
  public image = new Image()
  public longLive = false
  public frameXCounter = 0
  public frameYCounter = 0
  public frameXPosition = [0, 25, 50]
  public frameYPosition = [0, 25, 50]

  constructor(
    public numberOfCycles: number,
    public engineService: Engine,
    public cell?: Cell
  ) {
    this.cyclesRemaining = numberOfCycles
    this.id = uuidv4()
  }

  public update(): void {
    if (this.cyclesRemaining === 0 && !this.longLive) {
      this.engineService.endShortLivedAnimation(this)
    }

    this.cyclesRemaining--
  }
}

export class ClickAnimation extends ShortLivedAnimation {
  public animationFrame = 5

  constructor(
    public numberOfCycles: number,
    public engineService: Engine,
    public imgSrc: string,
    public cell?: Cell
  ) {
    super(numberOfCycles, engineService)
    this.image.src = this.imgSrc

    this.engineService.shortLivedAnimations.push(this)
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
