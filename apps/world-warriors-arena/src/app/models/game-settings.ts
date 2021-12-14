export class GameSettings {
  public static mapSettings: {[id: string]: MapSettings} = {}
  public static gridLineThickness = 1
  public static gridLineStyle = "rgba(255, 255, 255, .7)"
  public static cellDimension = 32
  public static scrollSpeed = 8
  public static scrollSensitivity = 96
  public static gm = false
  public static trackMovement = false
  public static scale = 1
  public static fog = true
  public static blackout = true
  public static speed = 2
}

export class DebugSettings {
  public static fogDebug = false

  public static fogFeather = true
  public static fogOffset = true
}

export class MapSettings {
  id: string
}

