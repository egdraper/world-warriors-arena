import { SpriteBackgroundTile } from "../models/cell.model";
import { tileA5_outside } from "./images";

export const greenGrass: SpriteBackgroundTile[] = [
  {
    id: "greenGrass",
    spriteSheet: tileA5_outside,
    spriteGridPosX: [1, 2, 3],
    spriteGridPosY: [0],
    rarity: 95
  },
  {
    id: "greenGrass",
    spriteSheet: tileA5_outside,
    spriteGridPosX: [0, 1, 2, 3, 4, 5],
    spriteGridPosY: [1, 2, 3, 4, 5],
    rarity: 5
  }
]
