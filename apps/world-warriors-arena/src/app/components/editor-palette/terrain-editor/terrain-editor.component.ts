import { Component, OnInit } from '@angular/core';
import { GSM } from '../../../app.service.manager';
import { dungeonTileAddons } from '../../../game-assets/dungeon.db';
import { growableItems } from '../../../game-assets/tile-assets.db';
import { Cell, MousePosition } from '../../../models/cell.model';

@Component({
  selector: 'world-warriors-arena-terrain-editor',
  templateUrl: './terrain-editor.component.html',
  styleUrls: ['./terrain-editor.component.scss']
})
export class TerrainEditorComponent {
  public cell: Cell



  constructor() {
    GSM.GameEvent.mouseDetails.mouseMove.subscribe(this.onMouseMove.bind(this))

  }
    


  public onMouseMove(mousePosition: MousePosition): void {
    const terrainTile = mousePosition.cell.imageTile
    this.cell = mousePosition.cell
    if(terrainTile) {
      if(GSM.GameEvent.keyPressDetails.ctrlPressed && terrainTile.addon) {
        console.log(terrainTile)

        const drawableItem = growableItems.find(
          (item) => item.id === "DrawableDungeon"
        );

        const addOns = dungeonTileAddons.find(a => a.id === terrainTile.addon)
        GSM.Assets.addMapAsset(mousePosition.cell, addOns.addons[0], drawableItem);
    
      }
    }
  }
}
