import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { CanvasService } from "../canvas/canvas.service";
import { EditorService } from "../editor/editor-pallete/editor.service";
import { ShortLivedAnimation } from "../game-assets/click-animation";
import { growableItems } from "../game-assets/tiles.db.ts/tile-assets.db";
import { GridService } from "../grid/grid.service";
import { Cell, SpriteBackgroundTile } from "../models/cell.model";
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
    public editorService: EditorService
  ) {

    setTimeout(() => {
      this.drawBackground(true)
    }, 1000)

  }

  public drawLines(): void {
    // Draw Lines
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

  public fillTerrain() {
    for (let h = 0; h < this.gridService.height; h++) {
      for (let w = 0; w < this.gridService.width; w++) {
        let spriteSheet
        let xPos = 0
        let yPos = 0
        const cell = this.gridService.grid[`x${w}:y${h}`]

        //Randomly generates random texture
        let weight = 0
        this.editorService.findBackgroundCollection("greenGrass").forEach(tile => {
          tile.lowWeight = weight
          weight += tile.rarity
          tile.highWeight = weight
        })

        const rand = Math.floor(Math.random() * weight);
        spriteSheet = this.editorService.findBackgroundCollection("greenGrass")[0].spriteSheet

        this.editorService.findBackgroundCollection("greenGrass").forEach(tile => {
          if (rand < tile.highWeight && rand >= tile.lowWeight) {
            xPos = Math.floor(Math.random() * tile.spriteGridPosX.length)
            yPos = Math.floor(Math.random() * tile.spriteGridPosY.length)
            xPos = tile.spriteGridPosX[xPos]
            yPos = tile.spriteGridPosY[yPos]
            spriteSheet = tile.spriteSheet
          }
        })

        cell.backgroundTile = {
          id: `x${xPos}:Y${yPos}greenGrass`,
          spriteSheet: spriteSheet,
          spriteGridPosX: [xPos],
          spriteGridPosY: [yPos],
          rarity: 0
        }
      }
    }
  }

  public drawBackground(forceDraw: boolean = false): void {

    if (this.editorService.backgroundDirty || forceDraw)
      for (let h = 0; h < this.gridService.height; h++) {
        for (let w = 0; w < this.gridService.width; w++) {
          const cell = this.gridService.grid[`x${w}:y${h}`]

          if(cell.backgroundGrowableTileId) {
            this.calculateGrowableBackgroundTerrain(cell)
          }

          this.canvasService.backgroundCTX.imageSmoothingEnabled = false
          this.canvasService.backgroundCTX.drawImage(
            cell.backgroundTile.spriteSheet,
            cell.backgroundTile.spriteGridPosX[0] * 32,
            cell.backgroundTile.spriteGridPosY[0] * 32,
            32,
            32,
            cell.posX,
            cell.posY,
            32,
            32
          )
        }
      }

    this.editorService.backgroundDirty = false
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
    if (this.fogOfWarService.fogEnabled) {
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
  }
  public drawLineOfSight(ctx: any, cell: Cell): void {
    if (this.fogOfWarService.fogEnabled) {
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
    if (cell.growableTileId) {
      this.calculateGrowableTerrain(cell)
    }

    if (cell.visible && cell.imageTile) {
      this.canvasService.foregroundCTX.drawImage(
        cell.imageTile.spriteSheet,
        cell.imageTile.spriteGridPosX * cell.imageTile.multiplier,
        cell.imageTile.spriteGridPosY * cell.imageTile.multiplier,
        cell.imageTile.tileWidth * cell.imageTile.multiplier,
        cell.imageTile.tileHeight * cell.imageTile.multiplier,
        cell.posX + cell.imageTile.tileOffsetX,
        cell.posY + cell.imageTile.tileOffsetY,
        cell.imageTile.tileWidth * (cell.imageTile.sizeAdjustment || cell.imageTile.multiplier),
        cell.imageTile.tileHeight * (cell.imageTile.sizeAdjustment || cell.imageTile.multiplier)
      )
    }
  }

  private calculateGrowableTerrain(selectedCell: Cell): void {
    const growableItem = growableItems.find(item => item.id === this.editorService.selectedGrowableAsset)
    const topNeighbor = selectedCell.neighbors[0]
    const topRightNeighbor = selectedCell.neighbors[4]
    const rightNeighbor = selectedCell.neighbors[1]
    const bottomRightNeighbor = selectedCell.neighbors[5]
    const bottomNeighbor = selectedCell.neighbors[2]
    const bottomLeftNeighbor = selectedCell.neighbors[6]
    const leftNeighbor = selectedCell.neighbors[3]
    const topLeftNeighbor = selectedCell.neighbors[7]

    const neighbors = {
      topLeftMatch: topLeftNeighbor.growableTileId === selectedCell.growableTileId,
      topCenterMatch: topNeighbor.growableTileId === selectedCell.growableTileId,
      topRightMatch: topRightNeighbor.growableTileId === selectedCell.growableTileId,
      centerLeftMatch: leftNeighbor.growableTileId === selectedCell.growableTileId,
      centerRightMatch: rightNeighbor.growableTileId === selectedCell.growableTileId,
      bottomLeftMatch: bottomLeftNeighbor.growableTileId === selectedCell.growableTileId,
      bottomCenterMatch: bottomNeighbor.growableTileId === selectedCell.growableTileId,
      bottomRightMatch: bottomRightNeighbor.growableTileId === selectedCell.growableTileId
    }

    let tile = growableItem.spritesTiles.find(spriteTile => {
      const topMatch = neighbors.topCenterMatch === spriteTile.drawWhen.topNeighbor || spriteTile.drawWhen.topNeighbor === null
      const topRightMatch = neighbors.topRightMatch === spriteTile.drawWhen.topRightNeighbor || spriteTile.drawWhen.topRightNeighbor === null
      const rightMatch = neighbors.centerRightMatch === spriteTile.drawWhen.rightNeighbor || spriteTile.drawWhen.rightNeighbor === null
      const bottomRightMatch = neighbors.bottomRightMatch === spriteTile.drawWhen.bottomRightNeighbor || spriteTile.drawWhen.bottomRightNeighbor === null
      const bottomMatch = neighbors.bottomCenterMatch === spriteTile.drawWhen.bottomNeighbor || spriteTile.drawWhen.bottomNeighbor === null
      const bottomLeftNeighborMatch = neighbors.bottomLeftMatch === spriteTile.drawWhen.bottomLeftNeighbor || spriteTile.drawWhen.bottomLeftNeighbor === null
      const leftNeighborMatch = neighbors.centerLeftMatch === spriteTile.drawWhen.leftNeighbor || spriteTile.drawWhen.leftNeighbor === null
      const topLeftNeighborMatch = neighbors.topLeftMatch === spriteTile.drawWhen.topLeftNeighbor || spriteTile.drawWhen.topLeftNeighbor === null

      return topMatch &&
        topRightMatch &&
        rightMatch &&
        bottomRightMatch &&
        bottomMatch &&
        bottomLeftNeighborMatch &&
        leftNeighborMatch &&
        topLeftNeighbor &&
        topLeftNeighborMatch
    })

    if (!tile) {
      tile = growableItem.spritesTiles.find(cliff => cliff.default)
    }

    selectedCell.imageTile = tile
    selectedCell.visible = true
  }

  private calculateGrowableBackgroundTerrain(selectedCell: Cell): void {
    if (!this.editorService.backgroundDirty) { return }

    const growableItem = growableItems.find(item => item.id === this.editorService.selectedGrowableAsset)
    const topNeighbor = selectedCell.neighbors[0]
    const topRightNeighbor = selectedCell.neighbors[4]
    const rightNeighbor = selectedCell.neighbors[1]
    const bottomRightNeighbor = selectedCell.neighbors[5]
    const bottomNeighbor = selectedCell.neighbors[2]
    const bottomLeftNeighbor = selectedCell.neighbors[6]
    const leftNeighbor = selectedCell.neighbors[3]
    const topLeftNeighbor = selectedCell.neighbors[7]

    const neighbors = {
      topLeftMatch: topLeftNeighbor.backgroundGrowableTileId === selectedCell.backgroundGrowableTileId,
      topCenterMatch: topNeighbor.backgroundGrowableTileId === selectedCell.backgroundGrowableTileId,
      topRightMatch: topRightNeighbor.backgroundGrowableTileId === selectedCell.backgroundGrowableTileId,
      centerLeftMatch: leftNeighbor.backgroundGrowableTileId === selectedCell.backgroundGrowableTileId,
      centerRightMatch: rightNeighbor.backgroundGrowableTileId === selectedCell.backgroundGrowableTileId,
      bottomLeftMatch: bottomLeftNeighbor.backgroundGrowableTileId === selectedCell.backgroundGrowableTileId,
      bottomCenterMatch: bottomNeighbor.backgroundGrowableTileId === selectedCell.backgroundGrowableTileId,
      bottomRightMatch: bottomRightNeighbor.backgroundGrowableTileId === selectedCell.backgroundGrowableTileId
    }

    let tile = growableItem.spritesTiles.find(spriteTile => {
      const topMatch = neighbors.topCenterMatch === spriteTile.drawWhen.topNeighbor || spriteTile.drawWhen.topNeighbor === null
      const topRightMatch = neighbors.topRightMatch === spriteTile.drawWhen.topRightNeighbor || spriteTile.drawWhen.topRightNeighbor === null
      const rightMatch = neighbors.centerRightMatch === spriteTile.drawWhen.rightNeighbor || spriteTile.drawWhen.rightNeighbor === null
      const bottomRightMatch = neighbors.bottomRightMatch === spriteTile.drawWhen.bottomRightNeighbor || spriteTile.drawWhen.bottomRightNeighbor === null
      const bottomMatch = neighbors.bottomCenterMatch === spriteTile.drawWhen.bottomNeighbor || spriteTile.drawWhen.bottomNeighbor === null
      const bottomLeftNeighborMatch = neighbors.bottomLeftMatch === spriteTile.drawWhen.bottomLeftNeighbor || spriteTile.drawWhen.bottomLeftNeighbor === null
      const leftNeighborMatch = neighbors.centerLeftMatch === spriteTile.drawWhen.leftNeighbor || spriteTile.drawWhen.leftNeighbor === null
      const topLeftNeighborMatch = neighbors.topLeftMatch === spriteTile.drawWhen.topLeftNeighbor || spriteTile.drawWhen.topLeftNeighbor === null

      return topMatch &&
        topRightMatch &&
        rightMatch &&
        bottomRightMatch &&
        bottomMatch &&
        bottomLeftNeighborMatch &&
        leftNeighborMatch &&
        topLeftNeighbor &&
        topLeftNeighborMatch
    })

    if (!tile) {
      tile = growableItem.spritesTiles.find(cliff => cliff.default)
    }

    selectedCell.backgroundTile = {
      spriteSheet: tile.spriteSheet,
      spriteGridPosX: [tile.spriteGridPosX],
      spriteGridPosY: [tile.spriteGridPosY],
      id: tile.id + tile.spriteGridPosX + tile.spriteGridPosY
    }
  }
}
