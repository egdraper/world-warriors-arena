import { CanvasService } from "../../../canvas/canvas.service";
import { CharacterEditorService } from "../../../editor/character-edtor-palette/character-editor-pallete/character-editor.service";
import { EditorService } from "../../../editor/editor-palette/editor.service";
import { AssetsService } from "../../../game-assets/assets.service";
import { growableItems } from "../../../game-assets/tiles.db.ts/tile-assets.db";
import { MotionAsset } from "../../../models/assets.model";
import { Cell } from "../../../models/cell.model";
import { GameSettings } from "../../../models/game-settings";
import { Engine } from "../../engine";
import { GridService } from "../../grid.service";
import { LayerPainter } from "./painter";

export class AssetPainter extends LayerPainter {
  constructor(
    public canvasService: CanvasService,
    public gridService: GridService,
    public assetService: AssetsService,
    public editorService: EditorService,
    public characterEditorService: CharacterEditorService
  ) { super(canvasService)
  
    Engine.onFire.subscribe(this.paint.bind(this))
  }

  public frame: number = 0
  // Draws Grid Lines  
  public paint(frame: number): void {
    this.frame = frame
    this.drawAnimatedAssets()
  
  }

  public drawAnimatedAssets(): void {
    if (!this.gridService.activeGrid) { return }
    if (!this.gridService.activeGrid.gridLoaded) { return }

    if (this.canvasService.foregroundCTX) {

      // Ensure the viewport does not kick back a negative number (cells don't work with negatives)
      let topLeftPosX = -1 * this.canvasService.canvasViewPortOffsetX
      let topLeftPosY = -1 * this.canvasService.canvasViewPortOffsetY
      let topRightPosX = topLeftPosX + this.canvasService.canvasSizeX + (32 * (1 / GameSettings.scale))
      let bottomPosY = topLeftPosY + this.canvasService.canvasSizeY + (32 * (1 / GameSettings.scale))

      const cellTopLeft = this.gridService.activeGrid.getGridCellByCoordinate(topLeftPosX, topLeftPosY)
      let cellTopRight = this.gridService.activeGrid.getGridCellByCoordinate(topRightPosX, topLeftPosY)
      let cellBottomLeft = this.gridService.activeGrid.getGridCellByCoordinate(topLeftPosX, bottomPosY)

      if (!cellBottomLeft) {
        cellBottomLeft = this.gridService.activeGrid.grid[`x0:y${this.gridService.activeGrid.height - 1}`]
      }
      if (!cellTopRight) {
        cellTopRight = this.gridService.activeGrid.grid[`x${this.gridService.activeGrid.width - 1}:y0`]
      }
      if (!cellTopLeft) {
        cellTopRight = this.gridService.activeGrid.grid[`x0:y0`]
      }

      
      try {
        if (this.gridService.activeGrid.largeImage.background) {
          if((this.frame - 1) % 2 === 0 ) {
            // this.canvasService.backgroundCTX.clearRect(0, 0, this.gridService.activeGrid.width * 32, this.gridService.activeGrid.height * 32);
            this.drawLargeImageBackground(topLeftPosX, topLeftPosY)
          }
          
          if(this.frame % 2 === 0) {
            this.canvasService.foregroundCTX.clearRect(0, 0, this.gridService.activeGrid.width * 32, this.gridService.activeGrid.height * 32);
            this.assetService.gameComponents.forEach(gameComponent => {
              this.drawAroundAsset(gameComponent)
            })
          }
          
        } else {
          this.canvasService.foregroundCTX.clearRect(0, 0, this.gridService.activeGrid.width * 32, this.gridService.activeGrid.height * 32);
          this.canvasService.backgroundCTX.clearRect(0, 0, this.gridService.activeGrid.width * 32, this.gridService.activeGrid.height * 32);
          for (let y = cellTopLeft.y; y <= cellBottomLeft.y; y++) {
            for (let x = cellTopLeft?.x; x <= cellTopRight?.x; x++) {
              const drawableCell = this.gridService.activeGrid.getCell(x, y)

              this.drawAsset(this.assetService.gameComponents.find(gameComponent => gameComponent.cell.id === drawableCell.id && this.gridService.activeGrid.id === gameComponent.gridId))

              this.drawOnCell(drawableCell)
              this.drawOnBackgroundCell(drawableCell)
              // console.log("CCC")

            }
          }

          if (this.canvasService.portalEntry) {
            this.canvasService.backgroundCTX.globalAlpha = .5;
            this.canvasService.portalEntry.forEach(cell => {
              this.canvasService.backgroundCTX.fillStyle = 'blue';
              this.canvasService.backgroundCTX.fillRect(
                cell.posX,
                cell.posY,
                32,
                32
              )
            })
            this.canvasService.backgroundCTX.globalAlpha = 1;


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
    this.canvasService.backgroundCTX.imageSmoothingEnabled = false
    this.canvasService.backgroundCTX.drawImage(
      this.gridService.activeGrid.largeImage.background,
      canvasTopLeftPosX,
      canvasTopLeftPosY,
      this.canvasService.canvasSizeX * (1 / GameSettings.scale),
      this.canvasService.canvasSizeY * (1 / GameSettings.scale),
      canvasTopLeftPosX,
      canvasTopLeftPosY,
      this.canvasService.canvasSizeX * (1 / GameSettings.scale),
      this.canvasService.canvasSizeY * (1 / GameSettings.scale)
    )
  }

  // Draws draws around the asset so asset can stand behind objects in game mode (single image background)
  private drawAroundAsset(asset: MotionAsset): void {
    if (asset.gridId !== this.gridService.activeGrid.id) { return }

    const x = asset.cell.x
    const y = asset.cell.y

    for (let i = -1; i < 4; i++) {
      for (let l = -1; l < 2; l++) {

        if (i === 0 && l === 1) {
          this.drawAsset(asset)
          continue
        }

        const paintingArea = this.gridService.activeGrid.getCell(x + l, y + i)

        if (paintingArea.imageTile) {
          this.drawOnCell(paintingArea, true)
        }
      }
    }
  }

 
  // Draws Items being placed in Edit mode
  public drawEditableObject(): void {
    if (!this.editorService.selectedAsset || !this.gridService.hoveringCell) { return }
    this.canvasService.foregroundCTX.drawImage(
      this.editorService.selectedAsset.spriteSheet,
      this.editorService.selectedAsset.spriteGridPosX * this.editorService.selectedAsset.multiplier,
      this.editorService.selectedAsset.spriteGridPosY * this.editorService.selectedAsset.multiplier,
      this.editorService.selectedAsset.tileWidth * this.editorService.selectedAsset.multiplier,
      this.editorService.selectedAsset.tileHeight * this.editorService.selectedAsset.multiplier,
      this.gridService.hoveringCell.posX + this.editorService.selectedAsset.tileOffsetX,
      this.gridService.hoveringCell.posY + this.editorService.selectedAsset.tileOffsetY,
      this.editorService.selectedAsset.tileWidth * (this.editorService.selectedAsset.sizeAdjustment || this.editorService.selectedAsset.multiplier),
      this.editorService.selectedAsset.tileHeight * (this.editorService.selectedAsset.sizeAdjustment || this.editorService.selectedAsset.multiplier)
    )

  }
  public drawEditableCharacter(): void {
    if (!this.characterEditorService.selectedCharacter || !this.gridService.hoveringCell) { return }
    // console.log(this.gridService.hoveringCell.x, this.gridService.hoveringCell.y)
    this.canvasService.foregroundCTX.drawImage(
      this.characterEditorService.selectedCharacter.image,
      this.characterEditorService.selectedCharacter.frameXPosition[1],
      this.characterEditorService.selectedCharacter.frameYPosition,
      25,
      36,
      this.gridService.hoveringCell.posX - 8,
      this.gridService.hoveringCell.posY - 58,
      50,
      80
    )
  }

  // draws the entire grid foreground objects
  public drawObstacles(): void {
    if (this.canvasService.foregroundCTX && this.assetService.obstaclesDirty && !this.gridService.activeGrid.largeImage.background) {
      // this.canvasService.foregroundCTX.clearRect(0, 0, this.gridService.width * (36 * GameSettings.scale), this.gridService.height * (36 * GameSettings.scale));
      this.gridService.activeGrid.gridDisplay.forEach(row => {
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
 
  // draws asset
  public drawAsset(gameComponent: MotionAsset): void {
    this.canvasService.foregroundCTX.imageSmoothingEnabled = false
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

}
