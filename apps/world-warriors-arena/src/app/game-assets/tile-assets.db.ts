const tileB_outside = new Image()
tileB_outside.src = "assets/images/tileB_outside.png"


export const TileAssets = {
  tree1: {
    spriteSheet: tileB_outside,
    spriteGridPosX: 8,
    spriteGridPosY: 4,
    tileHeight: 4,
    tileWidth: 5,
    multiplier: 32,
  },
  tree2: {
    spriteSheet: tileB_outside,
    spriteGridPosX: 8,
    spriteGridPosY: 0,
    tileHeight: 4,
    tileWidth: 5,
    multiplier: 32,
  }
}