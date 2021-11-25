import { Injectable } from "@angular/core";
import { CanvasService } from "../../canvas/canvas.service";
import { EditorService } from "../../editor/editor-palette/editor.service";
import { growableItems } from "../../game-assets/tiles.db.ts/tile-assets.db";
import { Cell } from "../../models/cell.model";
import { GridService } from "../grid.service";
import { Painter } from "./painter";

export class BackgroundPainter extends Painter {
  constructor(
    public canvasService: CanvasService,
    public gridService: GridService,
    public editorService: EditorService,
  ) { super() }

  // Draws Grid Lines  
  public paint(): void {
    if (!this.gridService.activeGrid) { return }
    if (!this.gridService.activeGrid.gridLoaded) { return }

    if (this.editorService.backgroundDirty) {
      for (let h = 0; h < this.gridService.activeGrid.height; h++) {
        for (let w = 0; w < this.gridService.activeGrid.width; w++) {
          const cell = this.gridService.activeGrid.grid[`x${w}:y${h}`]

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

   // draws the background item for each cell provided
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

      if (cell.portalTo) {
        this.canvasService.backgroundCTX.globalAlpha = .5;
        this.canvasService.backgroundCTX.fillStyle = 'blue';
        this.canvasService.backgroundCTX.fillRect(
          cell.posX,
          cell.posY,
          32,
          32
        )
        this.canvasService.backgroundCTX.globalAlpha = 1;

      }
    }
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