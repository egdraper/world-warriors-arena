import { SpriteTile } from "../models/cell.model"


const tileB_outside = new Image()
tileB_outside.src = "assets/images/tileB_outside.png"
const tileA5_outside = new Image()
tileA5_outside.src = "assets/images/tileA5_outside.png"

export const BackgroundAsset: {[name: string]: SpriteTile | SpriteTile[]} = {
  greenGrass: [{
    spriteSheet: tileB_outside,
    spriteGridPosX: 8,
    spriteGridPosY: 4,
    tileHeight: 6,
    tileWidth: 6,
    tileOffsetX: -80,
    tileOffsetY: -160,
    multiplier: 32,
    visionBlocking: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    rarity: 20
  }],
}

export const TileAssets: {[name: string]: SpriteTile | SpriteTile[]} = {
  tree1: {
    spriteSheet: tileB_outside,
    spriteGridPosX: 8,
    spriteGridPosY: 4,
    tileHeight: 6,
    tileWidth: 6,
    tileOffsetX: -80,
    tileOffsetY: -160,
    multiplier: 32,
    visionBlocking: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  },
  tree2: {
    spriteSheet: tileB_outside,
    spriteGridPosX: 8,
    spriteGridPosY: 0,
    tileHeight: 4,
    tileWidth: 4,
    tileOffsetX: -48,
    tileOffsetY: -96,
    multiplier: 32,
    visionBlocking: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  },
  treeStumpsForrest: [{
    spriteSheet: tileB_outside,
    spriteGridPosX: 14,
    spriteGridPosY: 4,
    tileHeight: 2,
    tileWidth: 2,
    tileOffsetX: -16,
    tileOffsetY: -32,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    allowForPassThrough: true
  }],
  treeClump1: {
    spriteSheet: tileB_outside,
    spriteGridPosX: 2,
    spriteGridPosY: 13,
    tileHeight: 3,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -80,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    rightEndTileName: "treeClump2"
  },
  treeClump2: {
    spriteSheet: tileB_outside,
    spriteGridPosX: 3,
    spriteGridPosY: 14,
    tileHeight: 2,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -32,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    leftEndTileName: "treeClump1",
    rightEndTileName: "treeClump3",
    attachments: [{
      tileName: "leafBottom1",
      neighborPosition: 0,
      xOffset: 0,
      yOffset: -64
    
    },{
      tileName: "leafCenter1",
      neighborPosition: 0,
      xOffset: 0,
      yOffset: -96    
    }
  
  ]
  },
  treeClump3: {
    spriteSheet: tileB_outside,
    spriteGridPosX: 4,
    spriteGridPosY: 13,
    tileHeight: 3,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -80,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    leftEndTileName: "treeClump2",
  },
  treeLog: {
    spriteSheet: tileB_outside,
    spriteGridPosX: 5,
    spriteGridPosY: 8,
    tileHeight: 2,
    tileWidth: 3,
    tileOffsetX: -0,
    tileOffsetY: -32,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 3,
    obstacleObstructionY: 1,
  },
  leafBottom1: {
    spriteSheet: tileB_outside,
    spriteGridPosX: 1,
    spriteGridPosY: 12,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: -0,
    tileOffsetY: -0,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 0,
    obstacleObstructionY: 0,
  }, 
  leafCenter1: {
    spriteSheet: tileB_outside,
    spriteGridPosX: 1,
    spriteGridPosY: 11,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: -0,
    tileOffsetY: -0,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 0,
    obstacleObstructionY: 0,
  }
}