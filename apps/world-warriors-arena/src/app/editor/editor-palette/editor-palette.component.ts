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

@Component({
  selector: 'world-warriors-arena-editor-palette',
  templateUrl: './editor-palette.component.html',
  styleUrls: ['./editor-palette.component.scss']
})
export class EditorpaletteComponent implements OnInit {
  public images: any[] = []
  public imageArray: any[] = []
  public currentImageSrc: string = ""

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

  public baseClicked(): void {
    this.editorService.layerID++
    // this.editorService.baseOnly = true
  }

  public changeScale(scale: any): void {
    this.canvasService.scale = Number(scale.value)
    this.canvasService.setupCanvases(this.grid.width, this.grid.height)
    this.editorService.backgroundDirty  = true
    this.assetService.obstaclesDirty = true
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
