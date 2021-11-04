import { CONTEXT_NAME } from "@angular/compiler/src/render3/view/util";
import { Injectable } from "@angular/core";
import { CanvasService } from "../../canvas/canvas.service";
import { EditorService } from "../../editor/editor-palette/editor.service";
import { AssetsService } from "../../game-assets/assets.service";
import { ShortLivedAnimation } from "../../game-assets/click-animation";
import { growableItems } from "../../game-assets/tiles.db.ts/tile-assets.db";
import { MotionAsset } from "../../models/assets.model";
import { Cell } from "../../models/cell.model";
import { GridService } from "../grid.service";
import { FogOfWarService } from "../visibility.service";

@Injectable()
export class DrawService {
  constructor(
    public gridService: GridService,
    public canvasService: CanvasService,
    public fogOfWarService: FogOfWarService,
    public editorService: EditorService,
    public assetService: AssetsService
  ) { }

  // Draws Grid Lines  
  public drawGridLines(): void {
    if (this.editorService.backgroundDirty) {
      for (let h = 0; h <= this.gridService.height; h++) {
        for (let w = 0; w <= this.gridService.width; w++) {
          // Horizontal lines
          this.canvasService.backgroundCTX.beginPath()
          this.canvasService.backgroundCTX.moveTo(w * 32, h * 32)
          this.canvasService.backgroundCTX.lineTo(w * 32, (h * 32) + 32)
          this.canvasService.backgroundCTX.lineWidth = 1;
          this.canvasService.backgroundCTX.strokeStyle = "rgba(255, 255 ,255,.5)"
          this.canvasService.backgroundCTX.stroke()

          // Vertical Lines
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

  // Draws baground tiles when needed
  public drawBackground(forceDraw: boolean = false): void {
    if (this.gridService.gridLoaded) { return }

    if (this.editorService.backgroundDirty || forceDraw) {
      for (let h = 0; h < this.gridService.height; h++) {
        for (let w = 0; w < this.gridService.width; w++) {
          const cell = this.gridService.grid[`x${w}:y${h}`]

          try {
            if (cell.backgroundGrowableTileId) {
              this.calculateGrowableBackgroundTerrain(cell)
            }
            this.drawOnBackgroundCell(cell)
          } catch {
            debugger
          }
        }
      }

      this.editorService.backgroundDirty = false
    }
  }

  // Paints a black box over the edges to give one cell's worth of room to have players step in and out of view
  public drawBlackOutEdges(): void {
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

  // Fog Of War Complete Black Out
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

  // Fog Of War Transparent fog
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

  // Fog of War, preps and draws the seeable area
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

  // Fog of War clears Line of Sight
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

  // Draws animations that have a short life span
  public drawShortLivedAnimation(animation: ShortLivedAnimation): void {
    this.canvasService.overlayCTX.clearRect(0, 0, this.gridService.width * 32 * this.canvasService.scale, this.gridService.height * 32 * this.canvasService.scale);

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

  // For performance, I may implement this.
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


  public index = 0
  public drawAnimatedAssets(): void {
    if (!this.gridService.gridLoaded) { return }

    if (this.canvasService.foregroundCTX) {

      // Ensure the viewport does not kick back a negative number (cells don't work with negatives)
      const topLeftPosX = -1 * this.canvasService.canvasViewPortOffsetX < 0 ? 1 : -1 * this.canvasService.canvasViewPortOffsetX
      const topLeftPosY = -1 * this.canvasService.canvasViewPortOffsetY < 0 ? 1 : -1 * this.canvasService.canvasViewPortOffsetY

      const topRightPosX =
        -1 * this.canvasService.canvasViewPortOffsetX * this.canvasService.scale + this.canvasService.canvasSize > this.gridService.width * (32 * this.canvasService.scale)
          ? this.gridService.width * (32 * this.canvasService.scale)
          : -1 * this.canvasService.canvasViewPortOffsetX * this.canvasService.scale + this.canvasService.canvasSize

      const bottomPosY = -1 * this.canvasService.canvasViewPortOffsetY * this.canvasService.scale + this.canvasService.canvasSize > this.gridService.height * (32 * this.canvasService.scale)
        ? this.gridService.height * (32 * this.canvasService.scale)
        : -1 * this.canvasService.canvasViewPortOffsetY * this.canvasService.scale + this.canvasService.canvasSize

      const cellTopLeft = this.gridService.getGridCellByCoordinate(topLeftPosX, topLeftPosY)
      const cellTopRight = this.gridService.getGridCellByCoordinate(topRightPosX, topLeftPosY)
      const cellBottomLeft = this.gridService.getGridCellByCoordinate(topLeftPosX, bottomPosY)

      this.canvasService.foregroundCTX.clearRect(0, 0, this.gridService.width * 32 * this.canvasService.scale, this.gridService.height * 32 * this.canvasService.scale);
      this.canvasService.backgroundCTX.clearRect(0, 0, this.gridService.width * 32 * this.canvasService.scale, this.gridService.height * 32 * this.canvasService.scale);
      this.canvasService.blackoutCTX.clearRect(0, 0, this.gridService.width * 32 * this.canvasService.scale, this.gridService.height * 32 * this.canvasService.scale);

      try {
        if (this.canvasService.largeImageBackground) {
          this.drawLargeImageBackground(topLeftPosX, topLeftPosY)
          this.assetService.gameComponents.forEach(gameComponent => {
            this.drawAroundAsset(gameComponent)
          })
        } else {
          if (!this.canvasService.largeImageBackground) {
            for (let y = cellTopLeft.y; y <= cellBottomLeft.y; y++) {
              for (let x = cellTopLeft?.x; x <= cellTopRight?.x; x++) {
                const drawableCell = this.gridService.getCell(x, y)

                if (drawableCell.occupiedBy) {
                  this.drawAsset(drawableCell.occupiedBy)
                }

                this.drawOnCell(drawableCell)
                this.drawOnBackgroundCell(drawableCell)
              }
            }
          }

          this.drawGridLines()
        }
      }
      catch (e) {
        debugger
      }
    }
  }

  // Draws the Background and Foreground as a Single Image. In Game Mode the map is not being drawn a square at a time but as an entire image. 
  public drawLargeImageBackground(canvasTopLeftPosX: number, canvasTopLeftPosY: number): void {
    this.canvasService.backgroundCTX.imageSmoothingEnabled = false
    this.canvasService.backgroundCTX.drawImage(
      this.canvasService.largeImageBackground,
      canvasTopLeftPosX,
      canvasTopLeftPosY,
      this.canvasService.canvasSize,
      this.canvasService.canvasSize,
      canvasTopLeftPosX,
      canvasTopLeftPosY,
      this.canvasService.canvasSize,
      this.canvasService.canvasSize
    )

    this.canvasService.foregroundCTX.imageSmoothingEnabled = false
    this.canvasService.foregroundCTX.drawImage(
      this.canvasService.largeImageForeground,
      canvasTopLeftPosX,
      canvasTopLeftPosY,
      this.canvasService.canvasSize,
      this.canvasService.canvasSize,
      canvasTopLeftPosX,
      canvasTopLeftPosY,
      this.canvasService.canvasSize,
      this.canvasService.canvasSize
    )
  }

  // Draws draws around the asset so asset can stand behind objects in game mode (single image background)
  private drawAroundAsset(asset: MotionAsset): void {
    const x = asset.cell.x
    const y = asset.cell.y

    for (let i = -1; i < 4; i++) {
      for (let l = -1; l < 2; l++) {

        if (i === 0 && l === 1) {
          this.drawAsset(asset)
          continue
        }

        const paintingArea = this.gridService.getCell(x + l, y + i)

        if (paintingArea.imageTile) {
          this.drawOnCell(paintingArea, true)
        }
      }
    }
  }

  // draws asset
  public drawAsset(gameComponent: MotionAsset): void {
    if (gameComponent && gameComponent.assetDirty) {
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
      gameComponent.assetDirty = false
    }
  }

  // Draws Items being placed in Edit mode
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

  // draws the entire grid foreground objects
  public drawObstacles(): void {
    if (this.canvasService.foregroundCTX && this.assetService.obstaclesDirty && !this.canvasService.largeImageBackground) {
      // this.canvasService.foregroundCTX.clearRect(0, 0, this.gridService.width * (36 * this.canvasService.scale), this.gridService.height * (36 * this.canvasService.scale));
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

  // draws each foreground item for the cell provided
  private drawOnCell(cell: Cell, makeTransparent: boolean = false): void {
    if (cell && cell.visible && cell.imageTile) {

      if (makeTransparent) {
        this.canvasService.foregroundCTX.globalAlpha = .5
      }

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
      this.canvasService.foregroundCTX.globalAlpha = 1
    }
  }

  // draws the background item for each cell provided
  public drawOnBackgroundCell(cell: Cell): void {
    if (cell && cell.backgroundTile) {

      // console.log("CCC")
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

  // Helper functions

  // This is used for drawable terrain, it determines which tile goes where when drawing terrain.
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
