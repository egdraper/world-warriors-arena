import { ThrowStmt } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { CanvasService } from "../canvas/canvas.service";
import { ShortLivedAnimation } from "../game-assets/click-animation";
import { GridService } from "../grid/grid.service";
import { Cell } from "../models/cell.model";
import { FogOfWarService } from "./visibility.service";

@Injectable()
export class DrawService {
  public drawForeground$ = new Subject()
  public drawBackground$ = new Subject()
  public foregroundImages: File[] = []

  constructor(
    public gridService: GridService,
    public canvasService: CanvasService,
    public fogOfWarService: FogOfWarService,
  ) { }

  public drawBlackoutFog(): void {
    if(this.fogOfWarService.fogEnabled) {
      this.canvasService.blackoutCTX.globalCompositeOperation = 'destination-over'
      this.canvasService.blackoutCTX.clearRect(0, 0, this.gridService.width * 50, this.gridService.height * 50);
      this.canvasService.blackoutCTX.fillStyle = 'black';
      this.canvasService.blackoutCTX.globalAlpha = 0.9;
      this.canvasService.blackoutCTX.fillRect(   
        0,
        0,
        this.gridService.width * 50,
        this.gridService.height * 50
        )
    }
    // this.addOpaqueFogLineOfSight()
  }

  public drawFog(): void {
    if(this.fogOfWarService.fogEnabled) {
      this.canvasService.fogCTX.globalCompositeOperation = 'destination-over'
      this.canvasService.fogCTX.clearRect(0, 0, this.gridService.width * 50, this.gridService.height * 50);
      this.canvasService.fogCTX.globalAlpha = 0.5;
      this.canvasService.fogCTX.fillStyle = 'black';
      this.canvasService.fogCTX.fillRect(   
        0,
        0,
        this.gridService.width * 50,
        this.gridService.height * 50
        )
    }
    // this.addOpaqueFogLineOfSight()
  }

  public clearFogLineOfSight(cell: Cell): void {
    this.drawFog()
    const ctx = this.canvasService.fogCTX
    const ctxBlackout = this.canvasService.blackoutCTX
    ctx.globalCompositeOperation = 'destination-out'
    ctxBlackout.globalCompositeOperation = 'destination-out'

    if(!this.fogOfWarService.visitedVisibleCell[cell.id]) {
      this.fogOfWarService.visitedVisibleCell[cell.id] = this.fogOfWarService.visibleCell[cell.id]
      this.drawLineOfSight(ctxBlackout, cell)
    } 
    this.drawLineOfSight(ctx, cell)
    this.drawLineOfSight(ctx, cell)
    this.drawLineOfSight(ctx, cell)
    this.drawLineOfSight(ctx, cell)
    this.drawLineOfSight(ctx, cell)
    this.drawLineOfSight(ctx, cell)
    this.drawLineOfSight(ctx, cell)
    this.drawLineOfSight(ctx, cell)

  }
  public drawLineOfSight(ctx: any, cell: Cell): void {
    this.fogOfWarService.visibleCell[cell.id].forEach(points => {
      ctx.beginPath();
      ctx.moveTo(points.playerPointX, points.playerPointY);
      // ctx.filter = "blur(15px)";  // "feather"
      ctx.lineTo(points.obstaclePoint1X, points.obstaclePoint1Y);
      ctx.lineTo(points.point1offsetX, points.point1offsetY)
      ctx.lineTo(points.point2offsetX, points.point2offsetY)
      ctx.lineTo(points.obstaclePoint2X, points.obstaclePoint2Y);
      ctx.lineTo(points.playerPointX, points.playerPointY);
      ctx.closePath();
      ctx.fillStyle = "black";
      ctx.fill();
    })
  }

  // public addOpaqueFogLineOfSight(): void {
  //   let a = 0
  //   console.log(Object.keys(this.fogOfWarService.visitedVisibleCell).length)
  //   Object.keys(this.fogOfWarService.visitedVisibleCell).forEach(visitedCellId => {
  //     this.fogOfWarService.visitedVisibleCell[visitedCellId].forEach(clearing => {
  //       // console.log(this.fogOfWarService.visitedVisibleCell[visitedCellId].length)
  //     })
  //   })
  // }



  public drawShortLivedAnimation(animation: ShortLivedAnimation): void {
    if(!animation.cell) { return }
    
    this.canvasService.foregroundCTX.imageSmoothingEnabled = false
    this.canvasService.backgroundCTX.imageSmoothingEnabled = false
    this.canvasService.overlayCTX.imageSmoothingEnabled = false
    this.canvasService.overlayCTX.clearRect(animation.cell.posX, animation.cell.posY, 50, 50);

    this.canvasService.overlayCTX.drawImage(
      animation.image,
      animation.frameXPosition[animation.frameXCounter],
      animation.frameYPosition[animation.frameYCounter],
      25,
      25,
      animation.cell.posX,
      animation.cell.posY,
      25 * 2,
      25 * 2
    )
  }

  public  drawOnlyVisibleObstacle(id: string): void {
    this.fogOfWarService.visibleCell[id].forEach(drawObject => {

    this.canvasService.foregroundCTX.drawImage(
      drawObject.obstacle.image,
      drawObject.obstacle.imgIndexX,
      drawObject.obstacle.imgIndexY,
      50,
      80,
      drawObject.obstacle.posX,
      drawObject.obstacle.posY - 30,
      25 * 2,
      40 * 2)
    })
  }

  public drawAnimatedAssets(): void {
    if (this.canvasService.foregroundCTX) {
      this.canvasService.foregroundCTX.clearRect(0, 0, this.gridService.width * 50, this.gridService.height * 50);

      this.gridService.gridDisplay.forEach(row => {
        row.forEach((cell: Cell) => {
          // OBSTACLES
          if (cell.obstacle ) {
            this.canvasService.foregroundCTX.drawImage(
              cell.image,
              cell.imgIndexX,
              cell.imgIndexY,
              cell.imgWidth,
              cell.imgHeight,
              cell.posX + cell.imgOffsetX,
              cell.posY + cell.imgOffsetY,
              cell.imgWidth,
              cell.imgHeight  )
          }

          // GAME COMPONENTS
          if (cell.occupiedBy) {
            const gameComponent = cell.occupiedBy
            // if(this.fogOfWarService.fogEnabled ) { 
            //   this.drawOnlyVisibleObstacle(cell.id) 
            // }

            this.canvasService.foregroundCTX.drawImage(
              gameComponent.image,
              gameComponent.frameXPosition[gameComponent.frameCounter],
              gameComponent.frameYPosition,
              25,
              36,
              gameComponent.positionX,
              gameComponent.positionY - 40,
              50,
              80
            )

            if (gameComponent.selectionIndicator) {
              this.canvasService.overlayCTX.clearRect(gameComponent.positionX, gameComponent.positionY, 25 * 2, 25 * 2);
              this.canvasService.overlayCTX.drawImage(
                gameComponent.selectionIndicator.image,
                gameComponent.selectionIndicator.frameXPosition[gameComponent.selectionIndicator.frameXCounter],
                gameComponent.selectionIndicator.frameYPosition[gameComponent.selectionIndicator.frameYCounter],
                25,
                25,
                gameComponent.positionX,
                gameComponent.positionY,
                25 * 2,
                25 * 2
              )
            }
          }

        })
      })
    }
  }

}