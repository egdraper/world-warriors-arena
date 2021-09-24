import { SpriteTile } from "../../models/cell.model";
import { tileB_outside } from "./images";

export const crates: SpriteTile[] = [
  {
    id: "crate1",
    spriteSheet: tileB_outside,
    spriteGridPosX: 0,
    spriteGridPosY: 1,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: -0,
    tileOffsetY: -0,
    multiplier: 32,
    visionBlocking: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  }
]