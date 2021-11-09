export class GameSettings {
  public static mapSettings: {[id: string]: MapSettings} = {}
  public static gridLineThickness = 1
  public static gridLineStyle = "rgba(255, 255, 255, .7)"
  public static cellDimension: number = 32
  public static scrollSpeed: number = 8
  public static scrollSensitivity: number = 96
  public static gm: boolean = false
  public static trackMovement: boolean = false
}

export class MapSettings {
  id: string
}

