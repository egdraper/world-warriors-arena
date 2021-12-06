import { Injectable } from '@angular/core';
import { GSM } from '../app.service.manager';
import { Cell, DefaultMapSettings } from '../models/cell.model';
import { GameMap } from '../models/game-map';
import { LargeCanvasImage } from '../painters/large-image.paint';

@Injectable()
export class MapService {
  public maps: {[gridId: string]: GameMap} = {}
  public mapIds: string[] = []
  public activeMap: GameMap
  public hoveringCell: Cell

  private index = 0

  public switchGrid(gridId: string): GameMap {
    if(GSM.Map.activeMap) {
      GSM.Map.activeMap.changePageXOffset = GSM.Canvas.canvasViewPortOffsetX
      GSM.Map.activeMap.changePageYOffset = GSM.Canvas.canvasViewPortOffsetY
    }
    
    this.activeMap = this.maps[gridId]   

    GSM.Canvas.resetViewport()
    
    if((GSM.Map.activeMap.changePageXOffset || GSM.Map.activeMap.changePageXOffset === 0) || (GSM.Map.activeMap.changePageXOffset || GSM.Map.activeMap.changePageYOffset === 0)) {
      GSM.Canvas.pageChangeAdjust(this.activeMap)
    }
    
    return this.activeMap
  }

  public createNewGrid(width: number, height: number, defaultMapSettings: DefaultMapSettings, autoSwitchMap: boolean = false): GameMap {
     // Grid Setup
    const newMap = new GameMap(width, height, defaultMapSettings)
    
    newMap.largeImage = new LargeCanvasImage(GSM.Canvas.drawingCanvas, GSM.Canvas.drawingCTX)
    newMap.id = this.index.toString()
    this.index++
   
    // Set Grid
    this.mapIds.push(newMap.id)
    this.maps[newMap.id] = newMap
    if(autoSwitchMap) {
      GSM.Map.switchGrid(newMap.id)
      GSM.Canvas.resetViewport()
    }
    return newMap
  }  
}