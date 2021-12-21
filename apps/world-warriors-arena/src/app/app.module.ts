import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Engine } from './services/engine.service';
import { MapService } from './services/map.service';
import { CanvasComponent } from './components/canvas/canvas.component';
import { CanvasService } from './services/canvas.service';
import { AssetsService } from './services/assets.service';
import { DrawService } from './services/draw.service';
import { GlobalMapComponent } from './components/global-map/global-map.component';
import { CharacterEditorPaletteComponent } from './components/character-editor-pallete/character-editor-palette.component';
import { EditorPaletteComponent } from './components/editor-palette/editor-palette.component';
import { EditorService } from './services/editor.service';
import { CharacterEditorService } from './services/character-editor.service';
import { NewFogOfWarService } from './services/new-visibility.service';
import { GameMarkersService } from './services/game-markers.service';
import { GameEventsService } from './services/game-events.service';
import { MinimapComponent } from './components/minimap/minimap.component';
import { TerrainEditorComponent } from './components/editor-palette/terrain-editor/terrain-editor.component';

import { CharacterEditorComponent } from './components/editor-palette/character-editor/character-editor.component';
import { BackgroundEditorComponent } from './components/editor-palette/background-editor/background-editor.component';
import { ObjectEditorComponent } from './components/editor-palette/object-editor/object-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    EditorPaletteComponent,
    CharacterEditorPaletteComponent,
    GlobalMapComponent,
    MinimapComponent,
    TerrainEditorComponent,
    BackgroundEditorComponent,
    ObjectEditorComponent,
    CharacterEditorComponent
  ],
  imports: [BrowserModule],
  providers: [
    AssetsService,
    CanvasService,
    DrawService,
    MapService,
    EditorService,
    NewFogOfWarService,
    Engine,
    CharacterEditorService,
    GameMarkersService,
    GameEventsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
