import { Injectable } from '@angular/core'
import { MouseEventDetails, KeyPressEventDetails } from '../models/game-event-handler.model'
import { GameEventHandler } from './game-event-handlers/base.handler'
import { DragAssetEventHandler } from './game-event-handlers/drag-asset.handler'
import { GMHoverAssetEventHandler, GMHoverCtrlAssetEventHandler } from './game-event-handlers/gm-hover-asset.handler'
import { MoveAssetEventHandler } from './game-event-handlers/move-asset.handler'
import { PageTransitionMarkerCtrlClickHandler } from './game-event-handlers/page-transition-marker-ctrl-click.handler'
import { PageTransitionMarkerHandler } from './game-event-handlers/page-transition-marker-click.handler'
import { PlaceAssetEventHandler } from './game-event-handlers/place-asset.handler'
import { PlayerSelectAssetEventHandler } from './game-event-handlers/select-asset.handler'
import { PlayerSwapAssetEventHandler } from './game-event-handlers/swap-asset.handler'
import { DragSelectedAssetEventHandler } from './game-event-handlers/drag-selected-asset.handler'
import { ShiftScrollEventHandler } from './game-event-handlers/shift-scroll.handler'
import { DrawTerrainEventHandler } from './game-event-handlers/draw-terrain.handler'
import { DrawInvertedEventHandler } from './game-event-handlers/draw-inverted.handler'
import { ArrowKeysPressedEventHandler } from './game-event-handlers/arrow-keys-press.handler'

@Injectable({
  providedIn: 'root'
})
export class GameEventsService {
  public gameEvents: Set<GameEventHandler> = new Set<GameEventHandler>()
  public mouseDetails: MouseEventDetails = new MouseEventDetails()
  public keyPressDetails: KeyPressEventDetails = new KeyPressEventDetails()
  public cursor: { style: string } = { style: "pointer" }
  public activeEvent: string = ""

  constructor() {
    this.register(new GMHoverAssetEventHandler())
    this.register(new GMHoverCtrlAssetEventHandler())
    this.register(new DragAssetEventHandler())
    this.register(new PageTransitionMarkerCtrlClickHandler())
    this.register(new PageTransitionMarkerHandler())
    this.register(new PlayerSelectAssetEventHandler())
    this.register(new PlayerSwapAssetEventHandler())
    this.register(new MoveAssetEventHandler())
    this.register(new PlaceAssetEventHandler())
    this.register(new DragSelectedAssetEventHandler())
    this.register(new ShiftScrollEventHandler())
    this.register(new DrawTerrainEventHandler())
    this.register(new DrawInvertedEventHandler())
    this.register(new ArrowKeysPressedEventHandler())
  }

  public update(): void {
    this.gameEvents.forEach(a => {
      a.criteriaMet()
    })
  }

  public register(gameEvent: GameEventHandler): void {
    gameEvent.keyPressDetails = this.keyPressDetails
    gameEvent.mouseEventDetails = this.mouseDetails
    gameEvent.cursor = this.cursor
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


  // // CtrlDown
  // private _ctrlDown = false
  // public set ctrlDown(value: boolean) {
  //   this._ctrlDown = value
  //   this.change()
  // }
  // public get ctrlDown() {
  //   return this._ctrlDown
  // }

  // // MouseDown
  // public _mouseDown = false
  // public set mouseDown(value: boolean) {
  //   this._mouseDown = value
  //   this.change()
  // }
  // public get mouseDown() {
  //   return this._mouseDown
  // }

  // // mouseHover
  // public _mouseHover = false
  // public set mouseHover(value: boolean) {
  //   this._mouseHover = value
  //   this.change()
  // }
  // public get mouseHover() {
  //   return this._mouseHover
  // }

  // // mouseMove
  // public _mouseMove = false
  // public set mouseMove(value: boolean) {
  //   this._mouseMove = value
  //   this.change()
  // }

  // public get mouseMove() {
  //   return this._mouseMove
  // }
