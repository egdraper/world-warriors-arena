import { v4 as uuidv4 } from 'uuid';
import { GSM } from '../app.service.manager';
import { ClickAnimation } from './click-animation';
import { SelectionIndicator } from './selection-indicator';
import { Cell } from './cell.model';
import { GameSettings } from './game-settings';
import { ShortestPath } from '../utils/shortest-path';

export class GameComponent {
  public id: string
  public cell: Cell = null
  public gridId = "0"

  constructor() {
    this.id = uuidv4()
  }
}

export class AnimationComponent extends GameComponent {
  public animationFrame: number[] | number = 10
  public moving: boolean
  public update(): void { }
  public move(): void { }
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
  public onFinished: () => void
  
  private redirection: { start: Cell, end: Cell, charactersOnGrid: MotionAsset[] }
  private nextCell: Cell
  private prevCell: Cell

  public set spriteDirection(value: string) {
    if (value === "down") { this.frameYPosition = 0 }
    if (value === "up") { this.frameYPosition = 108 }
    if (value === "left") { this.frameYPosition = 36 }
    if (value === "right") { this.frameYPosition = 72 }
  }

  constructor() {
    super()
  }

  public addSelectionIndicator(): void {
    this.selectionIndicator = new SelectionIndicator(6, `../../../assets/images/ExplosionClick1.png`)
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


  public startMovement(startCell: Cell, endCell: Cell, charactersOnGrid: MotionAsset[], onFinished?: ()=> void): void {
    if(onFinished) { this.onFinished = onFinished }
    this.destinationIndicator = new ClickAnimation(350, `../../../assets/images/DestinationX.png`, endCell)

    if (this.moving) {
      this.redirection = { start: undefined, end: endCell, charactersOnGrid: charactersOnGrid }
      return
    } else {
      this.redirection = undefined
    }

    this.currentPath = ShortestPath.find(startCell, endCell, charactersOnGrid)
    if(this.currentPath.length === 0) { return }
    this.moving = true
    this.prevCell = this.currentPath.pop() // removes cell the character is standing on
    this.nextCell = this.currentPath.pop()
    GSM.Assets.placementChanged = true
    this.setSpriteDirection()
    this.animationFrame = 8
  }

  public endMovement(): void {
    this.currentPath = null
    this.moving = false
    this.animationFrame = 16
    this.destinationIndicator.forceStop()
    this.destinationIndicator = undefined
  }



  public move() {
    // called automatically every 1/60 of a second from the engine
    let nextXMove = 0
    let nextYMove = 0
    const speed = GameSettings.speed

    if (this.nextCell.x !== this.cell.x) { nextXMove = this.nextCell.x > this.cell.x ? speed : speed * -1 }
    if (this.nextCell.y !== this.cell.y) { nextYMove = this.nextCell.y > this.cell.y ? speed : speed * -1 }

    this.positionX += nextXMove
    this.positionY += nextYMove

    if (!GameSettings.gm || GameSettings.trackMovement) {
      GSM.Canvas.trackAsset(-1 * (nextXMove), -1 * (nextYMove), this)
    }

    if (this.positionY % (32) === 0 && this.positionX % (32) === 0) {
      this.cell = GSM.Map.activeMap.grid[`x${this.positionX / (32)}:y${this.positionY / (32)}`]
      
      // sets screen position for scrolling
      if(!GameSettings.gm) {
        GSM.Canvas.trackAsset(this.nextCell.x - this.prevCell.x, this.nextCell.y - this.prevCell.y, this, true)
      }
      this.prevCell = this.nextCell
      
      this.nextCell = this.currentPath.length > 0
        ? this.currentPath.pop()
        : null

      // handles screen offset  

      GSM.Draw.blackOutFogPainter.movementComplete = true
      if (this.redirection) {
        this.endMovement()
        this.startMovement(this.cell, this.redirection.end, this.redirection.charactersOnGrid)
      }

      if (!this.nextCell) {
        this.endMovement()
        if(this.onFinished) { 
          const onFinished = this.onFinished
          this.onFinished = undefined
          onFinished()
        }
      } else {
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



