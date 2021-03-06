
import { SpriteTile } from "../models/cell.model";
import { tileA5_outside } from "./images";

export const grassToGrassCliffs: SpriteTile[] = [
  {
    id: "cliffTopLeft",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 0,
    spriteGridPosY: 11,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
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
      leftNeighbor: false,
      topLeftNeighbor: false,
    }
  },
  {
    id: "cliffTopCenter",
    spriteSheet: tileA5_outside,
    default: true,
    spriteGridPosX: 1,
    spriteGridPosY: 11,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: false,
      topRightNeighbor: false,
      rightNeighbor: true,
      bottomRightNeighbor: true,
      bottomNeighbor: true,
      bottomLeftNeighbor: true,
      leftNeighbor: true,
      topLeftNeighbor: false,
    }
  },
  {
    id: "cliffTopRight",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 2,
    spriteGridPosY: 11,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
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
  {
    id: "cliffGrowableLeft",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 0,
    spriteGridPosY: 12,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
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
    id: "cliffGrowableCenter",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 1,
    spriteGridPosY: 12,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
      topRightNeighbor: true,
      rightNeighbor: true,
      bottomRightNeighbor: null,
      bottomNeighbor: true,
      bottomLeftNeighbor: null,
      leftNeighbor: true,
      topLeftNeighbor: true,
    }
  },
  {
    id: "cliffGrowableRight",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 2,
    spriteGridPosY: 12,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
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
      bottomLeftNeighbor: null,
      leftNeighbor: true,
      topLeftNeighbor: null,
    }
  },
  {
    id: "cliffBottomLeft",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 0,
    spriteGridPosY: 13,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
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
      leftNeighbor: false,
      topLeftNeighbor: null,
    }
  },
  {
    id: "cliffBottomCenter",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 1,
    spriteGridPosY: 13,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
      topRightNeighbor: true,
      rightNeighbor: true,
      bottomRightNeighbor: null,
      bottomNeighbor: false,
      bottomLeftNeighbor: null,
      leftNeighbor: true,
      topLeftNeighbor: true,
    }
  },
  {
    id: "cliffBottomRight",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 2,
    spriteGridPosY: 13,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
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
    id: "cliffEdgeLeft",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 0,
    spriteGridPosY: 10,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: false,
      topRightNeighbor: false,
      rightNeighbor: false,
      bottomRightNeighbor: true,
      bottomNeighbor: true,
      bottomLeftNeighbor: false,
      leftNeighbor: false,
      topLeftNeighbor: false,
    }
  },
  {
    id: "cliffEdgeRight",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 0,
    spriteGridPosY: 9,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: null,
      topRightNeighbor: false,
      rightNeighbor: false,
      bottomRightNeighbor: false,
      bottomNeighbor: false,
      bottomLeftNeighbor: null,
      leftNeighbor: true,
      topLeftNeighbor: null,
    }
  },
  {
    id: "cliffEdgeFillTopLeft",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 6,
    spriteGridPosY: 9,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: false,
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
    id: "cliffEdgeFillTopRight",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 7,
    spriteGridPosY: 9,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: false,
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
    id: "cliffEdgeFillCenterLeft",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 6,
    spriteGridPosY: 11,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
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
    id: "cliffEdgeFillCenterRight",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 7,
    spriteGridPosY: 11,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
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
    id: "cliffEdgeFillBottomLeft",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 6,
    spriteGridPosY: 14,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: null,
      topRightNeighbor: false,
      rightNeighbor: false,
      bottomRightNeighbor: false,
      bottomNeighbor: false,
      bottomLeftNeighbor: null,
      leftNeighbor: true,
      topLeftNeighbor: null,
    }
  },
  {
    id: "cliffEdgeFillBottomRight",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 7,
    spriteGridPosY: 14,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: null,
      topRightNeighbor: false,
      rightNeighbor: false,
      bottomRightNeighbor: false,
      bottomNeighbor: false,
      bottomLeftNeighbor: null,
      leftNeighbor: true,
      topLeftNeighbor: null,
    }
  },
  {
    id: "cliffEdgeFillBottomLeftTopCorner",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 2,
    spriteGridPosY: 15,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
      topRightNeighbor: null,
      rightNeighbor: true,
      bottomRightNeighbor: false,
      bottomNeighbor: false,
      bottomLeftNeighbor: true,
      leftNeighbor: true,
      topLeftNeighbor: true,
    }
  },
  {
    id: "cliffEdgeFillBottomRightTopCorner",
    spriteSheet: tileA5_outside,
    spriteGridPosX: 3,
    spriteGridPosY: 15,
    tileHeight: 1,
    tileWidth: 1,
    tileOffsetX: 0,
    tileOffsetY: 0,
    visionBlocking: false,
    obstacle: true,
    obstacleObstructionX: 1,
    obstacleObstructionY: 1,
    drawWhen: {
      topNeighbor: true,
      topRightNeighbor: true,
      rightNeighbor: true,
      bottomRightNeighbor: true,
      bottomNeighbor: false,
      bottomLeftNeighbor: false,
      leftNeighbor: null,
      topLeftNeighbor: null,
    }
  },
]
