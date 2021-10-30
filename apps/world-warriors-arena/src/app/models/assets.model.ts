import { v4 as uuidv4 } from 'uuid';
import { CanvasService } from '../canvas/canvas.service';
import { DrawService } from '../game-engine/draw-tools/draw.service';
import { Engine } from '../game-engine/engine';
import { ShortestPath } from '../game-engine/shortest-path';
import { ClickAnimation } from '../game-assets/click-animation';
import { SelectionIndicator } from '../game-assets/selection-indicator';
import { GridService } from '../game-engine/grid.service';
import { Cell } from './cell.model';

export class GameComponent {
  public id: string
  public cell: Cell = null  

  constructor() {
    this.id = uuidv4()
  }
}

export class AnimationComponent extends GameComponent {
  public animationFrame: number[] | number = 10
  public moving: boolean
  public assetDirty: boolean
  public update(): void {}
  public move(): void {}  
}

export class Asset extends AnimationComponent {
  public image = new Image()
  public positionX = 0
  public positionY = 0
  public frameCounter = 0
  
  public setDirection(keyEvent: KeyboardEvent): void { return }
  
  public update() {
    if (this.frameCounter < 3) {
      this.frameCounter++
    } else {
      this.frameCounter = 0
    }
  }
}

export abstract class MotionAsset extends Asset {
  public frameXPosition = [0, 26, 52, 26]
  public frameYPosition = 0
  public moving = false
  public currentPath: Cell[] = []
  public selectionIndicator: SelectionIndicator
  public destinationIndicator: ClickAnimation
  public assetDirty = false
  
  private redirection: { start: Cell, end: Cell, charactersOnGrid: MotionAsset[] }
  private nextCell: Cell
  
  public set spriteDirection(value: string) {
    if (value === "down") { this.frameYPosition = 0 }
    if (value === "up") { this.frameYPosition = 108 }
    if (value === "left") { this.frameYPosition = 36 }
    if (value === "right") { this.frameYPosition = 72 }
  }

  constructor(
    public grid: GridService,
    public shortestPath: ShortestPath,
    public engineService: Engine,
    public drawService: DrawService,
    public canvasService: CanvasService) {
      super()
  }

  public addSelectionIndicator(): void {
    this.selectionIndicator = new SelectionIndicator(6, this.engineService, `../../../assets/images/ExplosionClick1.png`)
  }

  public setDirection(keyEvent: KeyboardEvent): void {
    if (keyEvent.code === 'KeyW') {
      this.spriteDirection = "up"
    }

    if (keyEvent.code === 'KeyA') {
      this.spriteDirection = "left"
    }

    if (keyEvent.code === 'KeyD') {
      this.spriteDirection = "right"
    }

    if (keyEvent.code === 'KeyS') {
      this.spriteDirection = "down"
    }
  }

  public startMovement(startCell: Cell, endCell: Cell, charactersOnGrid: MotionAsset[]): void {
    this.destinationIndicator = new ClickAnimation(350, this.engineService, `../../../assets/images/DestinationX.png`, endCell)

    if(this.moving) {
      this.redirection = {start: undefined, end: endCell, charactersOnGrid: charactersOnGrid } 
      return
    } else {
      this.redirection = undefined
    }

    this.currentPath = this.shortestPath.find(startCell, endCell, charactersOnGrid)
    this.moving = true
    const currentCell = this.currentPath.pop() // removes cell the character is standing on
    currentCell.occupiedBy = undefined
    this.nextCell = this.currentPath.pop()
    this.nextCell.occupiedBy = this
    this.setSpriteDirection()
    this.animationFrame = 8
  }

  public endMovement(): void {
    this.currentPath = null
    this.moving = false
    this.animationFrame = 16
    this.destinationIndicator.forceStop()
    this.destinationIndicator=undefined
  }



  public move() {
    // called automatically every 1/60 of a second from the engine
    let nextXMove = 0
    let nextYMove = 0
    let speed = 2

    if (this.nextCell.x !== this.cell.x) { nextXMove = this.nextCell.x > this.cell.x ? speed : speed * -1 }
    if (this.nextCell.y !== this.cell.y) { nextYMove = this.nextCell.y > this.cell.y ? speed : speed * -1 }

    this.positionX += nextXMove
    this.positionY += nextYMove

    this.canvasService.adustViewPort(-1 * nextXMove, -1 * nextYMove, false, this)

    if (this.positionY % (32) === 0 && this.positionX % (32) === 0) {
      this.cell = this.grid.grid[`x${this.positionX / (32)}:y${this.positionY / (32)}`]

      this.nextCell = this.currentPath.length > 0
        ? this.currentPath.pop()
        : null

        
        if(this.redirection) {
          this.cell.occupiedBy = undefined
          this.endMovement()
          this.startMovement(this.cell, this.redirection.end, this.redirection.charactersOnGrid)
        }

        // TODO: Re-calculate path if something has moved into it
        
        if (!this.nextCell) {  
          this.drawService.clearFogLineOfSight(this.cell)  
          this.endMovement()
        } else {     
        
        // this.grid.obstacles.forEach(cellId => {
        //   if(this.grid.grid[cellId].obstacle) { this.drawService.clearFogLineOfSight(this.nextCell, this.grid.grid[cellId]) }
        // })
        this.drawService.clearFogLineOfSight(this.nextCell) 
        // this.drawService.drawOnlyVisibleObstacle(this.nextCell.id)
        this.cell.occupiedBy = undefined
        this.nextCell.occupiedBy = this
        this.setSpriteDirection()
      }
    }
  }

  private setSpriteDirection(): void {
    if (this.nextCell.x !== this.cell.x) {
      this.spriteDirection = this.nextCell.x > this.cell.x ? "right" : "left"
    } else if (this.nextCell.y !== this.cell.y) {
      this.spriteDirection = this.nextCell.y > this.cell.y ? "down" : "up"
    }
  }
}



