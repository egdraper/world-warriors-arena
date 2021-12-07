import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { GSM } from '../../app.service.manager';
import { Engine } from '../../services/engine.service';
import { Cell } from '../../models/cell.model';
import { GameSettings } from '../../models/game-settings';
import { growableItems, TerrainType } from '../../game-assets/tile-assets.db';

@Component({
  selector: 'world-warriors-arena-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent {
  @ViewChild('overlayCanvas') overlayCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('foregroundCanvas') foregroundCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('backgroundCanvas') backgroundCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('drawBlackoutCanvas') drawBlackoutCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('fogCanvas') fogCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('blackoutCanvas') blackoutCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('drawCanvas') drawingCanvas: ElementRef<HTMLCanvasElement>;

  public overlayContext: CanvasRenderingContext2D;
  public foregroundContext: CanvasRenderingContext2D;
  public backgroundContext: CanvasRenderingContext2D;
  public fogContext: CanvasRenderingContext2D;
  public blackoutContext: CanvasRenderingContext2D;
  public drawingContext: CanvasRenderingContext2D;

  public canvasService = GSM.Canvas
  public hoveringCell: Cell

  private mouseIsDown = false
  private controlPressed = false
  private shiftPressed = false
  private rightArrowDown = false
  private leftArrowDown = false
  private upArrowDown = false
  private downArrowDown = false

  private rightQuadrant = false
  private leftQuadrant = false
  private bottomQuadrant = false
  private topQuadrant = false

  private placingPortal = false

  constructor() {
    this.subscribeToEngine() 
  }

  // this needs to be put in a public function so we can pass in grid information 
  public ngAfterViewInit(): void {
    // Background
    this.backgroundContext = this.backgroundCanvas.nativeElement.getContext('2d', {alpha: false});
    GSM.Canvas.backgroundCTX = this.backgroundContext
    GSM.Canvas.backgroundCanvas = this.backgroundCanvas


    // Foreground
    this.foregroundContext = this.foregroundCanvas.nativeElement.getContext('2d');
    GSM.Canvas.foregroundCTX = this.foregroundContext
    GSM.Canvas.foregroundCanvas = this.foregroundCanvas

    // Overlay
    this.overlayContext = this.overlayCanvas.nativeElement.getContext('2d');
    GSM.Canvas.overlayCTX = this.overlayContext
    GSM.Canvas.overlayCanvas = this.overlayCanvas

    // Fog
    this.fogContext = this.fogCanvas.nativeElement.getContext('2d');
    GSM.Canvas.fogCTX = this.fogContext
    GSM.Canvas.fogCanvas = this.fogCanvas

    // Fog
    this.blackoutContext = this.blackoutCanvas.nativeElement.getContext('2d');
    GSM.Canvas.blackoutCTX = this.blackoutContext
    GSM.Canvas.blackoutCanvas = this.blackoutCanvas

    // Large Image Canvas
    this.drawingContext = this.drawingCanvas.nativeElement.getContext('2d');
    GSM.Canvas.drawingCTX = this.drawingContext
    GSM.Canvas.drawingCanvas = this.drawingCanvas
  }

  @HostListener("document:keydown", ["$event"])
  public onKeyDown(event: KeyboardEvent): void {
    if (GSM.Assets.selectedGameComponent) {
      GSM.Assets.selectedGameComponent.setDirection(event)
    }

    switch (event.key) {
      case "Control":
        this.controlPressed = true
        GSM.Map.hoveringCell = this.hoveringCell
        break;
      case "Shift":
        this.shiftPressed = true
        break;    
      case "ArrowRight":
        this.rightArrowDown = true
        break;
      case "ArrowLeft":
        this.leftArrowDown = true
        break;
        case "ArrowUp":
        this.upArrowDown = true
        break;
        case "ArrowDown":
        this.downArrowDown = true
        break;      
      case "e":
        this.placingPortal = true
        break;      
      default:
        break;
    }
  }

  @HostListener("document:keyup", ["$event"])
  public onKeyUp(event: KeyboardEvent): void {
    switch (event.key) {
      case "Delete": 
        GSM.Assets.removeGameComponent()
        break
      case "Control":
        this.controlPressed = false
        GSM.Map.hoveringCell = undefined
        break;
      case "Shift":
        this.shiftPressed = false
        this.topQuadrant = false
        this.bottomQuadrant = false
        this.rightQuadrant = false
        this.leftQuadrant = false
        break;    
      case "ArrowRight":
        this.rightArrowDown = false
        break;
      case "ArrowLeft":
        this.leftArrowDown = false
        break;
      case "ArrowUp":
        this.upArrowDown = false
        break;
      case "ArrowDown":
        this.downArrowDown = false
        break;      
      case "e":
        this.placingPortal = false
        break;        
      case "q":
        this.togglePlayMode()
        break;
      default:
        break;
    }
  }

  public onCanvasClick(event: any): void {    
    this.mouseIsDown = true
    const selectedCell = this.getCellFromMouseEvent(event)
    console.log(selectedCell)
    const assetInCell = GSM.Assets.getAssetFromCell(selectedCell, GSM.Map.activeMap.id)

    // Game Marker
    const markerIcon = GSM.GameMarker.getHoveringIcon()
    
    if(markerIcon && this.controlPressed) {
      markerIcon.onClickWithCtrl()
      return
    }
        
    if(markerIcon) {
      markerIcon.onClick()
      return
    }
    // select Asset
    if(assetInCell && !GSM.Assets.selectedGameComponent) {
      GSM.Assets.selectAsset(assetInCell)
      GSM.Canvas.centerOverAsset(assetInCell)
      return
    }

    // deselect Asset
    if(assetInCell && GSM.Assets.selectedGameComponent && assetInCell.id === GSM.Assets.selectedGameComponent.id) {
      GSM.Assets.deselectAsset()
      return
    }

    // change/select new Asset
    if(assetInCell && assetInCell.id !== GSM.Assets.selectedGameComponent.id) {
      GSM.Assets.deselectAsset()
      GSM.Assets.selectAsset(assetInCell)
      GSM.Canvas.centerOverAsset(assetInCell)
      return
    }

    // place portal
    if(this.placingPortal) {
      GSM.Canvas.portalEntry.push(selectedCell)
      return
    }

    // place portal endpoint
    if(GSM.Canvas.portalEntry.length > 0) {
      GSM.Canvas.portalEntry.forEach(cell => cell.portalTo = {gridId: GSM.Map.activeMap.id, cell: selectedCell})
      GSM.Canvas.portalEntry = []
      return
    }

    // move character
    if(!assetInCell && GSM.Assets.selectedGameComponent ) {
      GSM.Assets.selectedGameComponent.startMovement(GSM.Assets.selectedGameComponent.cell, selectedCell, GSM.Assets.gameComponents)
    }

    // place character {
    if(GSM.CharacterEditor.selectedCharacter && this.controlPressed) {
      GSM.CharacterEditor.addCharacter(selectedCell, GSM.Map.activeMap.id)
    }
     
    this.onMouseMove(event)
  }

  public onMouseMove(event: any): void {
    if(!GSM.Map.activeMap) { return }
    
    const clickX = event.offsetX + (-1 * GSM.Canvas.canvasViewPortOffsetX * GameSettings.scale)
    const clickY = event.offsetY + (-1 * GSM.Canvas.canvasViewPortOffsetY * GameSettings.scale)
    GSM.GameMarker.checkForHover()
    GSM.GameMarker.mouseX = clickX
    GSM.GameMarker.mouseY = clickY

    this.hoveringCell = GSM.Map.activeMap.getGridCellByCoordinate(clickX, clickY)
    GSM.Map.hoveringCell = this.hoveringCell

    // scroll with mouse movement
    if (this.shiftPressed) {
      this.rightQuadrant = clickX > (-1 * GSM.Canvas.canvasViewPortOffsetX + GSM.Canvas.canvasSizeX) - GSM.Canvas.canvasSizeX / 3 
      this.bottomQuadrant = clickY > (-1 * GSM.Canvas.canvasViewPortOffsetY + GSM.Canvas.canvasSizeY) - GSM.Canvas.canvasSizeY / 3
      this.topQuadrant = clickX < (-1 * GSM.Canvas.canvasViewPortOffsetX + GSM.Canvas.canvasSizeX / 3) && (GSM.Canvas.canvasViewPortOffsetX < 0)
      this.leftQuadrant = clickY < (-1 * GSM.Canvas.canvasViewPortOffsetY + GSM.Canvas.canvasSizeY / 3) && (GSM.Canvas.canvasViewPortOffsetY < 0)
    }

    // place portal
    if(this.placingPortal && this.mouseIsDown && !GSM.Canvas.portalEntry.find(cell => cell.id === this.hoveringCell.id)) {
      GSM.Canvas.portalEntry.push(this.hoveringCell)
      console.log(GSM.Canvas.portalEntry)
      return
    }

    // Control Pressed
    if (event.offsetX < 0 || event.offsetY < 0) { return }
    if (!this.mouseIsDown || !this.controlPressed) { return }

    this.rightQuadrant = clickX > (-1 * GSM.Canvas.canvasViewPortOffsetX + GSM.Canvas.canvasSizeX) - 96
    this.bottomQuadrant = clickY > (-1 * GSM.Canvas.canvasViewPortOffsetY + GSM.Canvas.canvasSizeY) - 96
    this.topQuadrant = clickX < (-1 * GSM.Canvas.canvasViewPortOffsetX + 96) && (GSM.Canvas.canvasViewPortOffsetX < 0)
    this.leftQuadrant = clickY < (-1 * GSM.Canvas.canvasViewPortOffsetY + 96) && (GSM.Canvas.canvasViewPortOffsetY < 0)

    if (GSM.Map.activeMap.defaultSettings.inverted) { // Rename to GSM.Map.removing or something
      GSM.Assets.addInvertedMapAsset(this.hoveringCell)
    } else if (this.mouseIsDown && this.controlPressed) {
      const selectedAsset = GSM.Editor.selectedAsset
      const drawableItem = growableItems.find(item => item.id === GSM.Editor.selectedGrowableAsset)

      GSM.Assets.addMapAsset(this.hoveringCell, selectedAsset, drawableItem)
    }
  }

  public onMouseUp(event: any): void {
    this.mouseIsDown = false
  }

  public subscribeToEngine(): void {
    Engine.onFire.subscribe((frame) => {
      if(!GameSettings.gm) { return }
      if (this.rightArrowDown) {
        GSM.Canvas.scrollViewPort(1, 0)
      }
      if (this.leftArrowDown) {
        GSM.Canvas.scrollViewPort(-1, 0)
      }
      if (this.upArrowDown) {
        GSM.Canvas.scrollViewPort(0, -1)
      }
      if (this.downArrowDown) {
        GSM.Canvas.scrollViewPort(0, 1)
      }


      if (this.rightQuadrant) {
        GSM.Canvas.scrollViewPort(1, 0)
      }
      
      if (this.leftQuadrant) {
        GSM.Canvas.scrollViewPort(0, -1)
      }
      
      if (this.topQuadrant) {
        GSM.Canvas.scrollViewPort(-1, 0)
      }
      
      if (this.bottomQuadrant) {
        GSM.Canvas.scrollViewPort(0, 1)
      }
    })
  }

  private togglePlayMode(): void {
    if(!GSM.Map.activeMap) { return }

    GSM.Canvas.editMode = !GSM.Canvas.editMode
    setTimeout(() => {
      if (!GSM.Canvas.editMode) {
        GSM.Map.activeMap.largeImage.createLargeImage(GSM.Map.activeMap.width * 32, GSM.Map.activeMap.height * 32, GSM.Map)
      } else {
        if(GSM.Map.activeMap) {
          GSM.Map.activeMap.largeImage.background = undefined
        }
      }
    })
  }

  private getCellFromMouseEvent(event: MouseEvent): Cell {
    const clickX = event.offsetX + (-1 * GSM.Canvas.canvasViewPortOffsetX * GameSettings.scale)
    const clickY = event.offsetY + (-1 * GSM.Canvas.canvasViewPortOffsetY * GameSettings.scale)
   
    return GSM.Map.activeMap.getGridCellByCoordinate(clickX, clickY)
  }
}