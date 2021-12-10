import { Injectable } from '@angular/core'
import { EventStateDetails } from '../models/game-event-handler.model'
import { GameEventHandler } from './game-event-handlers/base.handler'
import { DragAssetEventHandler } from './game-event-handlers/drag-asset.handler'
import { GMHoverAssetEventHandler } from './game-event-handlers/gm-hover-asset.handler'

@Injectable({
  providedIn: 'root'
})
export class PlayerEventsService {
  public gameEvents: Set<GameEventHandler> = new Set<GameEventHandler>()
  public hoverDetails: EventStateDetails = null
  public cursor: string = "pointer"

  // CtrlDown
  private _ctrlDown = false
  public set ctrlDown(value: boolean) {
    this._ctrlDown = value
    this.change()
  } 
  public get ctrlDown() {
    return this._ctrlDown
  }

  // MouseDown
  public _mouseDown = false
  public set mouseDown(value: boolean) {
    this._mouseDown = value
    this.change()
  } 
  public get mouseDown() {
    return this._mouseDown
  }
  
  // mouseHover
  public _mouseHover = false
  public set mouseHover(value: boolean) {
    this._mouseHover = value
    this.change()
  } 
  public get mouseHover() {
    return this._mouseHover
  }

  // mouseMove
  public _mouseMove = false
  public set mouseMove(value: boolean) {
    this._mouseMove = value
    this.change()
  } 
  public get mouseMove() {
    return this._mouseMove
  }

  // ShiftDown
  public shiftDown: boolean = false

  // AltDown
  public altDown: boolean = false


  constructor() {
    this.register(new GMHoverAssetEventHandler())
    this.register(new DragAssetEventHandler())
  }

  public change(): void {
    this.gameEvents.forEach(a => {
      a.criteriaMet()
    })
  }

  public register(gameEvent: GameEventHandler): void {
    gameEvent.eventService = this
    this.gameEvents.add(gameEvent) 
  }

  public unRegister(gameEvent: GameEventHandler): void {
    this.gameEvents.delete(gameEvent)
  }

  public getEvent(id: string): GameEventHandler {
    let gameEvent: GameEventHandler
    this.gameEvents.forEach(gEvent => {
      if (gEvent.id === id) {
        gameEvent = gEvent
      }
    })

    return gameEvent
  }
}
