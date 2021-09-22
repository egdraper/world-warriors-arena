import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { CanvasService } from "../canvas/canvas.service";
import { EditorService } from "../editor/editor-pallete/editor.service";
import { ShortLivedAnimation } from "../game-assets/click-animation";
import { BackgroundAsset } from "../game-assets/tile-assets.db";
import { GridService } from "../grid/grid.service";
import { Cell, SpriteTile } from "../models/cell.model";
import { FogOfWarService } from "./visibility.service";

@Injectable()
export class DrawService {
  public drawForeground$ = new Subject()
  public drawBackground$ = new Subject()
  public foregroundImages: File[] = []

  //TEMP
  private image = new Image()

  constructor(
    public gridService: GridService,
    public canvasService: CanvasService,
    public fogOfWarService: FogOfWarService,
    public editorService: EditorService
  ) {

    this.image.src = `../../../assets/images/StoneFloor1.png`
    this.image.onload = () => {
      this.drawGrid()
    }
  }

  public drawGrid(): void {
    for (let h = 0; h < this.gridService.height; h++) {
      for (let w = 0; w < this.gridService.width; w++) {
        
        let weight = 0
        BackgroundAsset.greenGrass.forEach(tile => {
          tile.lowWeight = weight
          weight += tile.rarity
          tile.highWeight = weight
        })
        const rand = Math.floor(Math.random() * weight);
        let spriteSheet = BackgroundAsset.greenGrass[0].spriteSheet
        let xPos = 0
        let yPos = 0
        BackgroundAsset.greenGrass.forEach(tile => {
          if(rand < tile.highWeight && rand >= tile.lowWeight) {
            xPos = Math.floor(Math.random() * tile.spriteGridPosX.length)
            yPos = Math.floor(Math.random() * tile.spriteGridPosY.length)
            xPos = tile.spriteGridPosX[xPos]
            yPos = tile.spriteGridPosY[yPos]
          }
        })

        this.canvasService.backgroundCTX.imageSmoothingEnabled = false
        this.canvasService.backgroundCTX.drawImage(
          spriteSheet,
          xPos * 32,
          yPos * 32,
          32,
          32,
          w * 32,
          h * 32,
          32,
          32)
      }
    }

    for (let h = 0; h <= this.gridService.height; h++) {
      for (let w = 0; w <= this.gridService.width; w++) {
        this.canvasService.backgroundCTX.beginPath()
        this.canvasService.backgroundCTX.moveTo(w * 32, h * 32)
        this.canvasService.backgroundCTX.lineTo(w * 32, (h * 32) + 32)
        this.canvasService.backgroundCTX.lineWidth = 1;
        this.canvasService.backgroundCTX.strokeStyle = "rgba(255, 255 ,255,.5)"
        this.canvasService.backgroundCTX.stroke()


        this.canvasService.backgroundCTX.beginPath()
        this.canvasService.backgroundCTX.moveTo(w * 32, h * 32)
        this.canvasService.backgroundCTX.lineTo((w * 32) + 32, h * 32)
        this.canvasService.backgroundCTX.strokeStyle = "rgba(255,255,0,.5)"
        this.canvasService.backgroundCTX.lineWidth = 1;
        this.canvasService.backgroundCTX.stroke()
      }
    }
  }

  public drawBlackoutFog(): void {
    if (this.fogOfWarService.fogEnabled) {
      this.canvasService.blackoutCTX.globalCompositeOperation = 'destination-over'
      this.canvasService.blackoutCTX.clearRect(0, 0, this.gridService.width * 32, this.gridService.height * 32);
      this.canvasService.blackoutCTX.fillStyle = 'black';
      this.canvasService.blackoutCTX.globalAlpha = 0.9;
      this.canvasService.blackoutCTX.fillRect(
        0,
        0,
        this.gridService.width * 32,
        this.gridService.height * 32
      )
    }
    // this.addOpaqueFogLineOfSight()
  }

  public drawFog(): void {
    if (this.fogOfWarService.fogEnabled) {
      this.canvasService.fogCTX.globalCompositeOperation = 'destination-over'
      this.canvasService.fogCTX.clearRect(0, 0, this.gridService.width * 32, this.gridService.height * 32);
      this.canvasService.fogCTX.globalAlpha = 0.5;
      this.canvasService.fogCTX.fillStyle = 'black';
      this.canvasService.fogCTX.fillRect(
        0,
        0,
        this.gridService.width * 32,
        this.gridService.height * 32
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

    if (!this.fogOfWarService.visitedVisibleCell[cell.id]) {
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
    if (!animation.cell) { return }

    this.canvasService.foregroundCTX.imageSmoothingEnabled = false
    this.canvasService.backgroundCTX.imageSmoothingEnabled = false
    this.canvasService.overlayCTX.imageSmoothingEnabled = false
    this.canvasService.overlayCTX.clearRect(animation.cell.posX, animation.cell.posY, 32, 32);

    this.canvasService.overlayCTX.drawImage(
      animation.image,
      animation.frameXPosition[animation.frameXCounter],
      animation.frameYPosition[animation.frameYCounter],
      25,
      25,
      animation.cell.posX,
      animation.cell.posY,
      32,
      32
    )
  }

  // public  drawOnlyVisibleObstacle(id: string): void {
  //   this.fogOfWarService.visibleCell[id].forEach(drawObject => {

  //   this.canvasService.foregroundCTX.drawImage(
  //     drawObject.obstacle.image,
  //     drawObject.obstacle.imgIndexX,
  //     drawObject.obstacle.imgIndexY,
  //     50,
  //     80,
  //     drawObject.obstacle.posX,
  //     drawObject.obstacle.posY - 30,
  //     32,
  //     48)
  //   })
  // }

  public drawAnimatedAssets(): void {
    if (this.canvasService.foregroundCTX) {
      this.canvasService.foregroundCTX.clearRect(0, 0, this.gridService.width * 36, this.gridService.height * 36);
      this.gridService.gridDisplay.forEach(row => {
        row.forEach((cell: Cell) => {

          this.drawObstacles(cell)


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
              gameComponent.positionX - 8,
              gameComponent.positionY - 58,
              50,
              80
            )

            if (gameComponent.selectionIndicator) {
              this.canvasService.overlayCTX.clearRect(gameComponent.positionX, gameComponent.positionY, 32, 32);
              this.canvasService.overlayCTX.drawImage(
                gameComponent.selectionIndicator.image,
                gameComponent.selectionIndicator.frameXPosition[gameComponent.selectionIndicator.frameXCounter],
                gameComponent.selectionIndicator.frameYPosition[gameComponent.selectionIndicator.frameYCounter],
                25,
                25,
                gameComponent.positionX,
                gameComponent.positionY,
                32,
                32
              )
            }
          }

        })
      })
    }
  }

  private drawObstacles(cell: Cell): void {

    // OBSTACLES
    const sides = [1, 3]
    const location: string[] = ["rightEndTileName", 'leftEndTileName']

    if (!cell.imageTile) { return }


    sides.forEach((side, index) => {
      if (cell.visible && cell.imageTile) {

        if (cell.neighbors[side]) {
          const obstacle = cell.neighbors[side].obstacle
          const visible = cell.neighbors[side].visible
          const affectedSide = location[index]

          if (!obstacle && !visible && (cell.imageTile as any)[affectedSide]) {
            console.log(cell.id)
            cell.imageTile = this.editorService.getAsset((cell.imageTile as any)[affectedSide]) as SpriteTile

          }

          const rightNeighbor = cell.neighbors[1]
          const leftNeighbor = cell.neighbors[3]
          const rightNeighborImage = rightNeighbor ? rightNeighbor.imageTile : null
          const leftNeighborImage = leftNeighbor ? leftNeighbor.imageTile : null

          if (rightNeighbor && leftNeighbor && rightNeighborImage && leftNeighborImage && cell.imageTile.centerTileName) {
            console.log(cell.imageTile.centerTileName)
            cell.imageTile = this.editorService.getAsset(cell.imageTile.centerTileName) as SpriteTile
            console.log(cell.imageTile)
          }
        }
      }
    })


    if (cell.imageTile.topEndTileName && (
      (cell.neighbors[2] && cell.neighbors[2].imageTile !== cell.imageTile &&
        cell.neighbors[0] && cell.neighbors[0].imageTile !== cell.imageTile) ||
      (cell.neighbors[2] && cell.neighbors[2].imageTile === cell.imageTile &&
        cell.neighbors[0] && cell.neighbors[0].imageTile !== cell.imageTile))
    ) {
      const spriteTile = this.editorService.getAsset(cell.imageTile.topEndTileName.name) as SpriteTile
      this.canvasService.foregroundCTX.drawImage(
        spriteTile.spriteSheet,
        spriteTile.spriteGridPosX * spriteTile.multiplier,
        spriteTile.spriteGridPosY * spriteTile.multiplier,
        spriteTile.tileWidth * spriteTile.multiplier,
        spriteTile.tileHeight * spriteTile.multiplier,
        cell.posX,
        cell.posY + cell.imageTile.topEndTileName.offset,
        spriteTile.tileWidth * spriteTile.multiplier,
        spriteTile.tileHeight * spriteTile.multiplier
      )

    }

    this.canvasService.foregroundCTX.drawImage(
      cell.imageTile.spriteSheet,
      cell.imageTile.spriteGridPosX * cell.imageTile.multiplier,
      cell.imageTile.spriteGridPosY * cell.imageTile.multiplier,
      cell.imageTile.tileWidth * cell.imageTile.multiplier,
      cell.imageTile.tileHeight * cell.imageTile.multiplier,
      cell.posX + cell.imageTile.tileOffsetX,
      cell.posY + cell.imageTile.tileOffsetY,
      cell.imageTile.tileWidth * cell.imageTile.multiplier,
      cell.imageTile.tileHeight * cell.imageTile.multiplier
    )


    if (cell.imageTile.attachments) {
      cell.imageTile.attachments.forEach(attachment => {
        const spriteTile = this.editorService.getAsset(attachment.tileName) as SpriteTile
        this.canvasService.foregroundCTX.drawImage(
          spriteTile.spriteSheet,
          spriteTile.spriteGridPosX * spriteTile.multiplier,
          spriteTile.spriteGridPosY * spriteTile.multiplier,
          spriteTile.tileWidth * spriteTile.multiplier,
          spriteTile.tileHeight * spriteTile.multiplier,
          cell.posX + attachment.xOffset,
          cell.posY + attachment.yOffset,
          spriteTile.tileWidth * spriteTile.multiplier,
          spriteTile.tileHeight * spriteTile.multiplier
        )
      })
    }

  }
}
