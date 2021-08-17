import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class DrawService {
  public drawForground$ = new Subject()
  public drawBackground$ = new Subject()
}