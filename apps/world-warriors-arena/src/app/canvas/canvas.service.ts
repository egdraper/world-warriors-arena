import { ElementRef, Injectable } from "@angular/core";

@Injectable()
export class CanvasService {
  public overlayCanvas: ElementRef<HTMLCanvasElement>;
  public overlayCTX: CanvasRenderingContext2D;
  
  public foregroundCanvas: ElementRef<HTMLCanvasElement>;
  public foregroundCTX: CanvasRenderingContext2D;
   
  public backgroundCanvas: ElementRef<HTMLCanvasElement>;
  public backgroundCTX: CanvasRenderingContext2D;
  
  public fogCanvas: ElementRef<HTMLCanvasElement>;
  public fogCTX: CanvasRenderingContext2D;

  public blackoutCanvas: ElementRef<HTMLCanvasElement>;
  public blackoutCTX: CanvasRenderingContext2D;
}