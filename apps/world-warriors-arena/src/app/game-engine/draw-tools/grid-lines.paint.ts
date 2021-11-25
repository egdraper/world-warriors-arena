import { Injectable } from "@angular/core";
import { CanvasService } from "../../canvas/canvas.service";
import { EditorService } from "../../editor/editor-palette/editor.service";
import { Engine } from "../engine";
import { GridService } from "../grid.service";
import { Painter } from "./painter";

@Injectable()
export class GridLinePainter extends Painter {
  constructor(
    public canvasService: CanvasService,
    public gridService: GridService,
    public editorService: EditorService,
    public engine: Engine
  ) {
    super(engine)
  }

  // Draws Grid Lines  
  public paint(): void {
    if (this.editorService.backgroundDirty) {
      for (let h = 0; h <= this.gridService.activeGrid.height; h++) {
        for (let w = 0; w <= this.gridService.activeGrid.width; w++) {
          // Horizontal lines
          this.canvasService.backgroundCTX.beginPath()
          this.canvasService.backgroundCTX.moveTo(w * 32, h * 32)
          this.canvasService.backgroundCTX.lineTo(w * 32, (h * 32) + 32)
          this.canvasService.backgroundCTX.lineWidth = 1;
          this.canvasService.backgroundCTX.strokeStyle = "rgba(255, 255 ,255,.5)"
          this.canvasService.backgroundCTX.stroke()

          // Vertical Lines
          this.canvasService.backgroundCTX.beginPath()
          this.canvasService.backgroundCTX.moveTo(w * 32, h * 32)
          this.canvasService.backgroundCTX.lineTo((w * 32) + 32, h * 32)
          this.canvasService.backgroundCTX.strokeStyle = "rgba(255,255,0,.5)"
          this.canvasService.backgroundCTX.lineWidth = 1;
          this.canvasService.backgroundCTX.stroke()
        }
      }
    }
  }

}