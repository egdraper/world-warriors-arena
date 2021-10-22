import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { CanvasService } from "../../canvas/canvas.service";
import { EditorService } from "../../editor/editor-pallete/editor.service";
import { ShortLivedAnimation } from "../../game-assets/click-animation";
import { growableItems } from "../../game-assets/tiles.db.ts/tile-assets.db";
import { GridService } from "../grid.service";
import { Cell, SpriteTile } from "../../models/cell.model";
import { FogOfWarService } from "../visibility.service";
import { AssetsService } from "../../game-assets/assets.service";
import { GameComponent } from "../../models/assets.model";

@Injectable()
export class DrawService {
  constructor(
    public gridService: GridService,
    public canvasService: CanvasService,
    public fogOfWarService: FogOfWarService,
    public editorService: EditorService,
    public assetService: AssetsService
  ) {

  }

  public drawLines(): void {
    if (this.editorService.backgroundDirty) {
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
  }

  public autoFillTerrain(collectionId: string) {
    for (let h = 0; h < this.gridService.height; h++) {
      for (let w = 0; w < this.gridService.width; w++) {
        let spriteSheet
        let xPos = 0
        let yPos = 0
        const cell = this.gridService.grid[`x${w}:y${h}`]

        //Randomly generates random texture
        let weight = 0
        this.editorService.findBackgroundCollection(collectionId).forEach(tile => {
          tile.lowWeight = weight
          weight += tile.rarity
          tile.highWeight = weight
        })

        const rand = Math.floor(Math.random() * weight);
        spriteSheet = this.editorService.findBackgroundCollection(collectionId)[0].spriteSheet

        this.editorService.findBackgroundCollection(collectionId).forEach(tile => {
          if (rand < tile.highWeight && rand >= tile.lowWeight) {
            xPos = Math.floor(Math.random() * tile.spriteGridPosX.length)
            yPos = Math.floor(Math.random() * tile.spriteGridPosY.length)
            xPos = tile.spriteGridPosX[xPos]
            yPos = tile.spriteGridPosY[yPos]
            spriteSheet = tile.spriteSheet
          }
        })

        cell.backgroundTile = {
          id: `x${xPos}:Y${yPos}${collectionId}`,
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

          if (cell.backgroundGrowableTileId) {
            this.calculateGrowableBackgroundTerrain(cell)
          }
          this.drawOnBackgroundCell(cell)
        }

      }
    // this.drawLines()

    this.editorService.backgroundDirty = false
    this.blackOutEdges()
  }


  public blackOutEdges(): void {
    if (this.canvasService.blackoutCTX) {
      this.canvasService.blackoutCTX.fillStyle = 'black';
      this.canvasService.blackoutCTX.fillRect(
        0,
        0,
        32,
        this.gridService.width * 32,
      )

    }

    if (this.canvasService.blackoutCTX) {
      this.canvasService.blackoutCTX.fillStyle = 'black';
      this.canvasService.blackoutCTX.fillRect(
        0,
        this.gridService.height * 32 - 64,
        this.gridService.width * 32,
        64,
      )

    }

    if (this.canvasService.blackoutCTX) {
      this.canvasService.blackoutCTX.fillStyle = 'black';
      this.canvasService.blackoutCTX.fillRect(
        this.gridService.width * 32 - 32,
        0,
        64,
        this.gridService.height * 32,
      )

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
      this.assetService.gameComponents.forEach(gameComponent => {
        // if(this.fogOfWarService.fogEnabled ) { 
        //   this.drawOnlyVisibleObstacle(cell.id) 
        // }

        const cell = this.gridService.getGridCellByCoordinate(gameComponent.positionX + 1, gameComponent.positionY + 1)
        this.canvasService.foregroundCTX.clearRect(0, 0, 1800, 1800);
        this.canvasService.backgroundCTX.clearRect(0, 0, 1800, 1800);
        this.canvasService.blackoutCTX.clearRect(0, 0, 1800, 1800);
        this.drawOnCell(cell)
        
        // Ensure the viewport does not kick back a negative number (cells don't work with negatives)
        const topLeftPosX = -1 * this.canvasService.canvasViewPortOffsetX + 1 < 0 ? 1 : -1 * this.canvasService.canvasViewPortOffsetX + 1
        const topLeftPosY = -1 * this.canvasService.canvasViewPortOffsetY + 1 < 0 ? 1 : -1 * this.canvasService.canvasViewPortOffsetY + 1
        
        const topRightPosX = 
          -1 * this.canvasService.canvasViewPortOffsetX * this.canvasService.scale + 1280 > this.gridService.width * (32 * this.canvasService.scale)
          ? this.gridService.width * (32 * this.canvasService.scale)
          : -1 * this.canvasService.canvasViewPortOffsetX * this.canvasService.scale + 1280
        
        const bottomPosY = -1 * this.canvasService.canvasViewPortOffsetY * this.canvasService.scale + 1344

        const cellTopLeft = this.gridService.getGridCellByCoordinate(topLeftPosX, topLeftPosY)
        const cellTopRight = this.gridService.getGridCellByCoordinate(topRightPosX, topLeftPosY)
        const cellBottomLeft = this.gridService.getGridCellByCoordinate(topLeftPosX, bottomPosY)
        try {
        //  const cellBottomRight = this.gridService.getGridCellByCoordinate(this.canvasService.canvasViewPortOffsetX + 1200, this.canvasService.canvasViewPortOffsetY + 1200)
         for(let y = cellTopLeft.y; y <= cellBottomLeft.y; y++){
           for(let x = cellTopLeft.x; x <= cellTopRight.x; x++) {
             const drawableCell = this.gridService.getCell(x,y)
             this.drawOnBackgroundCell(drawableCell)
             this.drawOnCell(drawableCell)
           }
         }
        }  catch(e) {
         debugger
        }

        // for (let i = 0; i < 32; i++) {
        //   for (let l = 0; l < 32; l++) {
        //     this.drawOnBackgroundCell(this.gridService.getCell(cell.x - 16 + l, cell.y - 16 + i))
        //     this.drawOnCell(this.gridService.getCell(cell.x - 16 + l, cell.y - 16 + i))
        //   }
        // }
        // this.drawOnCell(this.gridService.getCell(cell.x, cell.y))
        // this.drawOnCell(this.gridService.getCell(cell.x, cell.y-1))
        // this.drawOnCell(this.gridService.getCell(cell.x, cell.y-2))
        // this.drawOnCell(this.gridService.getCell(cell.x-1, cell.y))
        // this.drawOnCell(this.gridService.getCell(cell.x-1, cell.y-1))
        // this.drawOnCell(this.gridService.getCell(cell.x-1, cell.y-2))
        // this.drawOnCell(this.gridService.getCell(cell.x+1, cell.y-1))
        // this.drawOnCell(this.gridService.getCell(cell.x+1, cell.y-2))
        // this.drawOnCell(this.gridService.getCell(cell.x+2, cell.y-1))
        // this.drawOnCell(this.gridService.getCell(cell.x+2, cell.y-2))


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


        // this.drawOnCell(this.gridService.getCell(cell.x-1, cell.y+1))
        // this.drawOnCell(this.gridService.getCell(cell.x-1, cell.y+2))
        // this.drawOnCell(this.gridService.getCell(cell.x-1, cell.y+3))

        // this.drawOnCell(this.gridService.getCell(cell.x, cell.y+1))
        // this.drawOnCell(this.gridService.getCell(cell.x, cell.y+2))
        // this.drawOnCell(this.gridService.getCell(cell.x, cell.y+3))

        // this.drawOnCell(this.gridService.getCell(cell.x+1, cell.y))
        // this.drawOnCell(this.gridService.getCell(cell.x+1, cell.y+1))
        // this.drawOnCell(this.gridService.getCell(cell.x+1, cell.y+2))
        // this.drawOnCell(this.gridService.getCell(cell.x+1, cell.y+3))

        // this.drawOnCell(this.gridService.getCell(cell.x+2, cell.y))
        // this.drawOnCell(this.gridService.getCell(cell.x+2, cell.y+1))
        // this.drawOnCell(this.gridService.getCell(cell.x+2, cell.y+2))
        // this.drawOnCell(this.gridService.getCell(cell.x+2, cell.y+3))
        // this.drawOnCell(this.gridService.getCell(cell.x+3, cell.y))

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


      })


    }
  }

  public drawEditableObject(): void {
    if (!this.editorService.selectedAsset || !this.editorService.hoveringCell) { return }

    this.canvasService.foregroundCTX.drawImage(
      this.editorService.selectedAsset.spriteSheet,
      this.editorService.selectedAsset.spriteGridPosX * this.editorService.selectedAsset.multiplier,
      this.editorService.selectedAsset.spriteGridPosY * this.editorService.selectedAsset.multiplier,
      this.editorService.selectedAsset.tileWidth * this.editorService.selectedAsset.multiplier,
      this.editorService.selectedAsset.tileHeight * this.editorService.selectedAsset.multiplier,
      this.editorService.hoveringCell.posX + this.editorService.selectedAsset.tileOffsetX,
      this.editorService.hoveringCell.posY + this.editorService.selectedAsset.tileOffsetY,
      this.editorService.selectedAsset.tileWidth * (this.editorService.selectedAsset.sizeAdjustment || this.editorService.selectedAsset.multiplier),
      this.editorService.selectedAsset.tileHeight * (this.editorService.selectedAsset.sizeAdjustment || this.editorService.selectedAsset.multiplier)
    )
  }

  public drawObstacles(): void {
    if (this.canvasService.foregroundCTX && this.assetService.obstaclesDirty) {
      this.canvasService.foregroundCTX.clearRect(0, 0, this.gridService.width * 36, this.gridService.height * 36);
      this.gridService.gridDisplay.forEach(row => {
        row.forEach((cell: Cell) => {

          if (cell.growableTileId && !cell.growableTileOverride) {
            this.calculateGrowableTerrain(cell)
          }

          this.drawOnCell(cell)
        })
      })
      this.assetService.obstaclesDirty = false
    }
  }

  private drawOnCell(cell: Cell): void {
    if (cell && cell.visible && cell.imageTile) {
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

  public drawOnBackgroundCell(cell: Cell): void {
    if (cell && cell.backgroundTile) {

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

  private calculateGrowableTerrain(selectedCell: Cell): void {
    const drawableItem = growableItems.find(item => {
      return selectedCell.growableTileId.includes(item.id)
    })

    const topNeighbor = selectedCell.neighbors[0]
    const topRightNeighbor = selectedCell.neighbors[4]
    const rightNeighbor = selectedCell.neighbors[1]
    const bottomRightNeighbor = selectedCell.neighbors[5]
    const bottomNeighbor = selectedCell.neighbors[2]
    const bottomLeftNeighbor = selectedCell.neighbors[6]
    const leftNeighbor = selectedCell.neighbors[3]
    const topLeftNeighbor = selectedCell.neighbors[7]

    const neighbors = {
      topLeftMatch: topLeftNeighbor?.growableTileId === selectedCell.growableTileId,
      topCenterMatch: topNeighbor?.growableTileId === selectedCell.growableTileId,
      topRightMatch: topRightNeighbor?.growableTileId === selectedCell.growableTileId,
      centerLeftMatch: leftNeighbor?.growableTileId === selectedCell.growableTileId,
      centerRightMatch: rightNeighbor?.growableTileId === selectedCell.growableTileId,
      bottomLeftMatch: bottomLeftNeighbor?.growableTileId === selectedCell.growableTileId,
      bottomCenterMatch: bottomNeighbor?.growableTileId === selectedCell.growableTileId,
      bottomRightMatch: bottomRightNeighbor?.growableTileId === selectedCell.growableTileId
    }

    let tile = drawableItem.spritesTiles.find(spriteTile => {
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
      tile = drawableItem.spritesTiles.find(cliff => cliff.default)
    }

    selectedCell.imageTile = tile
    selectedCell.visible = true
  }

  private calculateGrowableBackgroundTerrain(selectedCell: Cell): void {
    if (!this.editorService.backgroundDirty) { return }

    const growableItem = growableItems.find(item => {
      return selectedCell.backgroundGrowableTileId.includes(item.id)
    })
    const topNeighbor = selectedCell.neighbors[0]
    const topRightNeighbor = selectedCell.neighbors[4]
    const rightNeighbor = selectedCell.neighbors[1]
    const bottomRightNeighbor = selectedCell.neighbors[5]
    const bottomNeighbor = selectedCell.neighbors[2]
    const bottomLeftNeighbor = selectedCell.neighbors[6]
    const leftNeighbor = selectedCell.neighbors[3]
    const topLeftNeighbor = selectedCell.neighbors[7]

    const neighbors = {
      topLeftMatch: topLeftNeighbor?.backgroundGrowableTileId === selectedCell.backgroundGrowableTileId,
      topCenterMatch: topNeighbor?.backgroundGrowableTileId === selectedCell.backgroundGrowableTileId,
      topRightMatch: topRightNeighbor?.backgroundGrowableTileId === selectedCell.backgroundGrowableTileId,
      centerLeftMatch: leftNeighbor?.backgroundGrowableTileId === selectedCell.backgroundGrowableTileId,
      centerRightMatch: rightNeighbor?.backgroundGrowableTileId === selectedCell.backgroundGrowableTileId,
      bottomLeftMatch: bottomLeftNeighbor?.backgroundGrowableTileId === selectedCell.backgroundGrowableTileId,
      bottomCenterMatch: bottomNeighbor?.backgroundGrowableTileId === selectedCell.backgroundGrowableTileId,
      bottomRightMatch: bottomRightNeighbor?.backgroundGrowableTileId === selectedCell.backgroundGrowableTileId
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
