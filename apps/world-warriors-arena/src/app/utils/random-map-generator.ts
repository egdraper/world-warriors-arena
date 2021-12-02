import { GSM } from "../app.service.manager";
import { GameMap } from "../services/map.service";
import { Cell, DefaultMapSettings, MapPosition, MarkerIconType } from "../models/cell.model";
import { PageTransitionMarker } from "../models/markers-icons";
import { BaseMapGenerator } from "./base-map-generator";
import { ShortestPath } from "./shortest-path";

export class RandomMapGenerator extends BaseMapGenerator {
  public generateMap(width: number, height: number, mapDetails: DefaultMapSettings): GameMap {
    const map = GSM.Map.createNewGrid(width, height, mapDetails)
    const randomLeft = Math.floor(Math.random() * ((height - 10) - 10 + 1) + 10)
    const randomRight = Math.floor(Math.random() * ((height - 10) - 10 + 1) + 10)

    this.addPortalMarkerIcons(map, randomLeft, randomRight)
    this.autoFillBackgroundTerrain(mapDetails.backgroundTypeId)
    this.autoPopulateForegroundTerrain(mapDetails, randomLeft, randomRight)
    map.defaultSettings = mapDetails
    return map
  }

  public generateAttachmentMap(transitionFromMap: GameMap, mapDetails: DefaultMapSettings, pageTransitionMarker: PageTransitionMarker): GameMap {
    const map = GSM.Map.createNewGrid(transitionFromMap.width, transitionFromMap.height, mapDetails)
    const randomLeft = Math.floor(Math.random() * ((transitionFromMap.height - 10) - 10 + 1) + 10)
    const randomRight = Math.floor(Math.random() * ((transitionFromMap.height - 10) - 10 + 1) + 10)
    
    if (pageTransitionMarker.position === MapPosition.left) {
      this.addPortalMarkerIcons(map, randomLeft, randomRight, pageTransitionMarker, null)
    }
    if (pageTransitionMarker.position === MapPosition.right) {
      this.addPortalMarkerIcons(map, randomLeft, randomRight, null, pageTransitionMarker)
    }
    
    this.autoFillBackgroundTerrain(mapDetails.backgroundTypeId)
    this.autoPopulateForegroundTerrain(mapDetails, randomLeft, randomRight)
    map.defaultSettings = mapDetails
    return map
  }

  public autoPopulateForegroundTerrain(defaultMapSettings: DefaultMapSettings, randomLeft: number, randomRight: number): void {
    let path

    // Places random obstacles in the map to make the path somewhat wind around
    for (let i = 0; i < 5; i++) {
      try {
        this.clearObstacles()
        this.randomlyPlaceInvisibleObstacles()
        path = ShortestPath.find(GSM.Map.activeGrid.grid[`x0:y${randomLeft}`], GSM.Map.activeGrid.grid[`x${GSM.Map.activeGrid.width - 2}:y${randomRight}`], [])

      } catch { }
    }
    this.clearObstacles()

    // Adds random objects like trees or cliffs
    this.addRandomTerrain(defaultMapSettings)

    // Creates a drawn path if desired
    path.forEach(cell => {
      if (cell.neighbors[0]) { cell.neighbors[0].backgroundGrowableTileId = defaultMapSettings.pathTypeId }
      if (cell.neighbors[1]) { cell.neighbors[1].backgroundGrowableTileId = defaultMapSettings.pathTypeId }
      if (cell.neighbors[4]) { cell.neighbors[4].backgroundGrowableTileId = defaultMapSettings.pathTypeId }
      cell.backgroundGrowableTileId = defaultMapSettings.pathTypeId
    })

    // creates a randomized boarder to encapsulate the map
    this.createRandomizedBoarder(defaultMapSettings)

    // clears all obstacles from path
    this.clearOpening(path)
    this.terrainCleanup()
    GSM.Editor.backgroundDirty = true
  }

  public setEdgeLayerRandomization(cell: Cell, neighborIndex: number, defaultMapSettings: DefaultMapSettings): void {
    const random = !!!Math.floor(Math.random() * 2)
    if (random) {
      if (cell.neighbors[neighborIndex]) {
        cell.neighbors[neighborIndex].obstacle = true
        cell.neighbors[neighborIndex].growableTileId = defaultMapSettings.terrainTypeId
      }

      cell.obstacle = true
      cell.growableTileId = defaultMapSettings.terrainTypeId
    }
  }

  public randomlyPlaceInvisibleObstacles(): void {
    GSM.Map.activeGrid.gridDisplay.forEach(row => {
      row.forEach(cell => {
        cell.obstacle = !!!Math.floor(Math.random() * 4)
      })
    })
  }

  public addPortalMarkerIcons(map: GameMap, entranceLeftPos: number, entranceRightPos: number, leftTransitionMarker?: PageTransitionMarker, rightTransitionMarker?: PageTransitionMarker): void {
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
    pageMarkerRight.displayPosX = (GSM.Map.activeGrid.width * 32) - 80
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