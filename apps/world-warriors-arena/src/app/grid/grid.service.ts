import { Injectable } from '@angular/core';
import { Cell, GridDetails, RelativePositionCell } from '../models/cell.model';

@Injectable()
export class GridService {
  public height = 50 
  public width = 50
  public grid: {[cell: string]: Cell } = { }
  public gridDisplayLite: GridDetails
  public gridDisplay: Cell[][] = [];
  public obstacles: string[] = []

  public createGrid(width: number, height: number) {
    this.height = height
    this.width = width
    this.generateGrid(width, height)
  }

  public getGridCellByCoordinate(x: number, y: number): Cell {
    let foundCell: Cell
    this.gridDisplay.forEach(row => {
      row.forEach(cell => {
        if((cell.posX < x && cell.posX + 50 >= x ) && (cell.posY < y && cell.posY + 50 >= y)) {
          foundCell = cell
        }
      })
    })

    return foundCell
  }

  private generateGrid(width: number, height: number, name: string = "No Name") {
    this.gridDisplayLite = {
      height,
      width,
      name
    }
    this.createDisplayArray(width, height,)
    this.addNeighbors(width, height)
  }

  private createDisplayArray(width: number, height: number, grid?: {[key: string]: Cell}) {
    let imgIndexX = 1
    let imgIndexY = 1
    
    for (let i = 0; i < height; i++) {
      this.gridDisplay[i] = [];

      for (let l = 0; l < width; l++ ) {
        this.grid[`x${l}:y${i}`] = grid && grid[`x${l}:y${i}`] 
          ? grid[`x${l}:y${i}`] 
          : { 
            x: l,
            y: i,
            posX: l * 50,
            posY: i * 50,
            obstacle: false,
            id: `x${l}:y${i}`,
            image: null,

            
            imgIndexX: (Math.floor(Math.random() * 3)) * -50,
            imgIndexY: (Math.floor(Math.random() * 3)) * -50,
            imgWidth: 150,
            imgHeight: 150,
          };

        imgIndexX ++

        if (imgIndexX > 3 && imgIndexY < 3) { 
          imgIndexX = 1 
          imgIndexY++
        } else if (imgIndexX > 3 && imgIndexY >= 3 ) {
          imgIndexX = 1
          imgIndexY = 1
        }
        this.gridDisplay[i][l] = this.grid[`x${l}:y${i}`];
      }
    }
  }

  private addNeighbors(width: number, height: number) {
    for (let i = 0; i < height; i++) {
      for (let l = 0; l < width; l++ ) {
        const cell = this.grid[`x${l}:y${i}`];
        cell.neighbors = [];
        cell.neighbors[5] = this.grid[`x${l + 1}:y${i + 1}`];
        cell.neighbors[0] = this.grid[`x${l}:y${i - 1}`];
        cell.neighbors[2] = this.grid[`x${l}:y${i + 1}`];
        cell.neighbors[4] = this.grid[`x${l + 1}:y${i - 1}`];
        cell.neighbors[1] = this.grid[`x${l + 1}:y${i}`];
        cell.neighbors[6] = this.grid[`x${l - 1}:y${i + 1}`];
        cell.neighbors[3] = this.grid[`x${l - 1}:y${i}`];
        cell.neighbors[7] = this.grid[`x${l - 1}:y${i - 1}`];
      }
    } 
  }

  public mapCells(distance: number, x: number, y: number, selectedCells: {[key: string]: RelativePositionCell}, odd: boolean) {
    if(distance < 0) { return }
 
    for(let i = 0; i <= distance; i++) {
      selectedCells[`x${x - i}:y${y}`] = this.grid[`x${x - i}:y${y}`] as RelativePositionCell
      selectedCells[`x${x}:y${y - i}`] = this.grid[`x${x}:y${y - i}`] as RelativePositionCell
      selectedCells[`x${x}:y${y + i}`] = this.grid[`x${x}:y${y + i}`] as RelativePositionCell
      selectedCells[`x${x + i}:y${y}`] = this.grid[`x${x + i}:y${y}`] as RelativePositionCell
    }

    const newDistance = odd ? distance - 1 : distance - 2
    this.mapCells(newDistance, x - 1, y - 1, selectedCells, !odd) 
    this.mapCells(newDistance, x + 1, y + 1, selectedCells, !odd) 
    this.mapCells(newDistance, x - 1, y + 1, selectedCells, !odd) 
    this.mapCells(newDistance, x + 1, y - 1, selectedCells, !odd) 
  }
}