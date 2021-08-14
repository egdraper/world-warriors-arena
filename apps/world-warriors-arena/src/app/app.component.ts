import { Component } from '@angular/core';
import { Engine } from './engine/engine';

@Component({
  selector: 'world-warriors-arena-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private engine: Engine) {}

  public ngOnInit(): void {
    this.engine.startEngine()
  }
}
