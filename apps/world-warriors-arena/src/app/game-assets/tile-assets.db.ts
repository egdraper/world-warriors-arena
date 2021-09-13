import { SpriteTile } from "../models/assets.model"

const tileB_outside = new Image()
tileB_outside.src = "assets/images/tileB_outside.png"


export const TileAssets: {[name: string]: SpriteTile} = {
  tree1: {
    spriteSheet: tileB_outside,
    spriteGridPosX: 8,
    spriteGridPosY: 4,
    tileHeight: 6,
    tileWidth: 6,
    tileOffsetX: -64,
    tileOffsetY: -142,
    multiplier: 32,
  },
  tree2: {
    spriteSheet: tileB_outside,
    spriteGridPosX: 8,
    spriteGridPosY: 0,
    tileHeight: 4,
    tileWidth: 4,
    tileOffsetX: -32,
    tileOffsetY: -78,
    multiplier: 32,
  }
}