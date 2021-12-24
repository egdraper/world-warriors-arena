import { ElementRef } from '@angular/core';
import { GSM } from '../../app.service.manager';
import { GameMap } from '../../models/game-map';
import { GameSettings } from '../../models/game-settings';
import { PageTransitionMarker } from '../../models/marker-icon.model';
import { MiniMapDetails } from '../../models/mini-map.model';
import { LargeCanvasImage } from '../../painters/large-image.paint';



export class MiniMapManager {
  public miniMaps: MiniMapDetails[] = []
  public mouseDown = false
  public keyDown = ""  
  public mousePosX: number;
  public mousePosY: number;
  public selectedMinMap: MiniMapDetails;
  
  private prevMouseX = 100
  private prevMouseY = 100
  private trackedMarker: PageTransitionMarker
  private screenOffsetX = 0
  private screenOffsetY = 0
  private hoveringMiniMap: MiniMapDetails
  private timesMouseDown = false
  
  constructor(
    public miniMapCanvas: ElementRef<HTMLCanvasElement>,
    public miniMapContext: CanvasRenderingContext2D
  ) {}

  public openMap(maps: { [gridId: string]: GameMap }, mapIds: string[]): void {
    this.miniMapContext.imageSmoothingEnabled = false

    mapIds.forEach((mapId, index) => {
      const map = maps[mapId]
      const miniMapImager = new LargeCanvasImage(GSM.Canvas.drawingCanvas, GSM.Canvas.drawingCTX);
      const image = miniMapImager.createLargeImage(map.width * 32, map.height * 32, map);
      const miniMap: MiniMapDetails = {
        height: Math.floor((map.width * 32) / ( 16 - GameSettings.miniMapScale)),
        width: Math.floor((map.width * 32) / ( 16 - GameSettings.miniMapScale)),
        posX: Math.floor(((map.width * 32) / ( 16 - GameSettings.miniMapScale)) * (index + 1)),
        posY: 250,
        map: map,
        image: image
      }

      miniMap.gameMarkers = GSM.GameMarker.markerIcons.filter(a => a.mapId === map.id) as PageTransitionMarker[]

      this.miniMaps.push(miniMap)

      this.paintMap(miniMap);
    });
  }

  public refresh(): void {
    this.miniMaps = []
    this.mouseDown = false
    this.keyDown = ""  
    this.miniMapContext.clearRect(-1 * this.screenOffsetX, -1 * this.screenOffsetX, this.miniMapContext.canvas.width, this.miniMapContext.canvas.height)
    this.openMap(GSM.Map.maps, GSM.Map.mapIds)
  }


  public onMouseDown(event: MouseEvent): void {
    this.mouseDown = true
    this.miniMaps.forEach( miniMap => {
      miniMap.gameMarkers.forEach(markerIcon => {
      const pageMarker = markerIcon as PageTransitionMarker
      const markerPosX = (Math.floor(pageMarker.displayPosX / ( 16 - GameSettings.miniMapScale)) + miniMap.posX - 8)
      const markerPosY = (Math.floor(pageMarker.displayPosY / ( 16 - GameSettings.miniMapScale)) + miniMap.posY - 8)
      const hovering = this.checkMarkerHover(markerPosX, markerPosY, this.mousePosX, this.mousePosY)
      
      if(hovering) {
        this.trackedMarker = pageMarker
      }      
    })
    })

    setTimeout(() => {
      this.timesMouseDown = false
    }, 200);
    this.timesMouseDown = true
  }

  public onMouseUp(event: MouseEvent): void {
    this.mouseDown = false

    this.miniMaps.forEach(miniMap => {
      miniMap.gameMarkers.forEach(markerIcon=> {
        const pageMarker = markerIcon as PageTransitionMarker
      const markerPosX = (Math.floor(pageMarker.displayPosX / ( 16 - GameSettings.miniMapScale)) + miniMap.posX - 8) 
      const markerPosY = (Math.floor(pageMarker.displayPosY / ( 16 - GameSettings.miniMapScale)) + miniMap.posY - 8)
      const hovering = this.checkMarkerHover(markerPosX, markerPosY, this.mousePosX, this.mousePosY)

      if(this.trackedMarker && hovering && pageMarker !== this.trackedMarker) {
        pageMarker.gridConnection = this.trackedMarker 
        this.trackedMarker.gridConnection = pageMarker
        return
      }

      if(this.trackedMarker && hovering && markerIcon === this.trackedMarker && !pageMarker.gridConnection) {
        GSM.Editor.generateRandomAttachmentMap(markerIcon as PageTransitionMarker)
        this.refresh()
        return
      }
    }) 
  })

  if(!this.trackedMarker && this.hoveringMiniMap && this.timesMouseDown) {
    GSM.Map.switchGrid(this.hoveringMiniMap.map.id)
    GSM.Canvas.showMiniMap = false
    return
  }
    this.mouseDown = false
    this.trackedMarker = undefined
  }

  public onKeyDown(event: KeyboardEvent): void {
    this.keyDown = event.code
  }

  public onKeyUp(): void {
    this.keyDown = ""
  }

  // Worry about this later
  // public onWheel(event: any): void {
  //   if(event.deltaY > 0 && GameSettings.miniMapScale < 15) {
  //     GameSettings.miniMapScale = Number((GameSettings.miniMapScale + .5).toFixed(1))
  //     this.miniMapContext.translate(-20, -20);
  //     // this.miniMapContext.scale(GameSettings.miniMapScale, GameSettings.miniMapScale)
  //   }

  //   if( event.deltaY < 0 && GameSettings.miniMapScale > 0) {
  //     GameSettings.miniMapScale = Number((GameSettings.miniMapScale - .5).toFixed(1))
  //     this.miniMapContext.translate(20, 20);
  //     // this.miniMapContext.scale(GameSettings.miniMapScale, GameSettings.miniMapScale)
  //   } 

  //   this.miniMapContext.clearRect(0, 0, 5000, 5000)
  //   this.miniMaps.forEach((miniMap, index) => {
  //     miniMap.height = (miniMap.map.width * 32) / ( 16 - GameSettings.miniMapScale),
  //     miniMap.width = (miniMap.map.width * 32) / ( 16 - GameSettings.miniMapScale),
  //     miniMap.posX = ((miniMap.map.width * 32) / ( 16 - GameSettings.miniMapScale)) * (index + 1)
  //     this.paintMap(miniMap)
  //   })

  // }

  public onMouseMove(event: any): void {
    this.prevMouseX = this.mousePosX
    this.prevMouseY = this.mousePosY

    this.mousePosX = event.offsetX
    this.mousePosY = event.offsetY
    this.hoveringMiniMap = undefined

    this.miniMapContext.clearRect(-1 * this.screenOffsetX, -1 * this.screenOffsetY, this.miniMapContext.canvas.width, this.miniMapContext.canvas.height)
    this.miniMaps.forEach(miniMap => {
      if(((this.mousePosX - this.screenOffsetX) > (miniMap.posX)) && ((this.mousePosY - this.screenOffsetY) > (miniMap.posY))
        && (this.mousePosX - this.screenOffsetX) < ((miniMap.posX + miniMap.width)) 
        && (this.mousePosY - this.screenOffsetY) < ((miniMap.posY + miniMap.height))) {
          this.hoveringMiniMap = miniMap
          if(this.mouseDown) {
            miniMap.posX += this.mousePosX - this.prevMouseX
            miniMap.posY += this.mousePosY - this.prevMouseY
          }
        this.paintMap(miniMap, "#800")
      } else {
        this.paintMap(miniMap)
      }
    })


    if(this.mouseDown && !this.trackedMarker && !this.hoveringMiniMap) {
      this.screenOffsetX += this.mousePosX - this.prevMouseX
      this.screenOffsetY += this.mousePosY - this.prevMouseY
      console.log(this.screenOffsetX, this.screenOffsetY)
      
     this.miniMapContext.translate(this.mousePosX - this.prevMouseX, this.mousePosY - this.prevMouseY)
     this.miniMaps.forEach(miniMap => {
       this.paintMap(miniMap)
     })
    }

  }

  public paintMap(miniMap: MiniMapDetails, strokeStyle: string = "#400") {
   
    this.miniMapContext.drawImage(
      miniMap.image,
      0,
      0,
      miniMap.map.width * 32,
      miniMap.map.height * 32,
      miniMap.posX,
      miniMap.posY,
      miniMap.width,
      miniMap.height
    );

    this.miniMapContext.beginPath(); 
    this.miniMapContext.strokeStyle = miniMap.map.id === GSM.Map.activeMap.id ? "#009" : strokeStyle;  // some color/style
    this.miniMapContext.lineWidth = 4;         // thickness
    this.miniMapContext.strokeRect(miniMap.posX - 4, miniMap.posY - 4, miniMap.width + 8, miniMap.height + 8);

    this.paintExitMarkers(miniMap)
    this.paintAssets(miniMap)
  }

  public checkMarkerHover(markerPosX: number, markerPosY: number, mousePosX: number, mousePosY: number): boolean {
    return (mousePosX - this.screenOffsetX) > markerPosX - 4 && (mousePosY - this.screenOffsetY) > markerPosY - 4 && (mousePosX - this.screenOffsetX) < (markerPosX + 24) && (mousePosY - this.screenOffsetY) < (markerPosY + 24)
  }

  public paintAssets(miniMap: MiniMapDetails): void {
    GSM.Assets.gameComponents.forEach(asset => {
        if(miniMap.map.id === asset.gridId) {
          this.miniMapContext.drawImage(
          asset.image,
          25,
          0,
          25,
          36,
          miniMap.posX + (Math.floor(asset.positionX / ( 16 - GameSettings.miniMapScale))) - 6,
          miniMap.posY + (Math.floor(asset.positionY / ( 16 - GameSettings.miniMapScale))) - 9,
          12,
          18
          );
        }
    })
  }

  public paintExitMarkers(miniMap: MiniMapDetails) {
    miniMap.gameMarkers.forEach(markerIcon => {
      const pageMarkerIcon = markerIcon as PageTransitionMarker
      const markerPosX = Math.floor(pageMarkerIcon.displayPosX / ( 16 - GameSettings.miniMapScale)) + miniMap.posX - 8
      const markerPosY = Math.floor(pageMarkerIcon.displayPosY / ( 16 - GameSettings.miniMapScale)) + miniMap.posY - 8
      const hovering = this.checkMarkerHover(markerPosX, markerPosY, this.mousePosX, this.mousePosY)

      this.miniMapContext.beginPath(); 
      this.miniMapContext.strokeStyle = hovering ? "#ff0": "#fd0";  // some color/style
      this.miniMapContext.lineWidth = hovering ? 5 : 3;         // thickness
      this.miniMapContext.strokeRect(markerPosX, markerPosY, 16, 16);
      
      if(this.trackedMarker && this.trackedMarker === markerIcon) {
        this.miniMapContext.beginPath(); 
        this.miniMapContext.strokeStyle = "#0f0"  // some color/style
        this.miniMapContext.lineWidth = 5         // thickness
        this.miniMapContext.moveTo(markerPosX + 8, markerPosY + 8)
        this.miniMapContext.lineTo(this.mousePosX - this.screenOffsetX, this.mousePosY - this.screenOffsetY)
        this.miniMapContext.stroke()
      } else {
      if(pageMarkerIcon.gridConnection) {
        const connectingMap = this.miniMaps.find(a => a.map.id === pageMarkerIcon.gridConnection.mapId && a.map.id != miniMap.map.id)

        if(!connectingMap) { return }
        
        const gridConnectionMarkerPosX = Math.floor(pageMarkerIcon.gridConnection.displayPosX / ( 16 - GameSettings.miniMapScale)) + connectingMap.posX - 8
        const gridConnectionMarkerPosY = Math.floor(pageMarkerIcon.gridConnection.displayPosY / ( 16 - GameSettings.miniMapScale)) + connectingMap.posY - 8

        this.miniMapContext.beginPath(); 
        this.miniMapContext.strokeStyle = "#0f0"  // some color/style
        this.miniMapContext.lineWidth = 5         // thickness
        this.miniMapContext.moveTo(markerPosX + 8, markerPosY + 8)
        this.miniMapContext.lineTo(gridConnectionMarkerPosX + 8, gridConnectionMarkerPosY + 8)
 
        this.miniMapContext.stroke()
      }
      }

    })
  }

}
