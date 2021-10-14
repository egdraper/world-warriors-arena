import { Component, OnInit } from '@angular/core';
import { ShortestPath } from '../../game-engine/shortest-path';
import { growableItems, TerrainType } from '../../game-assets/tiles.db.ts/tile-assets.db';
import { GridService } from '../../game-engine/grid.service';
import { SpriteTile } from '../../models/cell.model';
import { MapGenerator } from '../map-generator/generator';
import { EditorService } from './editor.service';

@Component({
  selector: 'world-warriors-arena-editor-pallete',
  templateUrl: './editor-pallete.component.html',
  styleUrls: ['./editor-pallete.component.scss']
})
export class EditorPalleteComponent implements OnInit {
  public images: any[] = []


  public imageArray: any[] = []
  public currentImageSrc: string = ""


  constructor(
    private editorService: EditorService,
    private shortestPath: ShortestPath,
    private grid: GridService
    ) { }

  ngOnInit(): void {
    this.imageArray = this.editorService.findObjectCollection("dungeon")
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



  public paintClicked(): void {
    const mapGenerator = new MapGenerator(this.editorService, this.shortestPath, this.grid)
    mapGenerator.generateMap(40, 40, TerrainType.Block)
    // this.editorService.baseOnly = false
  }

  public invertedClicked(): void {
    // this.editorService.editMode = false
    this.grid.inverted = !this.grid.inverted
  }

  public imageClick(event: any): void {
    console.log(event.offsetX)
    console.log(event.offsetY)

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
