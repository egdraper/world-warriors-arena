import { GSM } from "../app.service.manager";
import { Cell, DefaultMapSettings, MapPosition, MarkerIconType } from "../models/cell.model";
import { GameMap } from "../models/game-map";
import { PageTransitionMarker } from "../models/marker-icon.model";
import { BaseMapGenerator } from "./base-map-generator";
import { ShortestPath } from "./shortest-path";

export class RandomMapGenerator extends BaseMapGenerator {
  public static generateMap(width: number, height: number, mapDetails: DefaultMapSettings): GameMap {
    const map = GSM.Map.createNewGrid(width, height, mapDetails, true)
    const randomLeft = 18 //Math.floor(Math.random() * ((height - 10) - 10 + 1) + 10)
    const randomRight = Math.floor(Math.random() * ((height - 10) - 10 + 1) + 10)

    this.addPortalMarkerIcons(map, randomLeft, randomRight)
    this.autoFillBackgroundTerrain(map, mapDetails.backgroundTypeId)
    this.autoPopulateForegroundTerrain(map, mapDetails, randomLeft, randomRight)
    map.defaultSettings = mapDetails
    return map
  }

  public static generateAttachmentMap(transitionFromMap: GameMap, mapDetails: DefaultMapSettings, pageTransitionMarker: PageTransitionMarker): GameMap {
    const map = GSM.Map.createNewGrid(transitionFromMap.width, transitionFromMap.height, mapDetails, false)

    const randomLeft = Math.floor(Math.random() * ((transitionFromMap.height - 10) - 10 + 1) + 10)
    const randomRight = Math.floor(Math.random() * ((transitionFromMap.height - 10) - 10 + 1) + 10)
    
    if (pageTransitionMarker.position === MapPosition.left) {
      this.addPortalMarkerIcons(map, randomLeft, randomRight, pageTransitionMarker, null)
    }

    if (pageTransitionMarker.position === MapPosition.right) {
      this.addPortalMarkerIcons(map, randomLeft, randomRight, null, pageTransitionMarker)
    }
    
    this.autoFillBackgroundTerrain(map, mapDetails.backgroundTypeId)
    this.autoPopulateForegroundTerrain(map, mapDetails, randomLeft, randomRight)
    map.defaultSettings = mapDetails
    return map
  }

  public static autoPopulateForegroundTerrain(map: GameMap, defaultMapSettings: DefaultMapSettings, randomLeft: number, randomRight: number): void {
    let path

    // Places random obstacles in the map to make the path somewhat wind around
    for (let i = 0; i < 5; i++) {
      try {
        this.clearObstacles(map)
        this.randomlyPlaceInvisibleObstacles(map)
        path = ShortestPath.find(map.grid[`x0:y${randomLeft}`], map.grid[`x${map.width - 2}:y${randomRight}`], [])

      } catch { console.log("error") }
    }
    this.clearObstacles(map)

    // Adds random objects like trees or cliffs
    this.addRandomTerrain(map, defaultMapSettings)

    // Creates a drawn path if desired
    path.forEach(cell => {
      if (cell.neighbors[0]) { cell.neighbors[0].backgroundGrowableTileId = defaultMapSettings.pathTypeId }
      if (cell.neighbors[1]) { cell.neighbors[1].backgroundGrowableTileId = defaultMapSettings.pathTypeId }
      if (cell.neighbors[4]) { cell.neighbors[4].backgroundGrowableTileId = defaultMapSettings.pathTypeId }
      cell.backgroundGrowableTileId = defaultMapSettings.pathTypeId
    })

    // creates a randomized boarder to encapsulate the map
    this.createRandomizedBoarder(map, defaultMapSettings)

    // clears all obstacles from path
    this.clearOpening(path)
    this.terrainCleanup(map)
  }

  public static setEdgeLayerRandomization(cell: Cell, neighborIndex: number, defaultMapSettings: DefaultMapSettings): void {
    const random = !Math.floor(Math.random() * 2)
    if (random) {
      if (cell.neighbors[neighborIndex]) {
        cell.neighbors[neighborIndex].obstacle = true
        cell.neighbors[neighborIndex].spriteTypeId = defaultMapSettings.terrainTypeId
      }

      cell.obstacle = true
      cell.spriteTypeId = defaultMapSettings.terrainTypeId
    }
  }

  public static randomlyPlaceInvisibleObstacles(map: GameMap): void {
    map.gridDisplay.forEach(row => {
      row.forEach(cell => {
        cell.obstacle = !Math.floor(Math.random() * 4)
      })
    })
  }

  public static addPortalMarkerIcons(map: GameMap, entranceLeftPos: number, entranceRightPos: number, leftTransitionMarker?: PageTransitionMarker, rightTransitionMarker?: PageTransitionMarker): void {
    const tokenImage = new Image()
    tokenImage.src = "assets/images/compasbig.png"

    // convert to DB
    const pageMarkerLeft = new PageTransitionMarker()
    pageMarkerLeft.id = Math.floor(Math.random() * 100000).toString()
    pageMarkerLeft.type = MarkerIconType.mapTransition
    pageMarkerLeft.position = MapPosition.left
    pageMarkerLeft.displayPosX = 16
    pageMarkerLeft.displayPosY = (entranceLeftPos * 32) - 64
    pageMarkerLeft.height = 64
    pageMarkerLeft.width = 64
    pageMarkerLeft.spritePosX = 0
    pageMarkerLeft.spritePosY = 0
    pageMarkerLeft.mapId = map.id
    pageMarkerLeft.hoverSpritePosX = 64
    pageMarkerLeft.hoverSpritePosY = 0
    pageMarkerLeft.image = tokenImage
    pageMarkerLeft.gridConnection = rightTransitionMarker || null
    GSM.GameMarker.addMarkerIcon(pageMarkerLeft)

    if(rightTransitionMarker) {
      rightTransitionMarker.gridConnection = pageMarkerLeft
    }

    const pageMarkerRight = new PageTransitionMarker()
    pageMarkerRight.id = Math.floor(Math.random() * 100000).toString()
    pageMarkerRight.type = MarkerIconType.mapTransition
    pageMarkerRight.position = MapPosition.right
    pageMarkerRight.displayPosX = (map.width * 32) - 80
    pageMarkerRight.displayPosY = entranceRightPos * 32
    pageMarkerRight.height = 64
    pageMarkerRight.width = 64
    pageMarkerRight.spritePosX = 0
    pageMarkerRight.spritePosY = 0
    pageMarkerRight.mapId = map.id
    pageMarkerRight.hoverSpritePosX = 64
    pageMarkerRight.hoverSpritePosY = 0
    pageMarkerRight.image = tokenImage
    pageMarkerRight.gridConnection = leftTransitionMarker || null
    GSM.GameMarker.addMarkerIcon(pageMarkerRight)

    if(leftTransitionMarker) {
      leftTransitionMarker.gridConnection = pageMarkerRight
    }
  }
}