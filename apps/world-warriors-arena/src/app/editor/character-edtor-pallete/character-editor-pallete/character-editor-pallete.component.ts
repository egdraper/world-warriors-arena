import { Component, OnInit } from '@angular/core';
import { AssetsService } from '../../../game-assets/assets.service';

@Component({
  selector: 'world-warriors-arena-character-editor-pallete',
  templateUrl: './character-editor-pallete.component.html',
  styleUrls: ['./character-editor-pallete.component.scss']
})
export class CharacterEditorPalleteComponent implements OnInit {
  public characterImages: HTMLImageElement[] = []
  constructor(private assetService: AssetsService) { }

  ngOnInit(): void {    
    // TODO: Automatically add images
    for(let i = 1; i < 40; i++) {
      const img = new Image()
      img.src = i > 9 ? `assets/images/character_0${i}.png` : `assets/images/character_00${i}.png`
      this.characterImages.push(img)
    }
  }

  public tileClick(image: HTMLImageElement): void {
    this.assetService.addCharacter(image.src)
  }
}
