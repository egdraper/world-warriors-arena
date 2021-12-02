
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { MarkerIcon } from "../models/markers-icons";

@Injectable()
export class GameMarkersService {
  public markerIcons: MarkerIcon[] = []
  public iconClick = new Subject<MarkerIcon>()
  public mouseX: number
  public mouseY: number

  public addMarkerIcon(markerIcon: MarkerIcon) {
    this.markerIcons.push(markerIcon)
  }

  public removeMarkerIcon(markerIcon: MarkerIcon) {
    this.markerIcons = this.markerIcons.filter(icon => markerIcon !== icon)
  }

  public checkForHover(): void {
    this.markerIcons.forEach(icon => {
      icon.hovering = this.mouseX >= icon.displayPosX 
        && this.mouseY >= icon.displayPosY 
        && this.mouseX <= icon.displayPosX + icon.width 
        && this.mouseY <= icon.displayPosY + icon.height 
    })
  }

  public getHoveringIcon(): MarkerIcon {
    return this.markerIcons.find(icon => icon.hovering)
  }
}
