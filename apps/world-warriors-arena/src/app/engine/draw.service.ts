import { createElementCssSelector } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { CanvasService } from "../canvas/canvas.service";
import { EditorService } from "../editor/editor-pallete/editor.service";
import { ShortLivedAnimation } from "../game-assets/click-animation";
import { cliffs } from "../game-assets/tiles.db.ts/cliffs.db";
import { greenGrass } from "../game-assets/tiles.db.ts/greenGrass.db";
import { trees } from "../game-assets/tiles.db.ts/trees.db";
import { GridService } from "../grid/grid.service";
import { Cell, GrowablePanelPosition, SpriteTile } from "../models/cell.model";
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
      this.drawGrid()
    }, 1000)

  }

  public drawGrid(): void {
    for (let h = 0; h < this.gridService.height; h++) {
      for (let w = 0; w < this.gridService.width; w++) {

        let weight = 0
        this.editorService.findBackgroundCollection("greenGrass").forEach(tile => {
          tile.lowWeight = weight
          weight += tile.rarity
          tile.highWeight = weight
        })
        const rand = Math.floor(Math.random() * weight);
        let spriteSheet = this.editorService.findBackgroundCollection("greenGrass")[0].spriteSheet
        let xPos = 0
        let yPos = 0

        this.editorService.findBackgroundCollection("greenGrass").forEach(tile => {
          if (rand < tile.highWeight && rand >= tile.lowWeight) {
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

    // OBSTACLES
    // const sides = [1, 3]
    // const location: ("rightEndTileName" | 'leftEndTileName')[] = ["rightEndTileName", "leftEndTileName"]

    // if (!cell.imageTile) { return }


    // sides.forEach((side, index) => {
    //   if (cell.visible && cell.imageTile) {
    //     if (cell.neighbors[side]) {
    //       const obstacle = cell.neighbors[side].obstacle
    //       const visible = cell.neighbors[side].visible
    //       const affectedSide = location[index]

    //       if (!obstacle && !visible && cell.imageTile[affectedSide]) {
    //         const spriteTile = this.editorService.findObjectAsset("cliffs", cell.imageTile.id)
    //         cell.imageTile = this.editorService.findObjectAsset("cliffs", spriteTile[affectedSide])
    //         // console.log(cell.imageTile.id)
    //       }

    //       const rightNeighbor = cell.neighbors[1]
    //       const leftNeighbor = cell.neighbors[3]
    //       const rightNeighborImage = rightNeighbor ? rightNeighbor.imageTile : null
    //       const leftNeighborImage = leftNeighbor ? leftNeighbor.imageTile : null

    //       if (rightNeighbor && leftNeighbor && rightNeighborImage && leftNeighborImage && cell.imageTile.centerTileName) {
    //         console.log(cell.imageTile.centerTileName)
    //         const spriteTile = this.editorService.findObjectAsset("cliffs", cell.imageTile.id)
    //         cell.imageTile = this.editorService.findObjectAsset("cliffs", spriteTile.centerTileName)
    //         // console.log(cell.imageTile.id)
    //       }
    //     }
    //   }
    // })

    if (cell.growableTile) {
      this.drawGrowableTerrain(cell)
    }

    // if (cell.imageTile.topEndTileName && (
    //   (cell.neighbors[2] && cell.neighbors[2].imageTile !== cell.imageTile &&
    //     cell.neighbors[0] && cell.neighbors[0].imageTile !== cell.imageTile) ||
    //   (cell.neighbors[2] && cell.neighbors[2].imageTile === cell.imageTile &&
    //     cell.neighbors[0] && cell.neighbors[0].imageTile !== cell.imageTile))
    // ) {
    //   const tile  = this.editorService.findObjectAsset("cliffs", cell.imageTile.id)
    //   const spriteTile = this.editorService.findObjectAsset("cliffs", tile.topEndTileName.name)

    //   this.canvasService.foregroundCTX.drawImage(
    //     spriteTile.spriteSheet,
    //     spriteTile.spriteGridPosX * spriteTile.multiplier,
    //     spriteTile.spriteGridPosY * spriteTile.multiplier,
    //     spriteTile.tileWidth * spriteTile.multiplier,
    //     spriteTile.tileHeight * spriteTile.multiplier,
    //     cell.posX,
    //     cell.posY + cell.imageTile.topEndTileName.offset,
    //     spriteTile.tileWidth * spriteTile.multiplier,
    //     spriteTile.tileHeight * spriteTile.multiplier
    //   )

    // }

    if (cell.visible && cell.imageTile) {
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
    }


    // if (cell.imageTile.attachments) {
    //   cell.imageTile.attachments.forEach(attachment => {
    //     const spriteTile = this.editorService.findObjectAsset("cliffs", attachment.tileName)
    //     this.canvasService.foregroundCTX.drawImage(
    //       spriteTile.spriteSheet,
    //       spriteTile.spriteGridPosX * spriteTile.multiplier,
    //       spriteTile.spriteGridPosY * spriteTile.multiplier,
    //       spriteTile.tileWidth * spriteTile.multiplier,
    //       spriteTile.tileHeight * spriteTile.multiplier,
    //       cell.posX + attachment.xOffset,
    //       cell.posY + attachment.yOffset,
    //       spriteTile.tileWidth * spriteTile.multiplier,
    //       spriteTile.tileHeight * spriteTile.multiplier
    //     )
    //   })
    // }

  }

  private drawGrowableTerrain(selectedCell: Cell): void {
    const theCliffs = trees
    const topNeighbor = selectedCell.neighbors[0]
    const topRightNeighbor = selectedCell.neighbors[4]
    const rightNeighbor = selectedCell.neighbors[1]
    const bottomRightNeighbor = selectedCell.neighbors[5]
    const bottomNeighbor = selectedCell.neighbors[2]
    const bottomLeftNeighbor = selectedCell.neighbors[6]
    const leftNeighbor = selectedCell.neighbors[3]
    const topLeftNeighbor = selectedCell.neighbors[7]

    const neighbors = {
      topLeftMatch: topLeftNeighbor.growableTile === selectedCell.growableTile,
      topCenterMatch: topNeighbor.growableTile === selectedCell.growableTile,
      topRightMatch: topRightNeighbor.growableTile === selectedCell.growableTile,
      centerLeftMatch: leftNeighbor.growableTile === selectedCell.growableTile,
      centerRightMatch: rightNeighbor.growableTile === selectedCell.growableTile,
      bottomLeftMatch: bottomLeftNeighbor.growableTile === selectedCell.growableTile,
      bottomCenterMatch: bottomNeighbor.growableTile === selectedCell.growableTile,
      bottomRightMatch: bottomRightNeighbor.growableTile === selectedCell.growableTile
    }

    let cliff = theCliffs.find(a => {
      const topMatch = neighbors.topCenterMatch === a.drawWhen.topNeighbor || a.drawWhen.topNeighbor === null
      const topRightMatch = neighbors.topRightMatch === a.drawWhen.topRightNeighbor || a.drawWhen.topRightNeighbor === null
      const rightMatch = neighbors.centerRightMatch === a.drawWhen.rightNeighbor || a.drawWhen.rightNeighbor === null
      const bottomRightMatch = neighbors.bottomRightMatch === a.drawWhen.bottomRightNeighbor || a.drawWhen.bottomRightNeighbor === null
      const bottomMatch = neighbors.bottomCenterMatch === a.drawWhen.bottomNeighbor || a.drawWhen.bottomNeighbor === null
      const bottomLeftNeighborMatch = neighbors.bottomLeftMatch === a.drawWhen.bottomLeftNeighbor || a.drawWhen.bottomLeftNeighbor === null
      const leftNeighborMatch = neighbors.centerLeftMatch === a.drawWhen.leftNeighbor || a.drawWhen.leftNeighbor === null
      const topLeftNeighborMatch = neighbors.topLeftMatch === a.drawWhen.topLeftNeighbor || a.drawWhen.topLeftNeighbor === null

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

    if (!cliff) {
      cliff = theCliffs.find(cliff => cliff.default)
    }

    selectedCell.imageTile = cliff
    selectedCell.visible = true
    selectedCell.obstacle = true
  }


  //   if (
  //     // Center
  //     topLeftNeighbor.growableTile === selectedCell.growableTile &&
  //     topNeighbor.growableTile === selectedCell.growableTile &&
  //     topRightNeighbor.growableTile === selectedCell.growableTile &&
  //     rightNeighbor.growableTile === selectedCell.growableTile &&
  //     bottomRightNeighbor.growableTile === selectedCell.growableTile &&
  //     bottomNeighbor.growableTile === selectedCell.growableTile &&
  //     bottomLeftNeighbor.growableTile === selectedCell.growableTile &&
  //     leftNeighbor.growableTile === selectedCell.growableTile
  //   ) {
  //     selectedCell.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.growableCenterPanel)
  //   } 


  //   else if (
  //     // TopLeft
  //     topLeftNeighbor.growableTile !== selectedCell.growableTile &&
  //     topNeighbor.growableTile !== selectedCell.growableTile &&
  //     topRightNeighbor.growableTile !== selectedCell.growableTile &&
  //     rightNeighbor.growableTile === selectedCell.growableTile &&
  //     bottomNeighbor.growableTile === selectedCell.growableTile &&
  //     leftNeighbor.growableTile !== selectedCell.growableTile
  //   ) {
  //     selectedCell.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.topLeftPanel)
  //   } else if (
  //     // top Center
  //     topLeftNeighbor.growableTile !== selectedCell.growableTile &&
  //     topNeighbor.growableTile !== selectedCell.growableTile &&
  //     topRightNeighbor.growableTile !== selectedCell.growableTile &&
  //     rightNeighbor.growableTile === selectedCell.growableTile &&
  //     bottomNeighbor.growableTile === selectedCell.growableTile &&
  //     leftNeighbor.growableTile === selectedCell.growableTile
  //   ) {
  //     selectedCell.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.topCenterPanel)
  //   } else if (
  //     // Top Right
  //     topNeighbor.growableTile !== selectedCell.growableTile &&
  //     topRightNeighbor.growableTile !== selectedCell.growableTile &&
  //     rightNeighbor.growableTile !== selectedCell.growableTile &&
  //     bottomNeighbor.growableTile === selectedCell.growableTile &&
  //     leftNeighbor.growableTile === selectedCell.growableTile
  //   ) {
  //     selectedCell.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.topRightPanel)
  //   } 

  //   else if (
  //     // Left Center
  //     topNeighbor.growableTile === selectedCell.growableTile &&
  //     rightNeighbor.growableTile === selectedCell.growableTile &&
  //     bottomNeighbor.growableTile === selectedCell.growableTile &&
  //     leftNeighbor.growableTile !== selectedCell.growableTile
  //   ) {
  //     selectedCell.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.growableLeftPanel)
  //   } else

  //   if (
  //     // right Center
  //     topNeighbor.growableTile === selectedCell.growableTile &&
  //     rightNeighbor.growableTile !== selectedCell.growableTile &&
  //     bottomNeighbor.growableTile === selectedCell.growableTile &&
  //     leftNeighbor.growableTile === selectedCell.growableTile
  //   ) {
  //     selectedCell.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.growableRightPanel)
  //   }  

  //   else if (
  //     // BottomUpperLeftAngle
  //     bottomRightNeighbor.growableTile === selectedCell.growableTile &&
  //     rightNeighbor.growableTile === selectedCell.growableTile &&
  //     bottomNeighbor.growableTile !== selectedCell.growableTile
  //   ) {
  //     selectedCell.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.bottomLeftPanelAngle)

  //     for(let i = 0; i < selectedCell.imageTile.tileHeight -1; i++) {
  //       const cell = this.gridService.grid[`x${selectedCell.x}:y${selectedCell.y - i}`]
  //       cell.growableTile = selectedCell.growableTile
  //       cell.visible = true
  //     }


  //       topNeighbor.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.bottomRightPanelFillerAngle)
  //       topNeighbor.visible = true


  //   }
  //   else if (
  //     // BottomLeft
  //     rightNeighbor.growableTile === selectedCell.growableTile &&
  //     bottomNeighbor.growableTile !== selectedCell.growableTile &&
  //     leftNeighbor.growableTile !== selectedCell.growableTile
  //   ) {
  //     selectedCell.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.bottomLeftPanel)

  //     for(let i = 0; i < selectedCell.imageTile.tileHeight -1; i++) {
  //       const cell = this.gridService.grid[`x${selectedCell.x}:y${selectedCell.y - i}`]
  //       cell.growableTile = selectedCell.growableTile
  //       cell.visible = true
  //     }

  //     if(topNeighbor.growableTile !== selectedCell.growableTile && !topNeighbor.obstacle) {
  //       topNeighbor.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.topLeftPanel)
  //       topNeighbor.visible = true
  //     }
  //   }    

  //    else if (
  //     // BottomUpperRightAngle
  //     topRightNeighbor.growableTile === selectedCell.growableTile &&
  //     rightNeighbor.growableTile !== selectedCell.growableTile &&
  //     leftNeighbor.growableTile === selectedCell.growableTile
  //   ) {
  //     selectedCell.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.bottomRightPanelAngle)

  //     for(let i = 0; i < selectedCell.imageTile.tileHeight -1; i++) {
  //       const cell = this.gridService.grid[`x${selectedCell.x}:y${selectedCell.y - i}`]
  //       cell.growableTile = selectedCell.growableTile
  //       cell.visible = true
  //     }


  //       topNeighbor.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.bottomLeftPanelFillerAngle)
  //       topNeighbor.visible = true


  //   }


  //   else if (
  //     // BottomRight
  //     rightNeighbor.growableTile !== selectedCell.growableTile &&
  //     bottomNeighbor.growableTile !== selectedCell.growableTile &&
  //     leftNeighbor.growableTile === selectedCell.growableTile
  //   ) {
  //     selectedCell.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.bottomRightPanel)

  //     for(let i = 0; i < selectedCell.imageTile.tileHeight -1; i++) {
  //       const cell = this.gridService.grid[`x${selectedCell.x}:y${selectedCell.y - i}`]
  //       cell.growableTile = selectedCell.growableTile
  //       cell.visible = true
  //     }

  //     if(topNeighbor.growableTile !== selectedCell.growableTile && !topNeighbor.obstacle) {
  //       topNeighbor.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.topRightPanel)
  //       topNeighbor.visible = true
  //     }
  //   } else


  //   if (
  //     // BottomCenter
  //     rightNeighbor.growableTile === selectedCell.growableTile &&
  //     bottomNeighbor.growableTile !== selectedCell.growableTile &&
  //     leftNeighbor.growableTile === selectedCell.growableTile
  //   ) {
  //     selectedCell.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.bottomCenterPanel)

  //     for(let i = 0; i < selectedCell.imageTile.tileHeight -1; i++) {
  //       const cell = this.gridService.grid[`x${selectedCell.x}:y${selectedCell.y - i}`]
  //       cell.growableTile = selectedCell.growableTile
  //       cell.visible = true
  //     }

  //     if(topNeighbor.growableTile !== selectedCell.growableTile && !topNeighbor.obstacle) {
  //       topNeighbor.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.topCenterPanel)
  //       topNeighbor.visible = true
  //     }
  //   }
  //   else if (
  //     rightNeighbor.growableTile !== selectedCell.growableTile &&
  //     leftNeighbor.growableTile !== selectedCell.growableTile && 
  //     bottomLeftNeighbor.growableTile !== selectedCell.growableTile &&
  //     bottomNeighbor.growableTile !== selectedCell.growableTile 
  //   ) {

  //     selectedCell.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.topCenterPanel)
  //     selectedCell.visible = true

  //     rightNeighbor.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.bottomRightPanel)
  //     rightNeighbor.visible = true
  //     rightNeighbor.obstacle = true
  //     rightNeighbor.growableTile = selectedCell.growableTile

  //     topNeighbor.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.topRightPanel)
  //     topNeighbor.visible = true
  //     topNeighbor.obstacle = true
  //     topNeighbor.growableTile = selectedCell.growableTile

  //     topRightNeighbor.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.topLeftPanel)
  //     topRightNeighbor.visible = true
  //     topRightNeighbor.obstacle = true
  //     topRightNeighbor.growableTile = selectedCell.growableTile

  //   }
  //   else if (
  //     rightNeighbor.growableTile !== selectedCell.growableTile &&
  //     leftNeighbor.growableTile !== selectedCell.growableTile && 
  //     bottomLeftNeighbor.growableTile !== selectedCell.growableTile &&
  //     bottomNeighbor.growableTile === selectedCell.growableTile 
  //   ) {

  //     selectedCell.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.topCenterPanel)
  //     selectedCell.visible = true

  //     rightNeighbor.imageTile = theCliffs.find(panel => panel.position === GrowablePanelPosition.bottomRightPanel)
  //     rightNeighbor.visible = true
  //     rightNeighbor.obstacle = true
  //     rightNeighbor.growableTile = selectedCell.growableTile

  //   }


  // }

  // public center(neighbor: any): boolean {
  //   return neighbor.topLeftMatch 
  //     && neighbor.topCenterMatch 
  //     && neighbor.topRightMatch 
  //     && neighbor.centerLeftMatch 
  //     && neighbor.centerRightMatch 
  //     && neighbor.bottomLeftMatch
  //     && neighbor.bottomCenterMatch
  //     && neighbor.bottomRightMatch 
  // }

  // public topLeft(neighbor: any): boolean {
  //   return !neighbor.topLeftMatch
  //     && neighbor.topCenterMatch
  //     && neighbor.topRightMatch
  //     && neighbor.centerLeftMatch
  //     && neighbor.centerRightMatch
  //     && neighbor.bottomLeftMatch
  //     && neighbor.bottomCenterMatch
  //     && neighbor.bottomRightMatch; 
  // }

  // public topLeft(): boolean {

  // }

}
