import { Component, OnInit } from '@angular/core';
import { GSM } from '../../app.service.manager';
import { growableItems } from '../../game-assets/tiles.db.ts/tile-assets.db';
import { DefaultMapSettings, MarkerIconType, SpriteTile } from '../../models/cell.model';
import { GameSettings } from '../../models/game-settings';
import { MarkerIcon, PageTransitionMarker } from '../../models/markers-icons';
import { RandomMapGenerator } from '../map-generator/random-map-generator';

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
  public mapService = GSM.Map
  public canvasService = GSM.Canvas

  constructor() {
    GSM.GameMarker.iconClick.subscribe(this.onGameMarkerClicked.bind(this))
  }

  ngOnInit(): void {

    this.imageArray = GSM.Editor.findObjectCollection("trees")
  }

  public onSelectionChange(change: any): void {
    GSM.Editor.selectedGrowableAsset = growableItems.find(item => item.name === change.value).id
  }

  public onTilesChange(change: any): void {
    this.imageArray = GSM.Editor.findObjectCollection(change.value)
  }

  public tileClick(tile: SpriteTile): void {
    GSM.Editor.selectedAsset = tile
  }

  public switchGrid(gridId: string): void {
    GSM.Map.switchGrid(gridId)
  }

  public changeLockState(): void {
    this.lockState = this.lockState === "Locked" ? "UnLocked" : "Locked"

    if (this.lockState === "Locked") {
      if (GSM.Assets.selectedGameComponent) {
        GSM.Canvas.centerOverAsset(GSM.Assets.selectedGameComponent, GSM.Map.activeGrid)
      }
      GameSettings.gm = false
    } else {
      GameSettings.gm = true
    }

  }

  public baseClicked(): void {
    GSM.Editor.layerID++
    // GSM.Editor.baseOnly = true
  }

  public changeScale(scale: any): void {
    const tempViewPortX = GSM.Canvas.canvasViewPortOffsetX
    const tempViewPortY = GSM.Canvas.canvasViewPortOffsetY

    GSM.Canvas.resetViewport()
    GameSettings.scale = Number(scale.value)

    GSM.Canvas.setupCanvases()
    GSM.Editor.backgroundDirty = true
    GSM.Assets.obstaclesDirty = true

    let perfectHeight = window.innerHeight

    while (perfectHeight % (GameSettings.scale * 32) !== 0) {
      perfectHeight--
    }

    GSM.Canvas.maxCellCountX = perfectHeight / (32 * GameSettings.scale)
    // GSM.Canvas.adustViewPort(tempViewPortX, tempViewPortY)


  }

  public invertedClicked(): void {
    GSM.Map.activeGrid.defaultSettings.inverted = !GSM.Map.activeGrid.defaultSettings.inverted
  }

  public onGameMarkerClicked(markerIcon: MarkerIcon): void {
    if (markerIcon.type === MarkerIconType.mapTransition) {
      this.generateRandomAttachmentMap(markerIcon as PageTransitionMarker)
    }
  }

  public generateRandomAttachmentMap(markerIcon: PageTransitionMarker): void {
    const mapGenerator = new RandomMapGenerator()
   
    // allow for override
    const mapDetails: DefaultMapSettings = {
      autoGeneratedMap: true,
      backgroundTypeId: "greenGrass",
      terrainTypeId: "DrawableTrees",
      inverted: false,
      pathTypeId: "DrawableDirtRoad"
    }
   
    mapGenerator.generateAttachmentMap(GSM.Map.activeGrid, mapDetails, markerIcon)
    GSM.Canvas.setupCanvases()

    // CLEANUP - Rethink the "Dirty" locations, if they should be in drawing service or where they are
    GSM.Assets.obstaclesDirty = true
    GSM.Editor.backgroundDirty = true

    // CLEANUP - Needs to be moved into somewhere that re-draws
    const centerCell = GSM.Map.activeGrid.getGridCellByCoordinate(Math.floor(GSM.Canvas.canvasSizeX / 2), Math.floor(GSM.Canvas.canvasSizeY / 2))
    GSM.Canvas.centerPointX = centerCell.posX * GameSettings.scale
    GSM.Canvas.centerPointY = centerCell.posY * GameSettings.scale

    GSM.Draw.blackOutFogPainter.paint()
    GSM.FogOfWar.createCellLines()
  }

  public generateRandomCoreMap(): void {
    const mapGenerator = new RandomMapGenerator()

    const mapDetails: DefaultMapSettings = {
      autoGeneratedMap: true,
      backgroundTypeId: "greenGrass",
      terrainTypeId: "DrawableTrees",
      inverted: false,
      pathTypeId: "DrawableDirtRoad",
    }

    mapGenerator.generateMap(45, 45, mapDetails)
    GSM.Canvas.setupCanvases()

    // CLEANUP - Rethink the "Dirty" locations, if they should be in drawing service or where they are
    GSM.Assets.obstaclesDirty = true
    GSM.Editor.backgroundDirty = true

    // CLEANUP - Needs to be moved into somewhere that re-draws
    const centerCell = GSM.Map.activeGrid.getGridCellByCoordinate(Math.floor(GSM.Canvas.canvasSizeX / 2), Math.floor(GSM.Canvas.canvasSizeY / 2))
    GSM.Canvas.centerPointX = centerCell.posX * GameSettings.scale
    GSM.Canvas.centerPointY = centerCell.posY * GameSettings.scale

    GSM.Draw.blackOutFogPainter.paint()
    GSM.FogOfWar.createCellLines()
  }
}
