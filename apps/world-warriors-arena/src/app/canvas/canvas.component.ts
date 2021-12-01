import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CharacterEditorService } from '../editor/character-edtor-palette/character-editor-pallete/character-editor.service';
import { EditorService } from '../editor/editor-palette/editor.service';
import { AssetsService } from '../game-assets/assets.service';
import { growableItems, TerrainType } from '../game-assets/tiles.db.ts/tile-assets.db';
import { Engine } from '../game-engine/engine';
import { GridService } from '../game-engine/grid.service';
import { Cell } from '../models/cell.model';
import { GameSettings } from '../models/game-settings';
import { CanvasService } from './canvas.service';

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


  constructor(
    public canvasService: CanvasService,
    private gridService: GridService,
    private assetService: AssetsService,
    private editorService: EditorService,
    private engineService: Engine,
    private characterService: CharacterEditorService,
  ) {
    this.subscribeToEngine() 
  }

  // this needs to be put in a public function so we can pass in grid information 
  public ngAfterViewInit(): void {
    // Background
    this.backgroundContext = this.backgroundCanvas.nativeElement.getContext('2d', {alpha: false});
    this.canvasService.backgroundCTX = this.backgroundContext
    this.canvasService.backgroundCanvas = this.backgroundCanvas


    // Foreground
    this.foregroundContext = this.foregroundCanvas.nativeElement.getContext('2d');
    this.canvasService.foregroundCTX = this.foregroundContext
    this.canvasService.foregroundCanvas = this.foregroundCanvas

    // Overlay
    this.overlayContext = this.overlayCanvas.nativeElement.getContext('2d');
    this.canvasService.overlayCTX = this.overlayContext
    this.canvasService.overlayCanvas = this.overlayCanvas

    // Fog
    this.fogContext = this.fogCanvas.nativeElement.getContext('2d');
    this.canvasService.fogCTX = this.fogContext
    this.canvasService.fogCanvas = this.fogCanvas

    // Fog
    this.blackoutContext = this.blackoutCanvas.nativeElement.getContext('2d');
    this.canvasService.blackoutCTX = this.blackoutContext
    this.canvasService.blackoutCanvas = this.blackoutCanvas

    // Large Image Canvas
    this.drawingContext = this.drawingCanvas.nativeElement.getContext('2d');
    this.canvasService.drawingCTX = this.drawingContext
    this.canvasService.drawingCanvas = this.drawingCanvas
  }

  @HostListener("document:keydown", ["$event"])
  public onKeyDown(event: KeyboardEvent): void {
    if (this.assetService.selectedGameComponent) {
      this.assetService.selectedGameComponent.setDirection(event)
    }

    switch (event.key) {
      case "Control":
        this.controlPressed = true
        this.gridService.hoveringCell = this.hoveringCell
        break;
      case "Shift":
        this.shiftPressed = true
        break;    
      case "ArrowRight":
        console.log("right pressed")
        this.rightArrowDown = true
        break;
      case "ArrowLeft":
        console.log("left pressed")
        this.leftArrowDown = true
        break;
        case "ArrowUp":
        console.log("up pressed")
        this.upArrowDown = true
        break;
        case "ArrowDown":
        console.log("down pressed")
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
        this.assetService.removeGameComponent()
        break
      case "Control":
        this.controlPressed = false
        this.gridService.hoveringCell = undefined
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
    const assetInCell = this.assetService.getAssetFromCell(selectedCell, this.gridService.activeGrid.id)
    
    // select Asset
    if(assetInCell && !this.assetService.selectedGameComponent) {
      this.assetService.selectAsset(assetInCell)
      return
    }

    // deselect Asset
    if(assetInCell && this.assetService.selectedGameComponent && assetInCell.id === this.assetService.selectedGameComponent.id) {
      this.assetService.deselectAsset()
      return
    }

    // change/select new Asset
    if(assetInCell && assetInCell.id !== this.assetService.selectedGameComponent.id) {
      this.assetService.deselectAsset()
      this.assetService.selectAsset(assetInCell)
      this.canvasService.centerOverAsset(assetInCell, this.gridService.activeGrid)
      return
    }

    // place portal
    if(this.placingPortal) {
      this.canvasService.portalEntry.push(selectedCell)
      return
    }

    // place portal endpoint
    if(this.canvasService.portalEntry.length > 0) {
      this.canvasService.portalEntry.forEach(cell => cell.portalTo = {gridId: this.gridService.activeGrid.id, cell: selectedCell})
      this.canvasService.portalEntry = []
      return
    }

    // move character
    if(!assetInCell && this.assetService.selectedGameComponent ) {
      this.assetService.selectedGameComponent.startMovement(this.assetService.selectedGameComponent.cell, selectedCell, this.assetService.gameComponents)
    }

    // place character {
    if(this.characterService.selectedCharacter && this.controlPressed) {
      this.characterService.addCharacter(selectedCell, this.gridService.activeGrid.id, this.engineService)
    }
     
    this.onMouseMove(event)
  }

  public onMouseMove(event: any): void {
    if(!this.gridService.activeGrid) { return }

    const clickX = event.offsetX + (-1 * this.canvasService.canvasViewPortOffsetX * GameSettings.scale)
    const clickY = event.offsetY + (-1 * this.canvasService.canvasViewPortOffsetY * GameSettings.scale)

    this.hoveringCell = this.gridService.activeGrid.getGridCellByCoordinate(clickX, clickY)
    this.gridService.hoveringCell = this.hoveringCell

    // scroll with mouse movement
    if (this.shiftPressed) {
      this.rightQuadrant = clickX > (-1 * this.canvasService.canvasViewPortOffsetX + this.canvasService.canvasSizeX) - this.canvasService.canvasSizeX / 3 
      this.bottomQuadrant = clickY > (-1 * this.canvasService.canvasViewPortOffsetY + this.canvasService.canvasSizeY) - this.canvasService.canvasSizeY / 3
      this.topQuadrant = clickX < (-1 * this.canvasService.canvasViewPortOffsetX + this.canvasService.canvasSizeX / 3) && (this.canvasService.canvasViewPortOffsetX < 0)
      this.leftQuadrant = clickY < (-1 * this.canvasService.canvasViewPortOffsetY + this.canvasService.canvasSizeY / 3) && (this.canvasService.canvasViewPortOffsetY < 0)
    }

    // place portal
    if(this.placingPortal && this.mouseIsDown && !this.canvasService.portalEntry.find(cell => cell.id === this.hoveringCell.id)) {
      this.canvasService.portalEntry.push(this.hoveringCell)
      console.log(this.canvasService.portalEntry)
      return
    }


    // Control Pressed
    if (event.offsetX < 0 || event.offsetY < 0) { return }
    if (!this.mouseIsDown || !this.controlPressed) { return }

    this.rightQuadrant = clickX > (-1 * this.canvasService.canvasViewPortOffsetX + this.canvasService.canvasSizeX) - 96
    this.bottomQuadrant = clickY > (-1 * this.canvasService.canvasViewPortOffsetY + this.canvasService.canvasSizeY) - 96
    this.topQuadrant = clickX < (-1 * this.canvasService.canvasViewPortOffsetX + 96) && (this.canvasService.canvasViewPortOffsetX < 0)
    this.leftQuadrant = clickY < (-1 * this.canvasService.canvasViewPortOffsetY + 96) && (this.canvasService.canvasViewPortOffsetY < 0)

    if (this.gridService.activeGrid.inverted) { // Rename to this.gridService.removing or something
      this.assetService.addInvertedMapAsset(this.hoveringCell)
      this.editorService.backgroundDirty = true
    } else if (this.mouseIsDown && this.controlPressed) {
      const selectedAsset = this.editorService.selectedAsset
      const drawableItem = growableItems.find(item => item.id === this.editorService.selectedGrowableAsset)

      this.assetService.addMapAsset(this.hoveringCell, selectedAsset, drawableItem)
      if (drawableItem.terrainType === TerrainType.Background) { this.editorService.backgroundDirty = true }
    }
    this.assetService.obstaclesDirty = true
  }

  public onMouseUp(event: any): void {
    this.mouseIsDown = false
  }

  public subscribeToEngine(): void {
    Engine.onFire.subscribe((frame) => {
      if (this.rightArrowDown) {
        this.canvasService.scrollViewPort(1, 0, this.gridService)
      }
      if (this.leftArrowDown) {
        this.canvasService.scrollViewPort(-1, 0, this.gridService)
      }
      if (this.upArrowDown) {
        this.canvasService.scrollViewPort(0, -1, this.gridService)
      }
      if (this.downArrowDown) {
        this.canvasService.scrollViewPort(0, 1, this.gridService)
      }

      if (this.rightQuadrant) {
        console.log("r" + this.rightQuadrant)
        this.canvasService.scrollViewPort(1, 0, this.gridService)
      }
      
      if (this.leftQuadrant) {
        this.canvasService.scrollViewPort(0, -1, this.gridService)
      }
      
      if (this.topQuadrant) {
        this.canvasService.scrollViewPort(-1, 0, this.gridService)
      }
      
      if (this.bottomQuadrant) {
        this.canvasService.scrollViewPort(0, 1, this.gridService)
      }
    })
  }

  private togglePlayMode(): void {
    if(!this.gridService.activeGrid) { return }

    this.canvasService.editMode = !this.canvasService.editMode
    setTimeout(() => {
      if (!this.canvasService.editMode) {
        this.gridService.activeGrid.largeImage.createLargeImage(this.gridService.activeGrid.width * 32, this.gridService.activeGrid.height * 32, this.gridService)
      } else {
        if(this.gridService.activeGrid) {
          this.gridService.activeGrid.largeImage.background = undefined
        }
      }
    })
  }

  private getCellFromMouseEvent(event: MouseEvent): Cell {
    const clickX = event.offsetX + (-1 * this.canvasService.canvasViewPortOffsetX * GameSettings.scale)
    const clickY = event.offsetY + (-1 * this.canvasService.canvasViewPortOffsetY * GameSettings.scale)
   
    return this.gridService.activeGrid.getGridCellByCoordinate(clickX, clickY)
  }
}