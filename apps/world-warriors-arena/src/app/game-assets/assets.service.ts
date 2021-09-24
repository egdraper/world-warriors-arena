import { ThisReceiver } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { CanvasService } from "../canvas/canvas.service";
import { EditorService } from "../editor/editor-pallete/editor.service";
import { DrawService } from "../engine/draw.service";
import { Engine } from "../engine/engine";
import { ShortestPath } from "../engine/shortest-path";
import { GridService } from "../grid/grid.service";
import { MotionAsset } from "../models/assets.model";
import { Cell, SpriteBackgroundTile, SpriteTile, TileAttachment } from "../models/cell.model";
import { Character } from "./character";
import { ClickAnimation } from "./click-animation";
import { getBackgroundCollection } from "./tiles.db.ts/tile-assets.db";

@Injectable()
export class AssetsService {
  public gameComponents: MotionAsset[] = []
  public selectedGameComponent: MotionAsset
  public obstacles: string[] = []
  public obstacleAttachments: {[cellId: string]: TileAttachment[] } = { }

  constructor(
    private drawService: DrawService,
    private canvas: CanvasService,
    private shortestPath: ShortestPath,
    private gridService: GridService,
    private engine: Engine,
    private editorService: EditorService,
    ) { 

    }

  public addObstacleImage(cell: Cell): void {
    // move obstacles to assets service
    this.obstacles.push(cell.id)
    this.obstacleAttachments[cell.id] = cell.imageTile.attachments
  }   

  public addDefaultBoarder(): void {
    this.gridService.gridDisplay.forEach(row => {
      row.forEach(cell => {
        if(cell.x === 0 || cell.y === 0 || cell.x === this.gridService.width-1 || cell.y === this.gridService.height-1) {
          cell.imageTile =  this.findMapAsset("crates", "crate1")
          cell.visible = true
          this.addObstacleImage(cell)
        }
      })
    })
  }

  public findMapAsset(category: string, tileId: string): SpriteTile {
    return this.editorService.findObjectAsset(category, tileId)
  } 

  public addCharacter(imgUrl?: string): void {
    // const rndInt = Math.floor(Math.random() * 5) + 1
    // const rndInt2 = Math.floor(Math.random() * 5) + 1
    // const gridCell = this.gridService.grid[`x${rndInt}:y${rndInt2}`]
    // const player = new Character(this.canvas, this.drawService, gridCell, this.gridService)

    // gridCell.occupiedBy = player  // <--- adding the character into the occupiedBy Spot

    // player.animationFrame = 10

    // this.engine.startAnimationTrigger(player)

    // this.gameComponents.push(player)


    const gridCell1 = this.gridService.grid[`x2:y2`]

    const player = new Character(this.canvas, this.drawService, gridCell1, this.gridService, this.shortestPath, this.engine)


    gridCell1.occupiedBy = player  // <--- adding the character into the occupiedBy Spot

    player.animationFrame = [20, 40, 60 ] // set to 10 for walking speed


    this.engine.startAnimationTrigger(player)

    this.gameComponents.push(player)
    
    this.drawService.clearFogLineOfSight(gridCell1)
    // this.drawService.drawOnlyVisibleObstacle(gridCell1.id)

  }

  public addClickAnimation(cell: Cell, imgSrc: string): void {
    const animation = new ClickAnimation(52, this.engine, imgSrc, cell)
    

  }
}


