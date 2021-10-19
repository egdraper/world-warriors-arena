import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { CanvasService } from '../../canvas/canvas.service';
import { DrawService } from '../../game-engine/draw-tools/draw.service';
import { GridService } from '../../game-engine/grid.service';
import { GridMapCell, GRID_CELL_MULTIPLIER, MapDetails } from '../../models/cell.model';
import { EditorService } from '../editor-pallete/editor.service';
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
    public canvasService: CanvasService
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
    gridCell.relationX = (this.gridService.width * GRID_CELL_MULTIPLIER) / 200
    gridCell.relationY = (this.gridService.height * GRID_CELL_MULTIPLIER) / 200
    
    gridCanvas.height = 200
    gridCanvas.width = 200
    

    gridCell.context.imageSmoothingEnabled = false

      // gridCell.context.clearRect(0, 0, 200, 200)
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
    this.gridService.createGrid(40, 40, "DrawableDungeon")
    this.canvasService.setupCanvases(this.gridService.width, this.gridService.height)

    this.drawService.autoFillTerrain("caveDirt")
    this.drawService.drawBackground(true)
    this.drawService.drawLines()
    const generator = new GridMapGenerator(this.gridService)


    const mapDetails: MapDetails = {
      backgroundTypeId: "caveDirt",
      terrainTypeId: "DrawableDungeon",
      inverted: true,
      pathTypeId: undefined
    }
    
    generator.generateMap(this.gridOfGrids[0][0], mapDetails)
    
    this.editorService.backgroundDirty = true
  }
}
