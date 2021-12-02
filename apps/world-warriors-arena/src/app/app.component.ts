import { Component } from '@angular/core';
import { Engine } from './services/engine.service';
import { AssetsService } from './services/assets.service';
import { Cell } from './models/cell.model';
import { GridService } from './services/map.service';
import { DrawService } from './services/draw.service';
import { CanvasService } from './services/canvas.service';
import { CharacterEditorService } from './services/character-editor.service';
import { EditorService } from './services/editor.service';
import { GameMarkersService } from './services/game-markers.service';
import { NewFogOfWarService } from './services/new-visibility.service';
import { ShortestPath } from './services/shortest-path.service';
import { GSM } from './app.service.manager';

@Component({
  selector: 'world-warriors-arena-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public selectedCell: Cell
  constructor(
    assetsService: AssetsService,
    canvasService: CanvasService,
    shortestPath: ShortestPath,
    drawService: DrawService,
    gridService: GridService,
    editorService: EditorService,
    fogOfWarService: NewFogOfWarService,
    engine: Engine,
    characterEditorService: CharacterEditorService,
    gameMarkerService: GameMarkersService
  ) {
    GSM.Assets = assetsService
    GSM.Canvas = canvasService
    GSM.ShortestPath = shortestPath
    GSM.Draw = drawService
    GSM.Map = gridService
    GSM.Editor = editorService
    GSM.FogOfWar = fogOfWarService
    GSM.Engine = engine
    GSM.CharacterEditor = characterEditorService
    GSM.GameMarker = gameMarkerService
  }

  public ngOnInit(): void {
    GSM.Engine.startEngine()
  }
}
