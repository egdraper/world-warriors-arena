import { Component } from '@angular/core';
import { Engine } from './game-engine/engine';
import { AssetsService } from './game-assets/assets.service';
import { Cell } from './models/cell.model';
import { GridService } from './game-engine/grid.service';
import { DrawService } from './game-engine/draw-tools/draw.service';
import { FogOfWarService } from './game-engine/visibility.service';
import { CanvasService } from './canvas/canvas.service';
import { CharacterEditorService } from './editor/character-edtor-palette/character-editor-pallete/character-editor.service';
import { EditorService } from './editor/editor-palette/editor.service';
import { GameMarkersService } from './game-assets/game-markers';
import { NewFogOfWarService } from './game-engine/new-visibility.service';
import { ShortestPath } from './game-engine/shortest-path';
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

  public ngAfterViewInit(): void {

  }
  
}
