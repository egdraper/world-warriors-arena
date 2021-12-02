import { Component, OnInit } from '@angular/core';
import { GSM } from '../../../app.service.manager';
import { Character } from '../../../game-assets/character';

@Component({
  selector: 'world-warriors-arena-character-editor-palette',
  templateUrl: './character-editor-palette.component.html',
  styleUrls: ['./character-editor-palette.component.scss']
})
export class CharacterEditorPaletteComponent implements OnInit {
  public characterImages: HTMLImageElement[] = []

  public ngOnInit(): void {
    // TODO: Automatically add images
    for (let i = 1; i < 40; i++) {
      const img = new Image()
      img.src = i > 9 ? `assets/images/character_0${i}.png` : `assets/images/character_00${i}.png`
      this.characterImages.push(img)
    }
  }

  public tileClick(image: HTMLImageElement): void {
    GSM.Assets.deselectAsset()
    GSM.CharacterEditor.selectedCharacterUrl = image
    GSM.CharacterEditor.selectedCharacter = 
      new Character(image.src, null)
  }
}
