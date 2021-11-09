import { ShortestPath } from "../../game-engine/shortest-path";
import { GridService } from "../../game-engine/grid.service";
import { Cell, MapDetails } from "../../models/cell.model";
import { EditorService } from "../editor-palette/editor.service";
import { BaseMapGenerator } from "./base-map-generator";

export class RandomMapGenerator extends BaseMapGenerator {
  constructor(
    public editorService: EditorService,
    public shortestPath: ShortestPath,
    public gridService: GridService
  ) { 
    super(editorService, shortestPath, gridService)
  }

  public generateMap(mapDetails: MapDetails) {
    this.mapDetails = mapDetails
    this.createGrid()
    this.autoFillBackgroundTerrain(mapDetails.backgroundTypeId)
    this.autoPopulateForegroundTerrain()
  }

  public createGrid(): void {
    this.gridService.createGrid(this.mapDetails.width, this.mapDetails.height, this.mapDetails.terrainTypeId)
  }

  public autoPopulateForegroundTerrain(): void {
    const randomLeft = Math.floor(Math.random() * (this.mapDetails.height - 3) + 3)
    const randomRight = Math.floor(Math.random() * (this.mapDetails.height - 3) + 3)

    let path

    // Places random obstacles in the map to make the path somewhat wind around
    for (let i = 0; i < 5; i++) {
      try {
        this.clearObstacles()
        this.randomlyPlaceLargeObstacles()
        path = this.shortestPath.find(this.gridService.grid[`x0:y${randomLeft}`], this.gridService.grid[`x${this.gridService.width - 2}:y${randomRight}`], [])

      } catch { }
    }
    this.clearObstacles()

    // Adds random objects like trees or cliffs
    this.addRandomTerrain()
    
    // Creates a drawn path if desired
    path.forEach(cell => {
      if (cell.neighbors[0]) { cell.neighbors[0].backgroundGrowableTileId = this.mapDetails.pathTypeId }
      if (cell.neighbors[1]) { cell.neighbors[1].backgroundGrowableTileId = this.mapDetails.pathTypeId }
      if (cell.neighbors[4]) { cell.neighbors[4].backgroundGrowableTileId = this.mapDetails.pathTypeId }
      cell.backgroundGrowableTileId = this.mapDetails.pathTypeId
    })

    // creates a randomized boarder to encapsulate the map
    this.createRandomizedBoarder()

    // clears all obstacles from path
    this.clearOpening(path)
    this.terrainCleanup()
    this.editorService.backgroundDirty = true
  }

  public setEdgeLayerRandomization(cell: Cell, neighborIndex: number): void {
    const random = !!!Math.floor(Math.random() * 2)
    if (random) {
      if (cell.neighbors[neighborIndex]) {
        cell.neighbors[neighborIndex].obstacle = true
        cell.neighbors[neighborIndex].growableTileId = this.mapDetails.terrainTypeId
      }

      cell.obstacle = true
      cell.growableTileId = this.mapDetails.terrainTypeId
    }
  }

  public randomlyPlaceLargeObstacles(): void {
    this.gridService.gridDisplay.forEach(row => {
      row.forEach(cell => {
        cell.obstacle = !!!Math.floor(Math.random() * 4)
      })
    })
  }
}