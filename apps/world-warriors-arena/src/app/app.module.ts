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
import { EditorPalleteComponent } from './editor/editor-pallete/editor-pallete.component';
import { EditorService } from './editor/editor-pallete/editor.service';
import { CharacterEditorPalleteComponent } from './editor/character-edtor-pallete/character-editor-pallete/character-editor-pallete.component';
import { GlobalMapComponent } from './editor/global-map/global-map.component';

@NgModule({
  declarations: [AppComponent, CanvasComponent, EditorPalleteComponent, CharacterEditorPalleteComponent, GlobalMapComponent],
  imports: [BrowserModule],
  providers: [
    AssetsService,
    CanvasService,
    ShortestPath,
    DrawService,
    GridService,
    EditorService,
    FogOfWarService,
    Engine,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
