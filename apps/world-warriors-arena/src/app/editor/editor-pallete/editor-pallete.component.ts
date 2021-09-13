import { Component, OnInit } from '@angular/core';
import { GridService } from '../../grid/grid.service';
import { SpriteTile } from '../../models/assets.model';
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
    private gridService: GridService) { }

  ngOnInit(): void {
    this.imageArray.push(this.editorService.getAsset("tree1"))
    this.imageArray.push(this.editorService.getAsset("tree2"))
  }

  public tileClick(tile: SpriteTile): void {
    this.editorService.selectedAsset = tile
  }

  public baseClicked(): void {
    // this.editorService.baseOnly = true
  }

  public paintClicked(): void {
    // this.editorService.baseOnly = false
  }

  public editModeClicked(): void {
    // this.editorService.editMode = false
  }

  public imageClick(event: any): void {
    console.log(event.offsetX)
    console.log(event.offsetY)

    let x = event.offsetX
    let y = event.offsetY
    while(x % 32 !== 0) {
      x--
    }
    while(y % 32 !== 0) {
      y--
    }

    console.log(x +" and " + y)
    this.images.push({x,y})
  }

}