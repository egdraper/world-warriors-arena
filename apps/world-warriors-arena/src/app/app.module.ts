import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Engine } from './engine/engine';
import { TestAssetComponent } from './game-assets/test-asset/test-asset.component';

@NgModule({
  declarations: [AppComponent, TestAssetComponent],
  imports: [BrowserModule],
  providers: [Engine],
  bootstrap: [AppComponent],
})
export class AppModule {}
