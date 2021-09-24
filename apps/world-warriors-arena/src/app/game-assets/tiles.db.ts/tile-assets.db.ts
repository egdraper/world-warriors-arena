import { cliffs } from "./cliffs.db"
import { crates } from "./crates.db"
import { dirt } from "./dirt.db"
import { greenGrass } from "./greenGrass.db"
import { trees } from "./trees.db"

 
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
    return cliffs
  case "trees": 
    return trees
  case "crates": 
    return crates
  }
}


