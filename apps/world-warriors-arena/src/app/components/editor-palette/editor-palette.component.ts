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
  public currentImageSrc: string = ""
  public lockState = "Locked"
  public mapService = GSM.Map
  public canvasService = GSM.Canvas

  public ngOnInit(): void {
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
  }

  public changeScale(scale: any): void {
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
  }

  public invertedClicked(): void {
    GSM.Map.activeGrid.defaultSettings.inverted = !GSM.Map.activeGrid.defaultSettings.inverted
  }

  public onGenerateCoreMapClick(): void {
    GSM.Editor.generateRandomCoreMap()
  }
}
