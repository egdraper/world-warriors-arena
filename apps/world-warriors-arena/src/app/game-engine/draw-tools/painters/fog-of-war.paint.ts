import { Injectable } from "@angular/core";
import { CanvasService } from "../../../canvas/canvas.service";
import { EditorService } from "../../../editor/editor-palette/editor.service";
import { AssetsService } from "../../../game-assets/assets.service";
import { Cell } from "../../../models/cell.model";
import { DebugSettings } from "../../../models/game-settings";
import { Engine } from "../../engine";
import { GridService } from "../../grid.service";
import { NewFogOfWarService } from "../../new-visibility.service";
import { Painter } from "./painter";

export class FogOfWarPainter extends Painter {
  constructor(
    public canvasService: CanvasService,
    public gridService: GridService,
    public assetService: AssetsService,
    public newFogOfWarService: NewFogOfWarService
  ) { super() }

  // Draws Grid Lines  
  public paint(): void {
    this.drawFog()
    this.revealFog()
  }

  private drawFog(): void {
    if (!this.canvasService.fogCTX || !this.gridService.activeGrid) { return }
    this.canvasService.fogCTX.imageSmoothingEnabled = false
    this.canvasService.fogCTX.filter = "none";
    this.canvasService.fogCTX.globalCompositeOperation = 'destination-over'
    this.canvasService.fogCTX.clearRect(0, 0, this.gridService.activeGrid.width * 32, this.gridService.activeGrid.height * 32);
    this.canvasService.fogCTX.fillStyle = 'black';
    this.canvasService.fogCTX.globalAlpha = .8;
    this.canvasService.fogCTX.fillRect(
      0,
      0,
      this.gridService.activeGrid.width * 32,
      this.gridService.activeGrid.height * 32
    )
  }

  private revealFog(): void {
    if (this.assetService.selectedGameComponent) {
      const centerCells = this.newFogOfWarService.fogOfWarRimPoints[this.assetService.selectedGameComponent.cell.id]
      this.canvasService.fogCTX.globalCompositeOperation = 'destination-out'
      
      if(!DebugSettings.fogDebug && DebugSettings.fogFeather) {
        this.canvasService.fogCTX.filter = "blur(35px)";  // "feather"
      }

      console.log(centerCells[0])
      this.clearOutVisibleArea(centerCells, this.canvasService.fogCTX)
    }
  }

  private clearOutVisibleArea(centerCells: Cell[], ctx: CanvasRenderingContext2D): void {
    if (centerCells.length === 0) {
      debugger
      return
    }
    ctx.beginPath()
    ctx.lineWidth = 1;
    try {
      ctx.moveTo(centerCells[0].fogPointX, centerCells[0].fogPointY)
    } catch {
      debugger
    }

    centerCells.forEach((cell: Cell, index: number) => {
      if (index != 0 && cell) {
        if (index % 1 === 0) {
          ctx.lineTo(cell.fogPointX, cell.fogPointY)
        }
      }
    })
    ctx.closePath();
    if (DebugSettings.fogDebug) {
      ctx.stroke();
      ctx.globalAlpha = .8;
      ctx.fill()
    } else {
      ctx.fill();
    }
    

    if (DebugSettings.fogDebug) {
      ctx.beginPath();
      ctx.fillRect(centerCells[0].fogPointX, centerCells[0].fogPointY, 5, 5)
      ctx.stroke();

      centerCells.forEach((cell: Cell, index: number) => {
        if (index != 0 && cell) {
          if (index % 1 === 0) {
            ctx.beginPath();
            ctx.fillRect(cell.fogPointX, cell.fogPointY, 5, 5)
            ctx.stroke();
          }
        }
      })
    }
  }
}