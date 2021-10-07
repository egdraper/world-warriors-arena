import { grassToGrassCliffs } from "./cliffs.db"
import { crates } from "./crates.db"
import { dirtRoad } from "./dirt-road.db"
import { dirt } from "./dirt.db"
import { greenGrass } from "./greenGrass.db"
import { trees } from "./trees.db"


export const enum TerrainType {
  Block = "Block",
  Background = "Background",
  Difficult = "Difficult",
}

export const growableItems = [{
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
]

 
export function getBackgroundCollection(name: string): any {
  switch(name) {
  case "greenGrass":
    return greenGrass
  case "dirt": 
    return dirt
  }
}
  
export function getObjectCollection(name: string): any {
  switch(name) {
  case "cliffs":
    return grassToGrassCliffs
  case "trees": 
    return trees
  case "crates": 
    return crates
  }
}


