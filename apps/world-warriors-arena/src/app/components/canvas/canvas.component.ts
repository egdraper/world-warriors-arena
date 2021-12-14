/* eslint-disable @typescript-eslint/no-unused-vars */
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { GSM } from '../../app.service.manager';
import { Cell } from '../../models/cell.model';
import { GameSettings } from '../../models/game-settings';

@Component({
  selector: 'world-warriors-arena-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit{
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
  public playerEvent = GSM.GameEvent

  public hoveringCell: Cell

  // this needs to be put in a public function so we can pass in grid information 
  public ngAfterViewInit(): void {
    // Background
    this.backgroundContext = this.backgroundCanvas.nativeElement.getContext('2d', { alpha: false });
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

    // Fog Blackout
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
      case "Meta":
      case "Control":
        GSM.Map.hoveringCell = this.hoveringCell
        GSM.GameEvent.keyPressDetails.ctrlPressed = true
        break;
      case "Shift":
        GSM.GameEvent.keyPressDetails.shiftPressed = true
        break;
      case "ArrowRight":
        GSM.GameEvent.keyPressDetails.arrowRightPressed = true
        break;
      case "ArrowLeft":
        GSM.GameEvent.keyPressDetails.arrowLeftPressed = true
        break;
      case "ArrowUp":
        GSM.GameEvent.keyPressDetails.arrowUpPressed = true
        break;
      case "ArrowDown":
        GSM.GameEvent.keyPressDetails.arrowDownPressed = true
        break;
      case "e":
        // this.placingPortal = true
        break;
      default:
        break;
    }

    GSM.GameEvent.update()
  }

  @HostListener("document:keyup", ["$event"])
  public onKeyUp(event: KeyboardEvent): void {
    switch (event.key) {
      case "Delete":
        GSM.Assets.removeGameComponent()
        break
      case "Meta":
      case "Control":
        GSM.GameEvent.keyPressDetails.ctrlPressed = false
        GSM.Map.hoveringCell = undefined
        break;
      case "Shift":
        GSM.GameEvent.keyPressDetails.shiftPressed = false
        break;
      case "ArrowRight":
        GSM.GameEvent.keyPressDetails.arrowRightPressed = false
        break;
      case "ArrowLeft":
        GSM.GameEvent.keyPressDetails.arrowLeftPressed = false
        break;
      case "ArrowUp":
        GSM.GameEvent.keyPressDetails.arrowUpPressed = false
        break;
      case "ArrowDown":
        GSM.GameEvent.keyPressDetails.arrowDownPressed = false
        break;
      case "e":
        // this.placingPortal = false
        break;
      case "q":
        GSM.Editor.togglePlayMode()
        break;
      default:
        break;
    }
    GSM.GameEvent.update()
  }

  public onCanvasClick(event: MouseEvent): void {
    GSM.GameEvent.keyPressDetails.mouseDown = true
    GSM.GameEvent.update()
  }

  public onMouseMove(event: MouseEvent): void {
    if (!GSM.Map.activeMap) { return }

    const mousePosX = event.offsetX + (-1 * GSM.Canvas.canvasViewPortOffsetX * GameSettings.scale)
    const mousePosY = event.offsetY + (-1 * GSM.Canvas.canvasViewPortOffsetY * GameSettings.scale)
    this.hoveringCell = GSM.Map.activeMap.getGridCellByCoordinate(mousePosX, mousePosY)

    // Game Marker (required here because mouseDetails depends on this check being called beforehand)
    GSM.GameMarker.checkForHover()
    GSM.GameMarker.mouseX = mousePosX
    GSM.GameMarker.mouseY = mousePosY

    // For Drawing
    GSM.Map.hoveringCell = this.hoveringCell

    // For Event Handlers
    GSM.GameEvent.mouseDetails.cellId = this.hoveringCell.id
    GSM.GameEvent.mouseDetails.hoveringPlayer = GSM.Assets.getAssetFromCell(this.hoveringCell, GSM.Map.activeMap.id)
    GSM.GameEvent.mouseDetails.hoveringBackground = this.hoveringCell.backgroundTile
    GSM.GameEvent.mouseDetails.hoveringTerrain = this.hoveringCell.imageTile
    GSM.GameEvent.mouseDetails.hoveringObject = undefined
    GSM.GameEvent.mouseDetails.markerIcon = GSM.GameMarker.getHoveringIcon()
    GSM.GameEvent.mouseDetails.mouseX = mousePosX
    GSM.GameEvent.mouseDetails.mouseY = mousePosY
    GSM.GameEvent.mouseDetails.mouseMove.next({mousePosX: mousePosX, mousePosY: mousePosY})
    GSM.GameEvent.update()
  }

  public onMouseUp(event: MouseEvent): void {
    GSM.GameEvent.keyPressDetails.mouseDown = false
    GSM.GameEvent.update()
  }
}


// Portal code - do not remove
// private placingPortal = false

    // place portal
    // if (this.placingPortal) {
    //   GSM.Canvas.portalEntry.push(selectedCell)
    //   return
    // }

    // // place portal endpoint
    // if (GSM.Canvas.portalEntry.length > 0) {
    //   GSM.Canvas.portalEntry.forEach(cell => cell.portalTo = { gridId: GSM.Map.activeMap.id, cell: selectedCell })
    //   GSM.Canvas.portalEntry = []
    //   return
    // }

    
    // place portal
    // if (this.placingPortal && this.mouseIsDown && !GSM.Canvas.portalEntry.find(cell => cell.id === this.hoveringCell.id)) {
    //   GSM.Canvas.portalEntry.push(this.hoveringCell)
    //   console.log(GSM.Canvas.portalEntry)
    //   return
    // }
