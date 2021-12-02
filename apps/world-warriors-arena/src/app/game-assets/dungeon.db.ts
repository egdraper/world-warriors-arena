
import { SpriteTile } from "../models/cell.model";
import { dungeon_ceiling, dungeon_extension, tileA4_dungeon, tileA5_dungeon, tileA5_dungeon2, tileA5_outside, tileB_dungeon } from "./images";

export const dungeonTiles: SpriteTile[] = [
  {
    id: "dungeonCaveEntrance",
    spriteSheet: tileA4_dungeon,
    spriteGridPosX: 0,
    spriteGridPosY: 6,
    tileHeight: 4,
    tileWidth: 2,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  },
  {
    id: "dungeonCaveEntrance",
    spriteSheet: tileA4_dungeon,
    spriteGridPosX: 0,
    spriteGridPosY: 5,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  },
  {
    id: "dungeonCaveEntrance",
    spriteSheet: tileB_dungeon,
    spriteGridPosX: 8,
    spriteGridPosY: 10,
    tileHeight: 3,
    tileWidth: 3,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  },
  {
    id: "dungeonCaveEntrance",
    spriteSheet: tileA5_dungeon,
    spriteGridPosX: 3,
    spriteGridPosY: 8,
    tileHeight: 2,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  },
  {
    id: "dungeonCaveCrack",
    spriteSheet: tileA5_dungeon,
    spriteGridPosX: 4,
    spriteGridPosY: 8,
    tileHeight: 2,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
  },
  {
    id: "dungeonCaveCrack",
    spriteSheet: tileA5_dungeon,
    spriteGridPosX: 5,
    spriteGridPosY: 7,
    tileHeight: 3,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 3,
    obstacleObstructionY: 1,
  },
  {
    id: "dungeonCaveCrack",
    spriteSheet: tileA5_dungeon,
    spriteGridPosX: 6,
    spriteGridPosY: 7,
    tileHeight: 3,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 3,
    obstacleObstructionY: 1,
  },
  {
    id: "dungeonCaveCrack",
    spriteSheet: tileA5_dungeon,
    spriteGridPosX: 7,
    spriteGridPosY: 7,
    tileHeight: 3,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 3,
    obstacleObstructionY: 1,
  },
  {
    id: "dungeonCaveCrack",
    spriteSheet: dungeon_ceiling,
    spriteGridPosX: 3,
    spriteGridPosY: 5,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 3,
    obstacleObstructionY: 1,
  },


]

export const dungeon1: SpriteTile[] = [
  {
    id: "CliffCenter",
    spriteSheet: tileA5_dungeon,
    spriteGridPosX: 1,
    spriteGridPosY: 7,
    tileHeight: 3,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
      topRightNeighbor: null,
      rightNeighbor: true,
      bottomRightNeighbor: null,
      bottomNeighbor: false,
      bottomLeftNeighbor: null,
      leftNeighbor: true,
      topLeftNeighbor: null,
    }
  },
  {
    id: "cliffLeftSingle",
    spriteSheet: dungeon_extension,
    spriteGridPosX: 1 ,
    spriteGridPosY: 0,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
      topRightNeighbor: null,
      rightNeighbor: false,
      bottomRightNeighbor: null,
      bottomNeighbor: true,
      bottomLeftNeighbor: true,
      leftNeighbor: true,
      topLeftNeighbor: true,
    }
  },
  {
    id: "cliffRightSingle",
    spriteSheet: dungeon_extension,
    spriteGridPosX: 0,
    spriteGridPosY: 0,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
      topRightNeighbor: true,
      rightNeighbor: true,
      bottomRightNeighbor: true,
      bottomNeighbor: true,
      bottomLeftNeighbor: null,
      leftNeighbor: false,
      topLeftNeighbor: null,
    }
  },
  {
    id: "cliffLeftCorner",
    spriteSheet: tileA5_dungeon,
    spriteGridPosX: 0,
    spriteGridPosY: 7,
    tileHeight: 3,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: null,
      topRightNeighbor: null,
      rightNeighbor: true,
      bottomRightNeighbor: null,
      bottomNeighbor: false,
      bottomLeftNeighbor: false,
      leftNeighbor: null,
      topLeftNeighbor: null,
    }
  },
  {
    id: "cliffRightCorner",
    spriteSheet: tileA5_dungeon,
    spriteGridPosX: 2,
    spriteGridPosY: 7,
    tileHeight: 3,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: null,
      topRightNeighbor: null,
      rightNeighbor: false,
      bottomRightNeighbor: false,
      bottomNeighbor: false,
      bottomLeftNeighbor: null,
      leftNeighbor: true,
      topLeftNeighbor: null,
    }
  },
  {
    id: "cliffLeftCorner",
    spriteSheet: tileA5_dungeon,
    spriteGridPosX: 0,
    spriteGridPosY: 7,
    tileHeight: 3,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: null,
      topRightNeighbor: null,
      rightNeighbor: true,
      bottomRightNeighbor: null,
      bottomNeighbor: false,
      bottomLeftNeighbor: false,
      leftNeighbor: null,
      topLeftNeighbor: null,
    }
  },
  {
    id: "BlackCenter",
    spriteSheet: tileA5_dungeon,
    default: true,
    spriteGridPosX: 1,
    spriteGridPosY: 6,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
      topRightNeighbor: true,
      rightNeighbor: true,
      bottomRightNeighbor: true,
      bottomNeighbor: true,
      bottomLeftNeighbor: true,
      leftNeighbor: true,
      topLeftNeighbor: true,
    }
  },

  {
    id: "cliffLeftTopCorner",
    spriteSheet: tileA5_dungeon,
    spriteGridPosX: 7,
    spriteGridPosY: 6,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
      topRightNeighbor: true,
      rightNeighbor: true,
      bottomRightNeighbor: false,
      bottomNeighbor: true,
      bottomLeftNeighbor: true,
      leftNeighbor: true,
      topLeftNeighbor: true,
    }
  },
  {
    id: "cliffRightTopCorner",
    spriteSheet: tileA5_dungeon,
    spriteGridPosX: 6,
    spriteGridPosY: 6,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
      topRightNeighbor: true,
      rightNeighbor: true,
      bottomRightNeighbor: true,
      bottomNeighbor: true,
      bottomLeftNeighbor: false,
      leftNeighbor: true,
      topLeftNeighbor: true,
    }
  },
  {
    id: "cliffLeftBottomCorner",
    spriteSheet: tileA5_dungeon,
    spriteGridPosX: 7,
    spriteGridPosY: 5,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
      topRightNeighbor: false,
      rightNeighbor: true,
      bottomRightNeighbor: true,
      bottomNeighbor: true,
      bottomLeftNeighbor: true,
      leftNeighbor: true,
      topLeftNeighbor: true,
    }
  },
  {
    id: "cliffRightBottomCorner",
    spriteSheet: tileA5_dungeon,
    spriteGridPosX: 6,
    spriteGridPosY: 5,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
      topRightNeighbor: true,
      rightNeighbor: true,
      bottomRightNeighbor: true,
      bottomNeighbor: true,
      bottomLeftNeighbor: true,
      leftNeighbor: true,
      topLeftNeighbor: false,
    }
  },
  {
    id: "cliffTopLeftEdge",
    spriteSheet: tileB_dungeon,
    spriteGridPosX: 5,
    spriteGridPosY: 0,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: false,
      topRightNeighbor: null,
      rightNeighbor: true,
      bottomRightNeighbor: true,
      bottomNeighbor: true,
      bottomLeftNeighbor: null,
      leftNeighbor: false,
      topLeftNeighbor: false,
    }
  },
  {
    id: "cliffTopCenterEdge",
    spriteSheet: tileB_dungeon,
    spriteGridPosX: 6,
    spriteGridPosY: 0,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: false,
      topRightNeighbor: null,
      rightNeighbor: true,
      bottomRightNeighbor: null,
      bottomNeighbor: true,
      bottomLeftNeighbor: null,
      leftNeighbor: true,
      topLeftNeighbor: null,
    }
  },
  {
    id: "cliffTopRightEdge",
    spriteSheet: tileB_dungeon,
    spriteGridPosX: 7,
    spriteGridPosY: 0,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: -64,
    multiplier: 32,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: false,
      topRightNeighbor: false,
      rightNeighbor: false,
      bottomRightNeighbor: null,
      bottomNeighbor: true,
      bottomLeftNeighbor: null,
      leftNeighbor: true,
      topLeftNeighbor: null,
    }
  },
]