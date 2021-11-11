import { Component, HostListener, OnInit } from '@angular/core';
import { CanvasService } from '../../canvas/canvas.service';
import { AssetsService } from '../../game-assets/assets.service';
import { DrawService } from '../../game-engine/draw-tools/draw.service';
import { GridService } from '../../game-engine/grid.service';
import { ShortestPath } from '../../game-engine/shortest-path';
import { GridMapCell, GRID_CELL_MULTIPLIER, MapDetails } from '../../models/cell.model';
import { EditorService } from '../editor-palette/editor.service';
import { GridMapGenerator } from '../map-generator/grid-map-generator';

@Component({
  selector: 'world-warriors-arena-global-map',
  templateUrl: './global-map.component.html',
  styleUrls: ['./global-map.component.scss']
})
export class GlobalMapComponent implements OnInit {
  public gridOfGrids: GridMapCell[][] = []

  public gridCanvasContext: CanvasRenderingContext2D;
  public maxHeight: number = 5
  public maxWidth: number = 5

  private controlPressed = false
  private mouseIsDown = false

  constructor( 
    public gridService: GridService,
    public editorService: EditorService,
    public drawService: DrawService,
    public canvasService: CanvasService,
    public assetService: AssetsService,
    public shortestPath: ShortestPath
  ) { }

  public ngOnInit(): void {
    for (let i = 0; i < this.maxHeight; i++) {
      this.gridOfGrids[i] = [];
     
      for (let l = 0; l < this.maxWidth; l++) {
        this.gridOfGrids[i][l] = {x:l, y:i}
      }
    }

  }

  @HostListener("document:keydown", ["$event"])
  public onKeyDown(event: KeyboardEvent): void {
    if (event.key === "Control") {
      this.controlPressed = true
    }
  }

  @HostListener("document:keyup", ["$event"])
  public onKeyUp(event: KeyboardEvent): void {
    if (event.key === "Control") {
      this.controlPressed = false
    }
  }

  public onGridCellClick(gridCell: GridMapCell, mouseEvent: MouseEvent, gridCanvas: HTMLCanvasElement): void {
    gridCell.context = gridCanvas.getContext('2d');
    gridCell.gridCanvas = gridCanvas
    gridCell.relationX = (this.gridService.activeGrid.width * GRID_CELL_MULTIPLIER) / 200
    gridCell.relationY = (this.gridService.activeGrid.height * GRID_CELL_MULTIPLIER) / 200
    
    gridCanvas.height = 200
    gridCanvas.width = 200
    
    gridCell.context.imageSmoothingEnabled = false

      gridCell.context.fillStyle = 'yellow'
      gridCell.context.fillRect(
        0,
        0,
        200,
        200
      )
    
  }

  public onMouseDown(gridCell: GridMapCell, mouseEvent: MouseEvent): void {
    this.mouseIsDown = true
  }

  public onMouseUp(gridCell: GridMapCell, mouseEvent: MouseEvent): void {
    this.mouseIsDown = false
  }
  
  public onMouseMove(gridCell: GridMapCell, mouseEvent: MouseEvent): void {
    if(gridCell.gridCanvas && this.controlPressed && this.mouseIsDown) {
      if(!gridCell.markers) { gridCell.markers = []}
      gridCell.markers.push({x: mouseEvent.offsetX, y: mouseEvent.offsetY})
      gridCell.context.beginPath();
      gridCell.context.moveTo(mouseEvent.offsetX, mouseEvent.offsetY);
      gridCell.context.strokeStyle = "red";
      gridCell.context.lineWidth = Math.round(200 / gridCell.relationX);
      gridCell.context.lineCap = "round";
      gridCell.context.lineJoin = "round";
      gridCell.context.lineTo(mouseEvent.offsetX, mouseEvent.offsetY);
      gridCell.context.stroke();
    }
  }

  public generateMaps(): void {
    this.gridService.createNewGrid(60, 60, "DrawableDungeon")
    this.canvasService.setupCanvases()

    this.drawService.drawBackground(true)
    this.drawService.drawGridLines()
    const generator = new GridMapGenerator(this.gridService, this.shortestPath, this.editorService, this.canvasService)
    generator.autoFillBackgroundTerrain("caveDirt")

    const mapDetails: MapDetails = {
      backgroundTypeId: "caveDirt",
      terrainTypeId: "DrawableDungeon",
      inverted: true,
      pathTypeId: undefined,
      width: 5,
      height: 5
    }
    
    generator.generateMap(this.gridOfGrids[0][0], mapDetails)
    
    this.editorService.backgroundDirty = true
    this.assetService.obstaclesDirty = true
  }
}
