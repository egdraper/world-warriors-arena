import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Engine } from './services/engine.service';
import { GridService } from './services/map.service';
import { CanvasComponent } from './components/canvas/canvas.component';
import { CanvasService } from './services/canvas.service';
import { AssetsService } from './services/assets.service';
import { DrawService } from './services/draw.service';
import { ShortestPath } from './services/shortest-path.service';
import { GlobalMapComponent } from './components/global-map/global-map.component';
import { CharacterEditorPaletteComponent } from './components/character-editor-pallete/character-editor-palette.component';
import { EditorPaletteComponent } from './components/editor-palette/editor-palette.component';
import { EditorService } from './services/editor.service';
import { CharacterEditorService } from './services/character-editor.service';
import { NewFogOfWarService } from './services/new-visibility.service';
import { GameMarkersService } from './services/game-markers.service';

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
    NewFogOfWarService,
    Engine,
    CharacterEditorService,
    GameMarkersService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
