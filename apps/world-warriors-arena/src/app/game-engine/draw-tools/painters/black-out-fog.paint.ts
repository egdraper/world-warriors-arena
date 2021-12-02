import { CanvasService } from "../../../canvas/canvas.service";
import { AssetsService } from "../../../game-assets/assets.service";
import { Cell } from "../../../models/cell.model";
import { DebugSettings } from "../../../models/game-settings";
import { GridService } from "../../grid.service";
import { NewFogOfWarService } from "../../new-visibility.service";
import { Painter } from "./painter";

export class BlackOutFogPainter extends Painter {
  public movementComplete = false

  constructor(
    public canvasService: CanvasService,
    public gridService: GridService,
    public assetService: AssetsService,
    public newFogOfWarService: NewFogOfWarService
  ) { super() }

  // Draws Grid Lines  
  public paint(): void {
    this.drawBlackoutFog()
    this.revealBlackoutFog()
  }

  private drawBlackoutFog(): void {
    if (!this.canvasService.blackoutCTX || !this.gridService.activeGrid) { return }

    this.canvasService.blackoutCTX.clearRect(0, 0, this.gridService.activeGrid.width * 32, this.gridService.activeGrid.height * 32);
    this.canvasService.backgroundCTX.imageSmoothingEnabled = false

    if (this.assetService.selectedGameComponent) {
      this.canvasService.blackoutCTX.globalCompositeOperation = 'destination-over'
      this.canvasService.blackoutCTX.globalAlpha = .9;
      this.canvasService.blackoutCTX.fillRect(
        0,
        0,
        this.gridService.activeGrid.width * 32,
        this.gridService.activeGrid.height * 32
      )
    }

  }

  public revealBlackoutFog(): void {
    if (this.assetService.selectedGameComponent) {
      const fogOfWarRim = this.newFogOfWarService.fogOfWarRimPoints[this.assetService.selectedGameComponent.cell.id].map(a => a)

      this.canvasService.blackoutCTX.globalCompositeOperation = 'destination-out'
      this.canvasService.blackoutCTX.fillStyle = "black"

      if(!DebugSettings.fogDebug && DebugSettings.fogFeather) {
        this.canvasService.blackoutCTX.filter = "blur(35px)";  // "feather"
      }

      if (this.newFogOfWarService.blackOutRimPoints.length === 0) {
        this.newFogOfWarService.blackOutRimPoints = fogOfWarRim
      }
      let blackOutRim = this.newFogOfWarService.blackOutRimPoints

      const fogNonObstructedCells = this.newFogOfWarService.nonObstructedCells[this.assetService.selectedGameComponent.cell.id]

      if (this.movementComplete) {
        const tempBlackOutRim: Cell[] = []


        for (let cell of fogOfWarRim) {
          const _index = blackOutRim.findIndex(_cell => cell.id === _cell.id)

          if (_index === -1) {
            continue
          }

          for (let i = 0; i < _index; i++) {
            const bCell = blackOutRim.shift();
            blackOutRim.push(bCell)
          }
          break

        }

        const dBlack = blackOutRim
        const dFog = fogOfWarRim

        while (dBlack.length > 0 && dFog.length > 0) {
          const blackCell = dBlack[0]
          const fogCell = dFog[0]

          if (blackCell.id === fogCell.id) {
            tempBlackOutRim.push(dBlack.shift())
            dFog.shift()
            continue
          }

          let blackHasFogsMatch
          let fogHasBlacksMatch
          try {
            blackHasFogsMatch = dBlack.find(dbo => fogCell.id === dbo.id)
            fogHasBlacksMatch = dFog.find(df => df.id === blackCell.id)
          } catch (e) {
            console.log(e)
            debugger
          }

          if (blackHasFogsMatch) {
            let index = dBlack.indexOf(blackHasFogsMatch)
            for (let i = 0; i <= index; i++) {
              tempBlackOutRim.push(dBlack.shift())
            }
            dFog.shift()
            continue
          }

          if (fogHasBlacksMatch) {
            let index = dFog.indexOf(fogHasBlacksMatch)
            for (let i = 0; i <= index; i++) {
              tempBlackOutRim.push(dFog.shift())
            }
            dBlack.shift()
            continue
          }

          tempBlackOutRim.push(dFog.shift())
          dBlack.shift()
        }

        dBlack.forEach((cell) => {
          tempBlackOutRim.push(cell)
        })

        dFog.forEach((cell) => {
          tempBlackOutRim.push(cell)
        })

        this.newFogOfWarService.blackOutRimPoints = tempBlackOutRim
      }
      this.movementComplete = false

      this.newFogOfWarService.visitedCells = new Set([...this.newFogOfWarService.visitedCells, ...fogNonObstructedCells])

      if (DebugSettings.fogDebug) {
        this.newFogOfWarService.visitedCells.forEach(cell => {
          if (cell) {
            this.canvasService.blackoutCTX.beginPath();
            this.canvasService.blackoutCTX.fillRect(cell.x * 32, cell.y * 32, 5, 5)
            this.canvasService.blackoutCTX.stroke();
          }
        })
      }
      
      // this.clearOutVisibleArea(this.newFogOfWarService.blackOutRimPoints, this.canvasService.blackoutCTX)
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