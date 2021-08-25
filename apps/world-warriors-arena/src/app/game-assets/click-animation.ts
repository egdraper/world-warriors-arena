import { Engine } from "../engine/engine";
import { Asset } from "../models/assets.model";

export class ClickAnimation {
  public image = new Image()

  constructor(
    public engineService: Engine,
    public imgSrc: string
  ) {
    this.image.src = this.imgSrc
  }

  public frameXCounter = 2
  public frameYCounter = 2
  public frameXPosition = [0, 25, 50]
  public frameYPosition = [0, 25, 50]

  public update() {
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
