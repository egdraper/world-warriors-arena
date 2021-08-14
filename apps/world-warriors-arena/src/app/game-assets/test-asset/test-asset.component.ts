import { Component, OnInit } from '@angular/core';
import { Engine } from '../../engine/engine';
import { Asset, GameComponents } from '../../models/assets.model';

// This is only here for visibilty
export class Creature extends Asset {
  public positionX = 0
  public positionY = 0

  public update() {
    if(this.positionX < 250) {
      this.positionX += 5 
    } else {
      this.positionX = 0
    }
  }
}

@Component({
  selector: 'world-warriors-arena-test-asset',
  templateUrl: './test-asset.component.html',
  styleUrls: ['./test-asset.component.scss']
})
export class TestAssetComponent implements OnInit {
  public gameComponents: Creature[] = []
  constructor(private engine: Engine) { }

  public ngOnInit(): void {
   const creature = new Creature()

    const creature2 = new Creature() 
    creature2.animationFrame = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]
    creature2.animationFrame = [20, 40, 60]

  
   this.gameComponents.push(creature)
    this.gameComponents.push(creature2)

   this.engine.startAnimationTrigger(creature)
    this.engine.startAnimationTrigger(creature2)
  }

}
