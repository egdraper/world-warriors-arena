import { GSM } from "../app.service.manager";
import { growableItems } from "../game-assets/tile-assets.db";
import { MotionAsset } from "../models/assets.model";
import { Cell, SpriteTile } from "../models/cell.model";
import { GameSettings } from "../models/game-settings";
import { Engine } from "../services/engine.service";
import { LayerPainter } from "./painter";

export class AssetPainter extends LayerPainter {
  constructor() {   
    super()
    Engine.onFire.subscribe(this.paint.bind(this))
  }

  public frame: number = 0
  // Draws Grid Lines  
  public paint(frame: number): void {
    this.frame = frame
    this.drawAnimatedAssets()
  
  }

  public drawAnimatedAssets(): void {
    if (!GSM.Map.activeGrid) { return }
    if (!GSM.Map.activeGrid.gridLoaded) { return }

    if (GSM.Canvas.foregroundCTX) {

      // Ensure the viewport does not kick back a negative number (cells don't work with negatives)
      let topLeftPosX = -1 * GSM.Canvas.canvasViewPortOffsetX
      let topLeftPosY = -1 * GSM.Canvas.canvasViewPortOffsetY
      let topRightPosX = topLeftPosX + GSM.Canvas.canvasSizeX + (32 * (1 / GameSettings.scale))
      let bottomPosY = topLeftPosY + GSM.Canvas.canvasSizeY + (32 * (1 / GameSettings.scale))

      const cellTopLeft = GSM.Map.activeGrid.getGridCellByCoordinate(topLeftPosX, topLeftPosY)
      let cellTopRight = GSM.Map.activeGrid.getGridCellByCoordinate(topRightPosX, topLeftPosY)
      let cellBottomLeft = GSM.Map.activeGrid.getGridCellByCoordinate(topLeftPosX, bottomPosY)

      if (!cellBottomLeft) {
        cellBottomLeft = GSM.Map.activeGrid.grid[`x0:y${GSM.Map.activeGrid.height - 1}`]
      }
      if (!cellTopRight) {
        cellTopRight = GSM.Map.activeGrid.grid[`x${GSM.Map.activeGrid.width - 1}:y0`]
      }
      if (!cellTopLeft) {
        cellTopRight = GSM.Map.activeGrid.grid[`x0:y0`]
      }

      
      try {
        if (GSM.Map.activeGrid.largeImage.background) {
          if((this.frame - 1) % 2 === 0 ) {
            // GSM.Canvas.backgroundCTX.clearRect(0, 0, GSM.Map.activeGrid.width * 32, GSM.Map.activeGrid.height * 32);
            this.drawLargeImageBackground(topLeftPosX, topLeftPosY)
          }
          
          if(this.frame % 2 === 0) {
            GSM.Canvas.foregroundCTX.clearRect(0, 0, GSM.Map.activeGrid.width * 32, GSM.Map.activeGrid.height * 32);
            GSM.Assets.gameComponents.forEach(gameComponent => {
              this.drawAroundAsset(gameComponent)
            })
          }
          
        } else {
          GSM.Canvas.foregroundCTX.clearRect(0, 0, GSM.Map.activeGrid.width * 32, GSM.Map.activeGrid.height * 32);
          GSM.Canvas.backgroundCTX.clearRect(0, 0, GSM.Map.activeGrid.width * 32, GSM.Map.activeGrid.height * 32);
          for (let y = cellTopLeft.y; y <= cellBottomLeft.y; y++) {
            for (let x = cellTopLeft?.x; x <= cellTopRight?.x; x++) {
              const drawableCell = GSM.Map.activeGrid.getCell(x, y)

              if (drawableCell.growableTileId && !drawableCell.growableTileOverride) {
                this.calculateGrowableTerrain(drawableCell)
              }
    
              this.drawAsset(GSM.Assets.gameComponents.find(gameComponent => gameComponent.cell.id === drawableCell.id && GSM.Map.activeGrid.id === gameComponent.gridId))

              this.drawOnCell(drawableCell)
              this.drawOnBackgroundCell(drawableCell)
              // console.log("CCC")

            }
          }

          if (GSM.Canvas.portalEntry) {
            GSM.Canvas.backgroundCTX.globalAlpha = .5;
            GSM.Canvas.portalEntry.forEach(cell => {
              GSM.Canvas.backgroundCTX.fillStyle = 'blue';
              GSM.Canvas.backgroundCTX.fillRect(
                cell.posX,
                cell.posY,
                32,
                32
              )
            })
            GSM.Canvas.backgroundCTX.globalAlpha = 1;


          }
        }
      }
      catch (e) {
        debugger
      }
      // this.drawGridLines()
    }
  }

  // Draws the Background and Foreground as a Single Image. In Game Mode the map is not being drawn a square at a time but as an entire image. 
  public drawLargeImageBackground(canvasTopLeftPosX: number, canvasTopLeftPosY: number): void {
    GSM.Canvas.backgroundCTX.imageSmoothingEnabled = false
    GSM.Canvas.backgroundCTX.drawImage(
      GSM.Map.activeGrid.largeImage.background,
      canvasTopLeftPosX,
      canvasTopLeftPosY,
      GSM.Canvas.canvasSizeX * (1 / GameSettings.scale),
      GSM.Canvas.canvasSizeY * (1 / GameSettings.scale),
      canvasTopLeftPosX,
      canvasTopLeftPosY,
      GSM.Canvas.canvasSizeX * (1 / GameSettings.scale),
      GSM.Canvas.canvasSizeY * (1 / GameSettings.scale)
    )
  }

  // Draws draws around the asset so asset can stand behind objects in game mode (single image background)
  private drawAroundAsset(asset: MotionAsset): void {
    if (asset.gridId !== GSM.Map.activeGrid.id) { return }

    const x = asset.cell.x
    const y = asset.cell.y

    for (let i = -1; i < 4; i++) {
      for (let l = -1; l < 2; l++) {

        if (i === 0 && l === 1) {
          this.drawAsset(asset)
          continue
        }

        const paintingArea = GSM.Map.activeGrid.getCell(x + l, y + i)

        if (paintingArea.imageTile) {
          this.drawOnCell(paintingArea, true)
        }
      }
    }
  }

 
  // Draws Items being placed in Edit mode
  public drawEditableObject(): void {
    if (!GSM.Editor.selectedAsset || !GSM.Map.hoveringCell) { return }
    GSM.Canvas.foregroundCTX.drawImage(
      GSM.Editor.selectedAsset.spriteSheet,
      GSM.Editor.selectedAsset.spriteGridPosX * GSM.Editor.selectedAsset.multiplier,
      GSM.Editor.selectedAsset.spriteGridPosY * GSM.Editor.selectedAsset.multiplier,
      GSM.Editor.selectedAsset.tileWidth * GSM.Editor.selectedAsset.multiplier,
      GSM.Editor.selectedAsset.tileHeight * GSM.Editor.selectedAsset.multiplier,
      GSM.Map.hoveringCell.posX + GSM.Editor.selectedAsset.tileOffsetX,
      GSM.Map.hoveringCell.posY + GSM.Editor.selectedAsset.tileOffsetY,
      GSM.Editor.selectedAsset.tileWidth * (GSM.Editor.selectedAsset.sizeAdjustment || GSM.Editor.selectedAsset.multiplier),
      GSM.Editor.selectedAsset.tileHeight * (GSM.Editor.selectedAsset.sizeAdjustment || GSM.Editor.selectedAsset.multiplier)
    )

  }
  public drawEditableCharacter(): void {
    if (!GSM.CharacterEditor.selectedCharacter || !GSM.Map.hoveringCell) { return }
    // console.log(GSM.Map.hoveringCell.x, GSM.Map.hoveringCell.y)
    GSM.Canvas.foregroundCTX.drawImage(
      GSM.CharacterEditor.selectedCharacter.image,
      GSM.CharacterEditor.selectedCharacter.frameXPosition[1],
      GSM.CharacterEditor.selectedCharacter.frameYPosition,
      25,
      36,
      GSM.Map.hoveringCell.posX - 8,
      GSM.Map.hoveringCell.posY - 58,
      50,
      80
    )
  }

  // draws each foreground item for the cell provided
  private drawOnCell(cell: Cell, makeTransparent: boolean = false): void {
    if (cell && cell.imageTile) {

      if (makeTransparent) {
        GSM.Canvas.foregroundCTX.globalAlpha = .5
      }

      GSM.Canvas.foregroundCTX.drawImage(
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
      GSM.Canvas.foregroundCTX.globalAlpha = 1
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

    let tile = drawableItem.spritesTiles.find((spriteTile: SpriteTile) => {
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
      tile = drawableItem.spritesTiles.find((cliff: SpriteTile) => cliff.default)
    }

    selectedCell.imageTile = tile
  }
 
  // draws asset
  public drawAsset(gameComponent: MotionAsset): void {
    GSM.Canvas.foregroundCTX.imageSmoothingEnabled = false
    if (gameComponent) {
      GSM.Canvas.foregroundCTX.drawImage(
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
        GSM.Canvas.overlayCTX.clearRect(gameComponent.positionX, gameComponent.positionY, 32, 32);
        GSM.Canvas.overlayCTX.drawImage(
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
  }

}
