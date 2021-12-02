import { tileA5_dungeon, tileA5_outside, tileB_dungeon } from "./images";

export const caveDirt = [
  {
    id: "dirt1",
    spriteSheet: tileA5_dungeon,
    spriteGridPosX: [4, 5],
    spriteGridPosY: [3],
    rarity: 50
  },
  {
    id: "dirt2",
    spriteSheet: tileA5_dungeon,
    spriteGridPosX: [2,3],
    spriteGridPosY: [3],
    rarity: 30
  },
  {
    id: "dirt3",
    spriteSheet: tileA5_dungeon,
    spriteGridPosX: [0,1,6,7],
    spriteGridPosY: [3],
    rarity: 5
  },
  {
    id: "dirt3",
    spriteSheet: tileA5_dungeon,
    spriteGridPosX: [0,1,2,3,4,5,6,7],
    spriteGridPosY: [4],  
    rarity: 5
  },
]

export const dirt = [
  {
    id: "dirt1",
    spriteSheet: tileA5_outside,
    spriteGridPosX: [0],
    spriteGridPosY: [6],
    rarity: 25
  },
  {
    id: "dirt2",
    spriteSheet: tileA5_outside,
    spriteGridPosX: [1],
    spriteGridPosY: [6],
    rarity: 10
  },
  {
    id: "dirt3",
    spriteSheet: tileA5_outside,
    spriteGridPosX: [2],
    spriteGridPosY: [6],
    rarity: 100
  },
  {
    id: "dirt4",
    spriteSheet: tileA5_outside,
    spriteGridPosX: [3],
    spriteGridPosY: [6],
    rarity: 50
  },
  {
    id: "dirtGrass",
    spriteSheet: tileA5_outside,
    spriteGridPosX: [4, 5, 6, 7],
    spriteGridPosY: [6],
    rarity: 10
  },
  {
    id: "dirtGrass",
    spriteSheet: tileA5_outside,
    spriteGridPosX: [0, 1, 2, 3, 4, 5, 6, 7],
    spriteGridPosY: [7, 8],
    rarity: 10
  }
]
