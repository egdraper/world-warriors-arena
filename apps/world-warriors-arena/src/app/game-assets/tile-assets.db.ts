import { SpriteBackgroundTile, SpriteTile } from "../models/cell.model"


const tileB_outside = new Image()
tileB_outside.src = "assets/images/tileB_outside.png"
const tileA5_outside = new Image()
tileA5_outside.src = "assets/images/tileA5_outside.png"

export const BackgroundAsset: { [name: string]: SpriteBackgroundTile[] } = {
  greenGrass: [
  {
    id: "greenGrass",
    spriteSheet: tileA5_outside,
    spriteGridPosX: [1],
    spriteGridPosY: [0],
    rarity: 100
  },
  {
    id: "greenGrass",
    spriteSheet: tileA5_outside,
    spriteGridPosX: [2],
    spriteGridPosY: [0],
    rarity: 50
  },
  {
    id: "greenGrass",
    spriteSheet: tileA5_outside,
    spriteGridPosX: [3],
    spriteGridPosY: [0],
    rarity: 13
  },
  {
    id: "greenGrass",
    spriteSheet: tileA5_outside,
    spriteGridPosX: [0,1,2,3,4,5],
    spriteGridPosY: [1],
    rarity: 3
  },
  {
    id: "greenGrass",
    spriteSheet: tileA5_outside,
    spriteGridPosX: [0,1,2,3,4,5],
    spriteGridPosY: [2,3,4,5],
    rarity: 2
  },
],
}

export const TileAssets: { [name: string]: SpriteTile | SpriteTile[] } = {
  tree1: {
    id: "tree1",
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
    id: "tree2",
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
    id: "treeStumpsForrest",
    spriteSheet: tileB_outside,
    spriteGridPosX: 14,
    spriteGridPosY: 4,
    tileHeight: 2,
    tileWidth: 2,
    tileOffsetX: -16,
    tileOffsetY: -28,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    allowForPassThrough: true
  }],
  leftTreeClump: {
    id: "leftTreeClump",
    spriteSheet: tileB_outside,
    spriteGridPosX: 2,
    spriteGridPosY: 13,
    tileHeight: 3,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    centerTileName: "centerTreeClump",
    topEndTileName: {
      name: "leafTopLeft",
      offset: -124
    },
    attachments: [{
      tileName: "leafLeft1",
      neighborPosition: 0,
      xOffset: 0,
      yOffset: -96
    }]
  },
  centerTreeClump: {
    id: "centerTreeClump",
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
    leftEndTileName: "leftTreeClump",
    rightEndTileName: "rightTreeClump",
    topEndTileName: {
      name: "leafTopCenter",
      offset: -124
    },
    attachments: [{
      tileName: "leafBottom1",
      neighborPosition: 0,
      xOffset: 0,
      yOffset: -64

    }, {
      tileName: "leafCenter1",
      neighborPosition: 0,
      xOffset: 0,
      yOffset: -96
    }
    ]
  },
  rightTreeClump: {
    id: "rightTreeClump",
    spriteSheet: tileB_outside,
    spriteGridPosX: 4,
    spriteGridPosY: 13,
    tileHeight: 3,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    centerTileName: "centerTreeClump",
    topEndTileName: {
      name: "leafRightTop",
      offset: -124
    },
    attachments: [{
      tileName: "leafRightCenter",
      neighborPosition: 0,
      xOffset: 0,
      yOffset: -96
    }
    ]
  },
  leafTopCenter: {
    id: "leafTopCenter",
    spriteSheet: tileB_outside,
    spriteGridPosX: 1,
    spriteGridPosY: 10,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  },
  leafTopRight: {
    id: "leafTopRight",
    spriteSheet: tileB_outside,
    spriteGridPosX: 2,
    spriteGridPosY: 10,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  },
  leafTopLeft: {
    id: "leafTopLeft",
    spriteSheet: tileB_outside,
    spriteGridPosX: 0,
    spriteGridPosY: 10,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  },
  treeLog: {
    id: "treeLog",
    spriteSheet: tileB_outside,
    spriteGridPosX: 5,
    spriteGridPosY: 8,
    tileHeight: 2,
    tileWidth: 3,
    tileOffsetX: -0,
    tileOffsetY: -16,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 3,
    obstacleObstructionY: 1,
  },
  leafBottom1: {
    id: "leafBottom1",
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
  leafLeft1: {
    id: "leafLeftCenter",
    spriteSheet: tileB_outside,
    spriteGridPosX: 0,
    spriteGridPosY: 11,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: -0,
    tileOffsetY: -32,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 0,
    obstacleObstructionY: 0,
  },
  leafLeft2: {
    id: "leafLeftTop",
    spriteSheet: tileB_outside,
    spriteGridPosX: 0,
    spriteGridPosY: 10,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: -0,
    tileOffsetY: -0,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 0,
    obstacleObstructionY: 0,
  },
  leafRightCenter: {
    id: "leafRightCenter",
    spriteSheet: tileB_outside,
    spriteGridPosX: 2,
    spriteGridPosY: 11,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: -0,
    tileOffsetY: -32,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 0,
    obstacleObstructionY: 0,
  },
  leafRightTop: {
    id: "leafRightTop",
    spriteSheet: tileB_outside,
    spriteGridPosX: 2,
    spriteGridPosY: 10,
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
    id: "leafCenter1",
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