import { DrawableTiles } from "../models/cell.model"
import { camping } from "./camping.db"
import { grassToGrassCliffs } from "./cliffs.db"
import { crates } from "./crates.db"
import { dirtRoad } from "./dirt-road.db"
import { caveDirt, dirt } from "./dirt.db"
import { dungeon1, dungeonTiles } from "./dungeon.db"
import { greenGrass } from "./greenGrass.db"
import { trees, trees2 } from "./trees.db"



export const enum TerrainType {
  Block = "Block",
  Background = "Background",
  Difficult = "Difficult",
}

export const growableItems: DrawableTiles[] = [{
  id: "DrawableTree",
  name: "Drawable Tree Cluster",
  terrainType: TerrainType.Block,
  spritesTiles: trees
},
{
  id: "DrawableDirtCliffs",
  terrainType: TerrainType.Block,
  name: "Drawable Dirt Cliffs",
  spritesTiles: grassToGrassCliffs
 },
 {
  id: "DrawableDirtRoad",
  terrainType: TerrainType.Background,
  name: "Drawable Dirt Road",
  spritesTiles: dirtRoad
 },
 {
  id: "DrawableDungeon",
  terrainType: TerrainType.Block,
  name: "Drawable Dungeon",
  spritesTiles: dungeon1,
  inverted: true
 }
]

 
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
  case "dirtRoad": 
    return dirtRoad
  case "camping": 
    return camping
  case "dungeon": 
    return dungeon1
  case "dungeonTiles": 
    return dungeonTiles
  }
}

