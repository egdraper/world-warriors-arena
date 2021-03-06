import { Component, OnInit } from '@angular/core';
import { Engine } from './services/engine.service';
import { AssetsService } from './services/assets.service';
import { Cell } from './models/cell.model';
import { MapService } from './services/map.service';
import { DrawService } from './services/draw.service';
import { CanvasService } from './services/canvas.service';
import { CharacterEditorService } from './services/character-editor.service';
import { EditorService } from './services/editor.service';
import { GameMarkersService } from './services/game-markers.service';
import { NewFogOfWarService } from './services/new-visibility.service';
import { GSM } from './app.service.manager';
import { GameEventsService } from './services/game-events.service';

@Component({
  selector: 'world-warriors-arena-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public selectedCell: Cell
  constructor(
    assetsService: AssetsService,
    canvasService: CanvasService,
    drawService: DrawService,
    mapService: MapService,
    editorService: EditorService,
    fogOfWarService: NewFogOfWarService,
    engine: Engine,
    characterEditorService: CharacterEditorService,
    gameMarkerService: GameMarkersService,
    playerEventService: GameEventsService
  ) {
    GSM.Assets = assetsService
    GSM.Canvas = canvasService
    GSM.Draw = drawService
    GSM.Map = mapService
    GSM.Editor = editorService
    GSM.FogOfWar = fogOfWarService
    GSM.Engine = engine
    GSM.CharacterEditor = characterEditorService
    GSM.GameMarker = gameMarkerService
    GSM.GameEvent = playerEventService
  }

  public ngOnInit(): void {
    GSM.Engine.startEngine()
  }
}
