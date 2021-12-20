import { SpriteTile } from "../models/cell.model";
import { tileA2_outside, tileA5_outside, tileB_outside } from "./images";

export const caveRoad: SpriteTile[] = [
  {
    id: "caveRoadCenter",
    default: true,
    spriteSheet: tileA5_outside,
    spriteGridPosX: 21,
    spriteGridPosY: 6,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    visionBlocking: false,
    obstacle: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: false,
      topRightNeighbor: false,
      rightNeighbor: false,
      bottomRightNeighbor: false,
      bottomNeighbor: false,
      bottomLeftNeighbor: false,
      leftNeighbor: false,
      topLeftNeighbor: false,
    }
  },
  {
    id: "caveRoadTopLeft",
    spriteSheet: tileA2_outside,
    spriteGridPosX: 2,
    spriteGridPosY: 1,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    visionBlocking: false,
    obstacle: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: false,
      topRightNeighbor: false,
      rightNeighbor: true,
      bottomRightNeighbor: true,
      bottomNeighbor: true,
      bottomLeftNeighbor: false,
      leftNeighbor: false,
      topLeftNeighbor: false,
    }
  },
  {
    id: "caveRoadTopRight",
    spriteSheet: tileA2_outside,
    spriteGridPosX: 3,
    spriteGridPosY: 1,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    visionBlocking: false,
    obstacle: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: false,
      topRightNeighbor: false,
      rightNeighbor: false,
      bottomRightNeighbor: null,
      bottomNeighbor: true,
      bottomLeftNeighbor: true,
      leftNeighbor: true,
      topLeftNeighbor: false,
    }
  },
  {
    id: "caveRoadBottomRight",
    spriteSheet: tileA2_outside,
    spriteGridPosX: 3,
    spriteGridPosY: 2,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    visionBlocking: false,
    obstacle: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
      topRightNeighbor: false,
      rightNeighbor: false,
      bottomRightNeighbor: null,
      bottomNeighbor: false,
      bottomLeftNeighbor: null,
      leftNeighbor: true,
      topLeftNeighbor: true,
    }
  },
  {
    id: "caveRoadBottomLeft",
    spriteSheet: tileA2_outside,
    spriteGridPosX: 2,
    spriteGridPosY: 2,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    visionBlocking: false,
    obstacle: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
      topRightNeighbor: true,
      rightNeighbor: true,
      bottomRightNeighbor: null,
      bottomNeighbor: false,
      bottomLeftNeighbor: null,
      leftNeighbor: false,
      topLeftNeighbor: false,
    }
  },
  {
    id: "caveRoadTopCenter",
    spriteSheet: greenGrassEdges,
    spriteGridPosX: 3,
    spriteGridPosY: 0,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    sizeAdjustment: 32,
    visionBlocking: false,
    obstacle: false,
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
    id: "caveRoadBottomCenter",
    spriteSheet: greenGrassEdges,
    spriteGridPosX: 12,
    spriteGridPosY: 0,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    sizeAdjustment: 32,
    visionBlocking: false,
    obstacle: false,
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
    id: "caveRoadRightCenter",
    spriteSheet: greenGrassEdges,
    spriteGridPosX: 10,
    spriteGridPosY: 0,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    sizeAdjustment: 32,
    visionBlocking: false,
    obstacle: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
      topRightNeighbor: null,
      rightNeighbor: false,
      bottomRightNeighbor: null,
      bottomNeighbor: true,
      bottomLeftNeighbor: null,
      leftNeighbor: true,
      topLeftNeighbor: null,
    }
  },
  {
    id: "caveRoadLeftCenter",
    spriteSheet: greenGrassEdges,
    spriteGridPosX: 5,
    spriteGridPosY: 0,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    sizeAdjustment: 32,
    visionBlocking: false,
    obstacle: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
      topRightNeighbor: null,
      rightNeighbor: true,
      bottomRightNeighbor: null,
      bottomNeighbor: true,
      bottomLeftNeighbor: null,
      leftNeighbor: false,
      topLeftNeighbor: null,
    }
  },
  {
    id: "caveRoadLeftCornerAngle",
    spriteSheet: greenGrassEdges,
    spriteGridPosX: 13,
    spriteGridPosY: 0,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    sizeAdjustment: 32,
    visionBlocking: false,
    obstacle: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: null,
      topRightNeighbor: null,
      rightNeighbor: true,
      bottomRightNeighbor: null,
      bottomNeighbor: false,
      bottomLeftNeighbor: false,
      leftNeighbor: false,
      topLeftNeighbor: null,
    }
  },
  {
    id: "caveRoadRightCornerAngle",
    spriteSheet: greenGrassEdges,
    spriteGridPosX: 14,
    spriteGridPosY: 0,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    sizeAdjustment: 32,
    visionBlocking: false,
    obstacle: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
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
    id: "caveRoadLeftCornerAngleTop",
    spriteSheet: greenGrassEdges,
    spriteGridPosX: 7,
    spriteGridPosY: 0,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    sizeAdjustment: 32,
    visionBlocking: false,
    obstacle: false,
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
    id: "caveRoadLeftCornerAngleTop",
    spriteSheet: greenGrassEdges,
    spriteGridPosX: 11,
    spriteGridPosY: 0,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    sizeAdjustment: 32,
    visionBlocking: false,
    obstacle: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: false,
      topRightNeighbor: false,
      rightNeighbor: false,
      bottomRightNeighbor: null,
      bottomNeighbor: null,
      bottomLeftNeighbor: null,
      leftNeighbor: true,
      topLeftNeighbor: null,
    }
  },
  {
    id: "caveRoadLeftCornerAngleTop",
    spriteSheet: greenGrassEdges,
    spriteGridPosX: 1,
    spriteGridPosY: 0,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    sizeAdjustment: 32,
    visionBlocking: false,
    obstacle: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
      topRightNeighbor: true,
      rightNeighbor: true,
      bottomRightNeighbor: null,
      bottomNeighbor: true,
      bottomLeftNeighbor: true,
      leftNeighbor: true,
      topLeftNeighbor: false,
    }
  },
  {
    id: "caveRoadLeftCornerAngleTop",
    spriteSheet: greenGrassEdges,
    spriteGridPosX: 2,
    spriteGridPosY: 0,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    sizeAdjustment: 32,
    visionBlocking: false,
    obstacle: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
      topRightNeighbor: false,
      rightNeighbor: true,
      bottomRightNeighbor: true,
      bottomNeighbor: true,
      bottomLeftNeighbor: null,
      leftNeighbor: true,
      topLeftNeighbor: true,
    }
  },
  {
    id: "caveRoadLeftCornerAngleTop",
    spriteSheet: greenGrassEdges,
    spriteGridPosX: 4,
    spriteGridPosY: 0,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    sizeAdjustment: 32,
    visionBlocking: false,
    obstacle: false,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
      topRightNeighbor: null,
      rightNeighbor: true,
      bottomRightNeighbor: true,
      bottomNeighbor: true,
      bottomLeftNeighbor: true,
      leftNeighbor: true,
      topLeftNeighbor: false,
    }
  },
  {
    id: "caveRoadLeftCornerAngleTop",
    spriteSheet: greenGrassEdges,
    spriteGridPosX: 8,
    spriteGridPosY: 0,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    multiplier: 32,
    sizeAdjustment: 32,
    visionBlocking: false,
    obstacle: false,
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
      topLeftNeighbor: null,
    }
  },
]