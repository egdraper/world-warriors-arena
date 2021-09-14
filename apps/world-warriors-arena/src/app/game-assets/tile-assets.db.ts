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
    visionBlocking: true,
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
    visionBlocking: true,
  },
  treeStump1: {
    spriteSheet: tileB_outside,
    spriteGridPosX: 14,
    spriteGridPosY: 4,
    tileHeight: 2,
    tileWidth: 2,
    tileOffsetX: -8,
    tileOffsetY: -16,
    multiplier: 32,
    visionBlocking: false,
  },
  treeClump1: {
    spriteSheet: tileB_outside,
    spriteGridPosX: 1,
    spriteGridPosY: 13,
    tileHeight: 3,
    tileWidth: 1,
    tileOffsetX: -8,
    tileOffsetY: -16,
    multiplier: 32,
    visionBlocking: false,
  },
  treeClump2: {
    spriteSheet: tileB_outside,
    spriteGridPosX: 2,
    spriteGridPosY: 13,
    tileHeight: 3,
    tileWidth: 3,
    tileOffsetX: -8,
    tileOffsetY: -16,
    multiplier: 32,
    visionBlocking: false,
  },
  treeClump3: {
    spriteSheet: tileB_outside,
    spriteGridPosX: 3,
    spriteGridPosY: 10,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: -8,
    tileOffsetY: -16,
    multiplier: 32,
    visionBlocking: false,
  }
}