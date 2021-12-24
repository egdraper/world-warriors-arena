import { SpriteTile } from "../models/cell.model"
import { camping } from "./camping.db"
import { grassToGrassCliffs } from "./cliffs.db"
import { crates } from "./crates.db"
import { RoadRules } from "./dirt-road.db"
import { caveDirt, dirt } from "./dirt.db"
import { greenGrass } from "./greenGrass.db"
import { rockWallGrassBase, stoneWallStoneBase, terrainRoads } from "./images"
import { RockWall } from "./rock-wall-terrain.db"
import { trees, trees2 } from "./trees.db"

export const enum TerrainType {
  Block = "Block",
  Background = "Background",
  Difficult = "Difficult",
}

export interface CoordinateViewModel {
  x?: number;
  y?: number;
}

export interface CellReadViewModel {
  id: string
  spriteId?: string
  tileLocation?: CoordinateViewModel
  spriteType?: string
  z?: number; 
  isObstructed?: boolean;
}

export interface SpriteDetails {
  id: string
  name: string // the readable name
  spriteImg: HTMLImageElement // this will change to URL
  spriteType: string
  drawingRules: SpriteTile[]
  spriteSheetOffsetX?: number,
  spriteSheetOffsetY?: number,
}

export const growableItems: SpriteDetails[] = [{
  id: "DirtCliff-GrassBackground",
  name: "Dirt Cliff with Grass Base",
  spriteType: "DrawableNaturalWall",
  spriteImg: rockWallGrassBase,
  drawingRules: RockWall
}, {
  id: "StoneCliff-StoneBase",
  name: "Stone Cliff with Stone Base",
  spriteType: "DrawableNaturalWall",
  spriteImg: stoneWallStoneBase,
  drawingRules: RockWall
}]

export const growableBaseItems: SpriteDetails[] = [{
  id: "DrawableDirtRoad",
  name: "Dirt Road Grass Base",
  spriteType: "DrawablePath",
  spriteImg: rockWallGrassBase,
  drawingRules: RoadRules,
  spriteSheetOffsetX: 0,
  spriteSheetOffsetY: 18,
}, {
  id: "DrawableStoneRoad",
  name: "Stone Road with Grass Base",
  spriteType: "DrawablePath",
  spriteImg: terrainRoads,
  drawingRules: RoadRules,
  spriteSheetOffsetX: 0,
  spriteSheetOffsetY: 5,
}]
// {
//   id: "DrawableDirtCliffs",
//   terrainType: TerrainType.Block,
//   name: "Drawable Dirt Cliffs",
//   spritesTiles: grassToGrassCliffs
//  },
//  {
//   id: "DrawableDirtRoad",
//   terrainType: TerrainType.Background,
//   name: "Drawable Dirt Road",
//   spritesTiles: roadSprites,
//   spriteSheetOffsetX: 0,
//   spriteSheetOffsetY: 18,
//  },
//  {
//   id: "DrawableStoneGrassRoad",
//   terrainType: TerrainType.Background,
//   name: "Stone Road",
//   spritesTiles: roadSprites,
//   spriteSheetOffsetX: 0,
//   spriteSheetOffsetY: 5,
//  },
//  {
//   id: "DrawableOtherGrassRoad",
//   terrainType: TerrainType.Background,
//   name: "Other Road",
//   spritesTiles: roadSprites,
//   spriteSheetOffsetX: 0,
//   spriteSheetOffsetY: 12,
//  },
//  {
//   id: "DrawableDungeon",
//   terrainType: TerrainType.Block,
//   name: "Drawable Dungeon",
//   spritesTiles: StoneWall,
//   inverted: true
//  }


 
export function getBackgroundCollection(name: string): any {
  switch(name) {
  case "greenGrass":
    return greenGrass
  case "dirt": 
    return dirt
  case "caveDirt": 
    return caveDirt
  }
}
  
export function getObjectCollection(name: string): any {
  switch(name) {
  case "cliffs":
    return grassToGrassCliffs
  case "trees": 
    return trees
  case "trees2": 
    return trees2
  case "crates": 
    return crates  
  case "camping": 
    return camping
}
}

