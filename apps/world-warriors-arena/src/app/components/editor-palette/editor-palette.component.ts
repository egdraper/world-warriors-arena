import { Component, OnInit } from '@angular/core';
import { GSM } from '../../app.service.manager';
import { growableItems } from '../../game-assets/tile-assets.db';
import { SpriteTile } from '../../models/cell.model';
import { GameSettings } from '../../models/game-settings';

@Component({
  selector: 'world-warriors-arena-editor-palette',
  templateUrl: './editor-palette.component.html',
  styleUrls: ['./editor-palette.component.scss']
})
export class EditorPaletteComponent implements OnInit {
  public images: any[] = []
  public imageArray: any[] = []
  public currentImageSrc = ""
  public lockState = "Locked"
  public mapService = GSM.Map
  public canvasService = GSM.Canvas
  public assetService = GSM.Assets
  public currentMenu = ""
  public iconsPx = [
    {pos: 0, name: "Lock", visible: true},
    {pos: -36, name: "Unlock", visible: false},
    {pos: -64, name: "Clear Terrain", visible: true},
    {pos: -96, name: "Terrain Editor", visible: true},
    {pos: -128, name: "Background Editor", visible: true},
    {pos: -160, name: "Portal Editor", visible: true},
    {pos: -192, name: "Mini Map", visible: true},
    {pos: -224, name: "Character Editor", visible: true},
    {pos: -256, name: "Object Editor", visible: true},
  ]

  public terrainTypes = growableItems

  public switchMenu(icon: {pos: number, name: string, visible: boolean}): void {
    this.currentMenu = icon.name

    if(icon.name === "Clear Terrain") {
      this.invertedClicked()
    }
  }


  public ngOnInit(): void {
    this.imageArray = GSM.Editor.findObjectCollection("trees")
  }
  
  public ngAfterViewInit(): void {
    setTimeout(()=> 
    this.onGenerateCoreMapClick()
    )
  }

  public onMiniMapClick(): void {
    GSM.Canvas.showMiniMap = !GSM.Canvas.showMiniMap
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
        GSM.Canvas.centerOverAsset(GSM.Assets.selectedGameComponent)
      }
      GameSettings.gm = false
    } else {
      GameSettings.gm = true
    }
  }

  public baseClicked(): void {
    GSM.Editor.layerID++
  }

  public changeScale(scale: any): void {
    GSM.Canvas.resetViewport()
    GameSettings.scale = Number(scale.value)

    GSM.Canvas.setupCanvases()

    let perfectHeight = window.innerHeight

    while (perfectHeight % (GameSettings.scale * 32) !== 0) {
      perfectHeight--
    }

    GSM.Canvas.maxCellCountX = perfectHeight / (32 * GameSettings.scale)
  }

  public invertedClicked(): void {
    GSM.Map.activeMap.defaultSettings.inverted = !GSM.Map.activeMap.defaultSettings.inverted
  }

  public onGenerateCoreMapClick(): void {
    GSM.Editor.generateRandomCoreMap()
  }
}
