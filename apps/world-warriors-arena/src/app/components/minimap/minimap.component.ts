import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GSM } from '../../app.service.manager';
import { MiniMapManager } from './minimap-manager.service';

@Component({
  selector: 'world-warriors-arena-minimap',
  templateUrl: './minimap.component.html',
  styleUrls: ['./minimap.component.scss']
})
export class MinimapComponent implements AfterViewInit {
  @ViewChild('miniMap') miniMapCanvas: ElementRef<HTMLCanvasElement>;
  public miniMapContext: CanvasRenderingContext2D;
  public miniMapManager: MiniMapManager

  public ngAfterViewInit(): void {
    this.miniMapContext = this.miniMapCanvas.nativeElement.getContext('2d', { alpha: false });
    this.miniMapManager = new MiniMapManager(this.miniMapCanvas, this.miniMapContext)
    this.miniMapContext.canvas.width = document.getElementsByClassName("mini-window")[0].clientWidth - 9
    this.miniMapContext.canvas.height = document.getElementsByClassName("mini-window")[0].clientHeight -12
    this.miniMapManager.createMapArea(GSM.Map.maps, GSM.Map.mapIds)
  }



}
