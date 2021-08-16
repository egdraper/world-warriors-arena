import { Component } from '@angular/core';
import { Engine } from './engine/engine';
import { AssetsService } from './game-assets/assets.service';
import { GridService } from './grid/grid.service';

@Component({
  selector: 'world-warriors-arena-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private grid: GridService,
    private engine: Engine,
    private assetService: AssetsService
    ) {
      this.grid.createGrid(15,15)
    }

  public ngOnInit(): void {
    this.engine.startEngine()
  }

  public onAddCharacterClick(): void {
    this.assetService.addCharacter()
  }
}
