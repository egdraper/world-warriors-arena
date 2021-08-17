import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Engine } from './engine/engine';
import { GridService } from './grid/grid.service';
import { CanvasComponent } from './canvas/canvas.component';
import { CanvasService } from './canvas/canvas.service';
import { AssetsService } from './game-assets/assets.service';
import { DrawService } from './engine/draw.service';

@NgModule({
  declarations: [AppComponent, CanvasComponent],
  imports: [BrowserModule],
  providers: [
    Engine,
    GridService,
    CanvasService,
    AssetsService,
    DrawService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
