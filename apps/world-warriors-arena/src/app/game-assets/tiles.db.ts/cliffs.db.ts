import { SpriteTile } from "../../models/cell.model";
import { tileA5_outside } from "./images";

export const cliffs: SpriteTile[] = [
  {
    id: "leftTreeClump",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 0,
    spriteGridPosY: 12,
    tileHeight: 2,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -32,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 3,
    centerTileName: "centerTreeClump",
    topEndTileName: {
      name: "leafTopLeft",
      offset: -96
    },
    attachments: [{
      tileName: "leafLeft1",
      neighborPosition: 0,
      xOffset: 0,
      yOffset: -64
    }]
  },
  {
    id: "centerTreeClump",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 1,
    spriteGridPosY: 12,
    tileHeight: 2,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -32,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 3,
    leftEndTileName: "leftTreeClump",
    rightEndTileName: "rightTreeClump",
    topEndTileName: {
      name: "leafTopCenter",
      offset: -96
    },
    attachments: [{
      tileName: "leafCenter1",
      neighborPosition: 0,
      xOffset: 0,
      yOffset: -64
    }]
  },
  {
    id: "rightTreeClump",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 2,
    spriteGridPosY: 12,
    tileHeight: 2,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -32,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 3,
    centerTileName: "centerTreeClump",
    topEndTileName: {
      name: "leafTopRight",
      offset: -96
    },
    attachments: [{
      tileName: "leafRightCenter",
      neighborPosition: 0,
      xOffset: 0,
      yOffset: -64
    }]

  }, {
    id: "leafTopLeft",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 0,
    spriteGridPosY: 11,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  }, {
    id: "leafTopCenter",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 1,
    spriteGridPosY: 11,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  }, {
    id: "leafTopRight",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 2,
    spriteGridPosY: 11,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  }, {
    id: "leafLeft1",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 0,
    spriteGridPosY: 12,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  }, {
    id: "leafCenter1",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 1,
    spriteGridPosY: 12,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  }, {
    id: "leafRightCenter",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 2,
    spriteGridPosY: 12,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  },
  {
    id: "leftCliffEdge",
    spriteSheet: tileA5_outside,
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
  {
    id: "leftCliffEdge",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 0,
    spriteGridPosY: 9,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  },
  {
    id: "leftCliffBottomEdge",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 0,
    spriteGridPosY: 13,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  },
  {
    id: "CenterCliffBottomEdge",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 1,
    spriteGridPosY: 13,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  },
  {
    id: "rightCliffBottomEdge",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 2,
    spriteGridPosY: 13,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    visionBlocking: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  },

]
//   id: "rightTreeClump",
//   spriteSheet: tileB_outside,
//   spriteGridPosX: 4,
//   spriteGridPosY: 13,
//   tileHeight: 3,
//   tileWidth: 1,
//   tileOffsetX: 0,
//   tileOffsetY: -64,
//   multiplier: 32,
//   visionBlocking: false,
//   obstacleObstructionX: 1,
//   obstacleObstructionY: 1,
//   centerTileName: "centerTreeClump",
//   topEndTileName: {
//     name: "leafRightTop",
//     offset: -124
//   },
//   attachments: [{
//     tileName: "leafRightCenter",
//     neighborPosition: 0,
//     xOffset: 0,
//     yOffset: -96
//   }
//   ]

  // {
  //   id: "leftCliffBottomGrass",
  //   spriteSheet: tileA5_outside,
  //   spriteGridPosX: 0,
  //   spriteGridPosY: 12,
  //   tileHeight: 2,
  //   tileWidth: 1,
  //   tileOffsetX: 0,
  //   tileOffsetY: -64,
  //   multiplier: 32,
  //   visionBlocking: false,
  //   obstacleObstructionX: 1,
  //   obstacleObstructionY: 1,
  //   centerTileName: "centerCliffClump",
  //   topEndTileName: {
  //     name: "topLeftCliffGrass",
  //     offset: -64
  //   },
  //   attachments: [{
  //     tileName: "cliffGrower",
  //     neighborPosition: 0,
  //     xOffset: 0,
  //     yOffset: -96
  //   }]
  // },
  // {
  //   id: "topLeftCliffGrass",
  //   spriteSheet: tileA5_outside,
  //   spriteGridPosX: 0,
  //   spriteGridPosY: 11,
  //   tileHeight: 1,
  //   tileWidth: 1,
  //   tileOffsetX: 0,
  //   tileOffsetY: -64,
  //   multiplier: 32,
  //   visionBlocking: false,
  //   obstacleObstructionX: 1,
  //   obstacleObstructionY: 1,
  //   centerTileName: "centerCliffClump",
  // },
  // {
  //   id: "cliffGrower",
  //   spriteSheet: tileA5_outside,
  //   spriteGridPosX: 0,
  //   spriteGridPosY: 12,
  //   tileHeight: 1,
  //   tileWidth: 1,
  //   tileOffsetX: 0,
  //   tileOffsetY: -64,
  //   multiplier: 32,
  //   visionBlocking: false,
  //   obstacleObstructionX: 1,
  //   obstacleObstructionY: 1,
  //   centerTileName: "centerCliffClump",
  // },
  // {
  //   id: "centerCliffClump",
  //   spriteSheet: tileA5_outside,
  //   spriteGridPosX: 1,
  //   spriteGridPosY: 12,
  //   tileHeight: 1,
  //   tileWidth: 1,
  //   tileOffsetX: 0,
  //   tileOffsetY: -64,
  //   multiplier: 32,
  //   visionBlocking: false,
  //   obstacleObstructionX: 1,
  //   obstacleObstructionY: 1,
  //   centerTileName: "centerCliffClump",
  // }
// ]

// {
//   id: "leftTreeClump",
//   spriteSheet: tileB_outside,
//   spriteGridPosX: 2,
//   spriteGridPosY: 13,
//   tileHeight: 3,
//   tileWidth: 1,
//   tileOffsetX: 0,
//   tileOffsetY: -64,
//   multiplier: 32,
//   visionBlocking: false,
//   obstacleObstructionX: 1,
//   obstacleObstructionY: 1,
//   centerTileName: "centerTreeClump",
//   topEndTileName: {
//     name: "leafTopLeft",
//     offset: -124
//   },
//   attachments: [{
//     tileName: "leafLeft1",
//     neighborPosition: 0,
//     xOffset: 0,
//     yOffset: -96
//   }]
// }, {
//   id: "centerTreeClump",
//   spriteSheet: tileB_outside,
//   spriteGridPosX: 3,
//   spriteGridPosY: 14,
//   tileHeight: 2,
//   tileWidth: 1,
//   tileOffsetX: 0,
//   tileOffsetY: -32,
//   multiplier: 32,
//   visionBlocking: false,
//   obstacleObstructionX: 1,
//   obstacleObstructionY: 1,
//   leftEndTileName: "leftTreeClump",
//   rightEndTileName: "rightTreeClump",
//   topEndTileName: {
//     name: "leafTopCenter",
//     offset: -124
//   },
//   attachments: [{
//     tileName: "leafBottom1",
//     neighborPosition: 0,
//     xOffset: 0,
//     yOffset: -64

//   }, {
//     tileName: "leafCenter1",
//     neighborPosition: 0,
//     xOffset: 0,
//     yOffset: -96
//   }
//   ]
// }, {
//   id: "rightTreeClump",
//   spriteSheet: tileB_outside,
//   spriteGridPosX: 4,
//   spriteGridPosY: 13,
//   tileHeight: 3,
//   tileWidth: 1,
//   tileOffsetX: 0,
//   tileOffsetY: -64,
//   multiplier: 32,
//   visionBlocking: false,
//   obstacleObstructionX: 1,
//   obstacleObstructionY: 1,
//   centerTileName: "centerTreeClump",
//   topEndTileName: {
//     name: "leafRightTop",
//     offset: -124
//   },
//   attachments: [{
//     tileName: "leafRightCenter",
//     neighborPosition: 0,
//     xOffset: 0,
//     yOffset: -96
//   }
//   ]
// },