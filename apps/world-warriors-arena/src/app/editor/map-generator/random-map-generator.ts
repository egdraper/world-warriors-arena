import { ShortestPath } from "../../game-engine/shortest-path";
import { GridService, GameMap } from "../../game-engine/grid.service";
import { Cell, DefaultMapSettings, MapPosition, MarkerIconType } from "../../models/cell.model";
import { EditorService } from "../editor-palette/editor.service";
import { BaseMapGenerator } from "./base-map-generator";
import { GameMarkersService } from "../../game-assets/game-markers";
import { PageTransitionMarker } from "../../models/markers-icons";

export class RandomMapGenerator extends BaseMapGenerator {
  constructor(
    public editorService: EditorService,
    public shortestPath: ShortestPath,
    public gridService: GridService,
    public gameMarkerService: GameMarkersService
  ) {
    super(editorService, shortestPath, gridService)
  }

  public generateMap(width: number, height: number, mapDetails: DefaultMapSettings): GameMap {
    const map = this.gridService.createNewGrid(width, height, mapDetails)
    const randomLeft = Math.floor(Math.random() * (height - 3) + 3)
    const randomRight = Math.floor(Math.random() * (height - 3) + 3)

    this.addPortalMarkerIcons(map, randomLeft, randomRight)
    this.autoFillBackgroundTerrain(mapDetails.backgroundTypeId)
    this.autoPopulateForegroundTerrain(mapDetails, randomLeft, randomRight)
    map.defaultSettings = mapDetails
    return map
  }

  public generateAttachmentMap(transitionFromMap: GameMap, mapDetails: DefaultMapSettings, attachmentSettings: PageTransitionMarker): GameMap {
    const attachedMap = this.generateMap(transitionFromMap.width, transitionFromMap.height, mapDetails)
    const randomLeft = Math.floor(Math.random() * (transitionFromMap.height - 3) + 3)
    const randomRight = Math.floor(Math.random() * (transitionFromMap.height - 3) + 3)
    if (attachmentSettings.position === MapPosition.left) {
      this.addPortalMarkerIcons(attachedMap, randomLeft, randomRight, null, attachmentSettings)
    }
    if (attachmentSettings.position === MapPosition.right) {
      this.addPortalMarkerIcons(attachedMap, randomLeft, randomRight, attachmentSettings, null)
    }
    this.autoFillBackgroundTerrain(mapDetails.backgroundTypeId)
    this.autoPopulateForegroundTerrain(mapDetails, randomLeft, randomRight)
    attachedMap.defaultSettings = mapDetails
    return attachedMap
  }

  public autoPopulateForegroundTerrain(defaultMapSettings: DefaultMapSettings, randomLeft: number, randomRight: number): void {
    let path

    // Places random obstacles in the map to make the path somewhat wind around
    for (let i = 0; i < 5; i++) {
      try {
        this.clearObstacles()
        this.randomlyPlaceInvisibleObstacles()
        path = this.shortestPath.find(this.gridService.activeGrid.grid[`x0:y${randomLeft}`], this.gridService.activeGrid.grid[`x${this.gridService.activeGrid.width - 2}:y${randomRight}`], [])

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
    this.editorService.backgroundDirty = true
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
    this.gridService.activeGrid.gridDisplay.forEach(row => {
      row.forEach(cell => {
        cell.obstacle = !!!Math.floor(Math.random() * 4)
      })
    })
  }

  public addPortalMarkerIcons(map: GameMap, entranceLeftPos: number, entranceRightPos: number, leftTransitionMarker?: PageTransitionMarker, rightTransitionMarker?: PageTransitionMarker): void {
    const tokenImage = new Image()
    tokenImage.src = "assets/images/compasbig.png"

    // convert to DB
    const pageMarkerLeft = new PageTransitionMarker(this.gridService)
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
    this.gameMarkerService.addMarkerIcon(pageMarkerLeft)

    const pageMarkerRight = new PageTransitionMarker(this.gridService)
    pageMarkerRight.id = Math.floor(Math.random() * 100000).toString()
    pageMarkerRight.type = MarkerIconType.mapTransition
    pageMarkerRight.position = MapPosition.right
    pageMarkerRight.displayPosX = (this.gridService.activeGrid.width * 32) - 80
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
    this.gameMarkerService.addMarkerIcon(pageMarkerRight)
  }
}