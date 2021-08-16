import { ElementRef, Injectable } from "@angular/core";

@Injectable()
export class CanvasService {
  public canvas: ElementRef<HTMLCanvasElement>;
  public ctx: CanvasRenderingContext2D;
}