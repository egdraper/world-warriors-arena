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
export class EditorpaletteComponent implements OnInit {
  public images: any[] = []
  public imageArray: any[] = []
  public currentImageSrc: string = ""
  public lockState = "Locked"

  constructor(
    public assetService: AssetsService,
    public canvasService: CanvasService,
    private editorService: EditorService,
    private shortestPath: ShortestPath,
    private grid: GridService,
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

  public changeLockState(): void {
    this.lockState = this.lockState === "Locked" ? "UnLocked" : "Locked"

    if(this.lockState === "Locked") {
      if(this.assetService.selectedGameComponent) {
        this.canvasService.centerOverAsset(this.assetService.selectedGameComponent, this.grid.width, this.grid.height)
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
    this.canvasService.scale = Number(scale.value)
    // this.grid.gridDisplay.forEach(row => {
    //   row.forEach(cell => {
    //     cell.posX = cell.x * (32 * this.canvasService.scale)
    //     cell.posY = cell.y * (32 * this.canvasService.scale)
    //     if(cell.imageTile) {
    //       cell.imageTile.tileOffsetX = cell.imageTile.tileOffsetX * this.canvasService.scale
    //       cell.imageTile.tileOffsetY = cell.imageTile.tileOffsetY * this.canvasService.scale
    //     }
    //   })
    // })
    this.canvasService.setupCanvases(this.grid.width, this.grid.height)
    this.editorService.backgroundDirty  = true
    this.assetService.obstaclesDirty = true

    //TODO Move to canvas Service
    let perfectHeight = window.innerHeight
    while (perfectHeight % (this.canvasService.scale * 32) !== 0) {
      perfectHeight--
    }
    // end todo
    this.canvasService.maxCellCountX = perfectHeight / (32 * this.canvasService.scale)

    this.canvasService.adustViewPort(tempViewPortX, tempViewPortY)

    // if (this.grid.gridLoaded) {
    //   this.canvasService.largeImageBackground = undefined
    //   this.canvasService.largeImageForeground = undefined


    //   setTimeout(() => { 
    //   this.canvasService.setupCanvases(this.grid.width, this.grid.height)
    //   // this.editorService.backgroundDirty = true
    //   // this.assetService.obstaclesDirty = true

    //     this.canvasService.createLargeImage(this.grid.width * 32, this.grid.height * 32, this.grid)
    //   })
    // }
  }

  public invertedClicked(): void {
    this.grid.inverted = !this.grid.inverted
  }


  public generateRandomMap(): void {
    const mapGenerator = new RandomMapGenerator(this.editorService, this.shortestPath, this.grid)

    const mapDetails: MapDetails = {
      backgroundTypeId: "greenGrass",
      terrainTypeId: "DrawableTrees",
      inverted: true,
      pathTypeId: undefined,
      width: 100,
      height: 100
    }

    mapGenerator.generateMap(mapDetails)
    this.canvasService.setupCanvases(mapDetails.width, mapDetails.height)

    // CLEANUP - Rethink the "Dirty" locations, if they should be in drawing service or where they are
    this.assetService.obstaclesDirty = true
    this.editorService.backgroundDirty = true

    // CLEANUP - Needs to be moved into somewhere that re-draws
    this.drawService.drawGridLines()

    const centerCell = this.grid.getGridCellByCoordinate(Math.floor(this.canvasService.canvasSize / 2), Math.floor(this.canvasService.canvasSize / 2))
    this.canvasService.centerPointX = centerCell.posX * this.canvasService.scale
    this.canvasService.centerPointY = centerCell.posY * this.canvasService.scale
  }

  public imageClick(event: any): void {
    let x = event.offsetX
    let y = event.offsetY
    while (x % 32 !== 0) {
      x--
    }
    while (y % 32 !== 0) {
      y--
    }

    console.log(x + " and " + y)
    this.images.push({ x, y })
  }

}
