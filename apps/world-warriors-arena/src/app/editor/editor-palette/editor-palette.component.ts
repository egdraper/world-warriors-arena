import { Component, OnInit } from '@angular/core';
import { ShortestPath } from '../../game-engine/shortest-path';
import { growableItems, TerrainType } from '../../game-assets/tiles.db.ts/tile-assets.db';
import { GridService } from '../../game-engine/grid.service';
import { MapDetails, SpriteTile } from '../../models/cell.model';
import { RandomMapGenerator } from '../map-generator/random-map-generator';
import { EditorService } from './editor.service';
import { AssetsService } from '../../game-assets/assets.service';
import { CanvasService } from '../../canvas/canvas.service';
import { DrawService } from '../../game-engine/draw-tools/draw.service';
import { GameSettings } from '../../models/game-settings';

@Component({
  selector: 'world-warriors-arena-editor-palette',
  templateUrl: './editor-palette.component.html',
  styleUrls: ['./editor-palette.component.scss']
})
export class EditorPaletteComponent implements OnInit {
  public images: any[] = []
  public imageArray: any[] = []
  public currentImageSrc: string = ""
  public lockState = "Locked"

  constructor(
    public assetService: AssetsService,
    public canvasService: CanvasService,
    private editorService: EditorService,
    private shortestPath: ShortestPath,
    public grid: GridService,
    private drawService: DrawService
  ) { }

  ngOnInit(): void {
    this.imageArray = this.editorService.findObjectCollection("trees")
  }

  public onSelectionChange(change: any): void {
    this.editorService.selectedGrowableAsset = growableItems.find(item => item.name === change.value).id
  }

  public onTilesChange(change: any): void {
    this.imageArray = this.editorService.findObjectCollection(change.value)
  }

  public tileClick(tile: SpriteTile): void {
    this.editorService.selectedAsset = tile
  }

  public switchGrid(gridId: string): void {
    this.grid.switchGrid(gridId)
  }

  public changeLockState(): void {
    this.lockState = this.lockState === "Locked" ? "UnLocked" : "Locked"

    if(this.lockState === "Locked") {
      if(this.assetService.selectedGameComponent) {
        this.canvasService.centerOverAsset(this.assetService.selectedGameComponent, this.grid.activeGrid)
      }
      GameSettings.gm = false
    } else {
      GameSettings.gm = true
    }

  }

  public baseClicked(): void {
    this.editorService.layerID++
    // this.editorService.baseOnly = true
  }

  public changeScale(scale: any): void {
    const tempViewPortX = this.canvasService.canvasViewPortOffsetX
    const tempViewPortY = this.canvasService.canvasViewPortOffsetY

    this.canvasService.resetViewport()
    GameSettings.scale = Number(scale.value)
 
    this.canvasService.setupCanvases()
    this.editorService.backgroundDirty  = true
    this.assetService.obstaclesDirty = true

    let perfectHeight = window.innerHeight
   
    while (perfectHeight % (GameSettings.scale * 32) !== 0) {
      perfectHeight--
    }

    this.canvasService.maxCellCountX = perfectHeight / (32 * GameSettings.scale)
    // this.canvasService.adustViewPort(tempViewPortX, tempViewPortY)

   
  }

  public invertedClicked(): void {
    this.grid.activeGrid.inverted = !this.grid.activeGrid.inverted
  }


  public generateRandomMap(): void {
    const mapGenerator = new RandomMapGenerator(this.editorService, this.shortestPath, this.grid)

    const mapDetails: MapDetails = {
      backgroundTypeId: "greenGrass",
      terrainTypeId: "DrawableTrees",
      inverted: true,
      pathTypeId: undefined,
      width: 50,
      height: 50
    }

    mapGenerator.generateMap(mapDetails)
    this.canvasService.setupCanvases()

    // CLEANUP - Rethink the "Dirty" locations, if they should be in drawing service or where they are
    this.assetService.obstaclesDirty = true
    this.editorService.backgroundDirty = true

    // CLEANUP - Needs to be moved into somewhere that re-draws
    this.drawService.drawGridLines()

    const centerCell = this.grid.activeGrid.getGridCellByCoordinate(Math.floor(this.canvasService.canvasSize / 2), Math.floor(this.canvasService.canvasSize / 2))
    this.canvasService.centerPointX = centerCell.posX * GameSettings.scale
    this.canvasService.centerPointY = centerCell.posY * GameSettings.scale
  }


}
