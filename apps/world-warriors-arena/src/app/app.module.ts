import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Engine } from './game-engine/engine';
import { GridService } from './game-engine/grid.service';
import { CanvasComponent } from './canvas/canvas.component';
import { CanvasService } from './canvas/canvas.service';
import { AssetsService } from './game-assets/assets.service';
import { DrawService } from './game-engine/draw-tools/draw.service';
import { ShortestPath } from './game-engine/shortest-path';
import { FogOfWarService } from './game-engine/visibility.service';
import { GlobalMapComponent } from './editor/global-map/global-map.component';
import { CharacterEditorPaletteComponent } from './editor/character-edtor-palette/character-editor-pallete/character-editor-palette.component';
import { EditorPaletteComponent } from './editor/editor-palette/editor-palette.component';
import { EditorService } from './editor/editor-palette/editor.service';
import { CharacterEditorService } from './editor/character-edtor-palette/character-editor-pallete/character-editor.service';
import { NewFogOfWarService } from './game-engine/new-visibility.service';
import { GameMarkersService } from './game-assets/game-markers';

@NgModule({
  declarations: [AppComponent, CanvasComponent, EditorPaletteComponent, CharacterEditorPaletteComponent, GlobalMapComponent],
  imports: [BrowserModule],
  providers: [
    AssetsService,
    CanvasService,
    ShortestPath,
    DrawService,
    GridService,
    EditorService,
    FogOfWarService,
    NewFogOfWarService,
    Engine,
    CharacterEditorService,
    GameMarkersService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
