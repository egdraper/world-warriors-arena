import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Engine } from './engine/engine';
import { TestAssetComponent } from './game-assets/test-asset/test-asset.component';
import { GridService } from './grid/grid.service';

@NgModule({
  declarations: [AppComponent, TestAssetComponent],
  imports: [BrowserModule],
  providers: [Engine, GridService],
  bootstrap: [AppComponent],
})
export class AppModule {}
