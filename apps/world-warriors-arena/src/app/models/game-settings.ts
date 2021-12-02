export class GameSettings {
  public static mapSettings: {[id: string]: MapSettings} = {}
  public static gridLineThickness = 1
  public static gridLineStyle = "rgba(255, 255, 255, .7)"
  public static cellDimension: number = 32
  public static scrollSpeed: number = 8
  public static scrollSensitivity: number = 96
  public static gm: boolean = false
  public static trackMovement: boolean = false
  public static scale: number = 1
  public static fog: boolean = true
  public static blackout: boolean = true
}

export class DebugSettings {
  public static fogDebug = false

  public static fogFeather = true
  public static fogOffset = true
}

export class MapSettings {
  id: string
}

