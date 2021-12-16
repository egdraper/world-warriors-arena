import { ElementRef } from '@angular/core';
import { GSM } from '../../app.service.manager';
import { GameMap } from '../../models/game-map';
import { LargeCanvasImage } from '../../painters/large-image.paint';
import { MinimapComponent } from './minimap.component';

export class MiniMapDetails {
  map: GameMap
  posX: number
  posY: number
  leftOf: MiniMapDetails
  rightOf: MiniMapDetails
  above: MiniMapDetails
  below: MiniMapDetails
  connectionType: "transition" | "phase" | "portal"
  width: number
  height: number
}

export class MiniMapManager {
  public miniMaps: MiniMapDetails[] = []
  public mouseDown = false
  public keyDown = ""  
  public mousePosX: number;
  public mousePosY: number;

  public defaultHeight = 200
  public defaultWidth = 200

  public selectedMinMap: MiniMapDetails;

  constructor(
    public miniMapCanvas: ElementRef<HTMLCanvasElement>,
    public miniMapContext: CanvasRenderingContext2D
  ) {}

  public createMapArea(maps: { [gridId: string]: GameMap }, mapIds: string[]): void {
    this.miniMapContext.imageSmoothingEnabled = false
    mapIds.forEach((mapId) => {
      this.paintMaps(maps[mapId]);
    });
  }

  public onMouseDown(event: MouseEvent): void {
    this.mouseDown = true
  }

  public onMouseUp(event: MouseEvent): void {
    this.mouseDown = false
  }

  public onKeyDown(event: KeyboardEvent): void {
    this.keyDown = event.code
  }

  public onKeyUp(): void {
    this.keyDown = ""
  }

  public onMouseMove(event: MouseEvent): void {
    this.mousePosX = event.offsetX
    this.mousePosY = event.offsetY

    this.miniMaps.forEach(miniMap => {
      if((this.mousePosX > miniMap.posX 
        && this.mousePosY > miniMap.posY) 
        && (this.mousePosX < miniMap.posX + this.defaultHeight 
        && this.mousePosY < miniMap.posY + this.defaultWidth)) {
        
        this.paintMaps(miniMap.map)
      }
    })
  }

  public paintMaps(map: GameMap) {
    
    const miniMap = new LargeCanvasImage(GSM.Canvas.drawingCanvas, GSM.Canvas.drawingCTX);
    const image = miniMap.createLargeImage(map.width * 32, map.width * 32, GSM.Map);

    const posX = 10
    const posY = 10

    // debugger
    setTimeout(() => {
      this.miniMapContext.drawImage(
        image,
        0,
        0,
        map.width * 32,
        map.height * 32,
        posX,
        posY,
        200,
        200
      );
    })
    this.miniMapContext.beginPath(); 
    this.miniMapContext.strokeStyle = '#400';  // some color/style
    this.miniMapContext.lineWidth = 4;         // thickness
    this.miniMapContext.strokeRect(posX - 4, posY - 4, 208, 208);
  }
}
