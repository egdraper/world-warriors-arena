
// /// <reference lib="webworker" />

// let grid: any = {}

// function autoFillBackgroundTerrain(collectionId: string) {
//   for (let h = 0; h < GSM.Map.activeGrid.height; h++) {
//     for (let w = 0; w < GSM.Map.activeGrid.width; w++) {
//       let spriteSheet
//       let xPos = 0
//       let yPos = 0
//       const cell = GSM.Map.activeGrid.grid[`x${w}:y${h}`]

//       //Randomly generates random texture
//       let weight = 0
//       GSM.Editor.findBackgroundCollection(collectionId).forEach(tile => {
//         tile.lowWeight = weight
//         weight += tile.rarity
//         tile.highWeight = weight
//       })

//       const rand = Math.floor(Math.random() * weight);
//       spriteSheet = GSM.Editor.findBackgroundCollection(collectionId)[0].spriteSheet

//       GSM.Editor.findBackgroundCollection(collectionId).forEach(tile => {
//         if (rand < tile.highWeight && rand >= tile.lowWeight) {
//           xPos = Math.floor(Math.random() * tile.spriteGridPosX.length)
//           yPos = Math.floor(Math.random() * tile.spriteGridPosY.length)
//           xPos = tile.spriteGridPosX[xPos]
//           yPos = tile.spriteGridPosY[yPos]
//           spriteSheet = tile.spriteSheet
//         }
//       })

//       cell.backgroundTile = {
//         id: `x${xPos}:Y${yPos}${collectionId}`,
//         spriteSheet: spriteSheet,
//         spriteGridPosX: [xPos],
//         spriteGridPosY: [yPos],
//         rarity: 0
//       }
//     }
//   }
// }

// function clearOpening(path: Cell[]): void {
//   path.forEach(cell => {
//     cell.obstacle = false
//     cell.growableTileId = undefined

//     for (let i = 0; i < 8; i++) {
//       if (cell.neighbors[i]) {
//         cell.neighbors[i].obstacle = false
//         cell.neighbors[i].growableTileId = undefined
//         for (let l = 0; l < 8; l++) {
//           if (cell.neighbors[i].neighbors[l]) {
//             cell.neighbors[i].neighbors[l].obstacle = false
//             cell.neighbors[i].neighbors[l].growableTileId = undefined
//           }
//         }
//       }
//     }
//   })
// }

// function createRandomizedBoarder(defaultMapSettings: DefaultMapSettings): void {
//   GSM.Map.activeGrid.gridDisplay.forEach(row => {
//     row.forEach(cell => {
//       // Outer most layer
//       if (cell.x < 2 || cell.x > GSM.Map.activeGrid.width - 3) {
//         cell.obstacle = true
//         cell.growableTileId = defaultMapSettings.terrainTypeId
//       }
//       if (cell.y < 3 || cell.y > GSM.Map.activeGrid.height - 3) {
//         cell.obstacle = true
//         cell.growableTileId = defaultMapSettings.terrainTypeId
//       }

//       // left side 2nd layer
//       if (cell.x === 2) {
//         this.setEdgeLayerRandomization(cell, 0, defaultMapSettings)
//       }
//       // left side 3rd layer
//       if (cell.x === 3 && cell.neighbors[3].obstacle && cell.neighbors[0] && cell.neighbors[0].neighbors[3].obstacle) {
//         this.setEdgeLayerRandomization(cell, 0, defaultMapSettings)
//       }

//       // top side 2nd layer
//       if (cell.y === 3) {
//         this.setEdgeLayerRandomization(cell, 1, defaultMapSettings)
//       }
//       // Top side 3rd Layer
//       if (cell.y === 4 && cell.neighbors[0].obstacle && cell.neighbors[1] && cell.neighbors[1].neighbors[0].obstacle) {
//         this.setEdgeLayerRandomization(cell, 1, defaultMapSettings)
//       }
//     })
//   })

//   GSM.Map.activeGrid.gridDisplay.forEach(row => {
//     row.forEach(cell => {
//       // right side 2nd layers
//       if (cell.x === GSM.Map.activeGrid.width - 3) {
//         this.setEdgeLayerRandomization(cell, 2, defaultMapSettings)
//       }

//       // bottom side 2nd layer
//       if (cell.y === GSM.Map.activeGrid.height - 3) {
//         this.setEdgeLayerRandomization(cell, 1, defaultMapSettings)
//       }
//     })
//   })

//   GSM.Map.activeGrid.gridDisplay.forEach(row => {
//     row.forEach(cell => {
//       // right side 3rd layer
//       if (cell.x === GSM.Map.activeGrid.width - 4 && cell.neighbors[1].obstacle && cell.neighbors[2] && cell.neighbors[2].neighbors[1].obstacle) {
//         this.setEdgeLayerRandomization(cell, 2, defaultMapSettings)
//       }
//       // bottom side 3rd layer
//       if (cell.y === GSM.Map.activeGrid.height - 4 && cell.neighbors[2].obstacle && cell.neighbors[1] && cell.neighbors[1].neighbors[2].obstacle) {
//         this.setEdgeLayerRandomization(cell, 1, defaultMapSettings)
//       }
//     })
//   })
// }

// function addRandomTerrain(defaultMapSettings: DefaultMapSettings, weight: number = 3): void {
//   for (let i = 0; i < GSM.Map.activeGrid.width; i++) {
//     const randomY = Math.floor(Math.random() * GSM.Map.activeGrid.height)
//     const randomX = Math.floor(Math.random() * GSM.Map.activeGrid.height)

//     const startCell = GSM.Map.activeGrid.getCell(randomX, randomY)
//     startCell.obstacle = true
//     startCell.growableTileId = defaultMapSettings.terrainTypeId

//     for (let i = 0; i < 8; i++) {
//       if (startCell.neighbors[i]) {
//         startCell.neighbors[i].obstacle = true
//         startCell.neighbors[i].growableTileId = defaultMapSettings.terrainTypeId

//         this.populateCell(startCell, i, weight, defaultMapSettings)
//       }
//     }
//   }
// }

// function terrainCleanup(): void {
//   GSM.Map.activeGrid.gridDisplay.forEach(row => {
//     row.forEach(cell => {
//       if(cell.growableTileId) {          
//         if((cell.neighbors[1] && !cell.neighbors[1].growableTileId) && (cell.neighbors[3] && !cell.neighbors[3].growableTileId)) {
//           cell.growableTileId = undefined
//           cell.obstacle = false
//         }

//         if((cell.neighbors[0] && !cell.neighbors[0].growableTileId) && (cell.neighbors[2] && !cell.neighbors[2].growableTileId)) {
//           cell.growableTileId = undefined
//           cell.obstacle = false
//         }
//       }
//     })
//   })
// }

// function populateCell(cell: Cell, neighborIndex: number, weight: number, defaultMapSettings: DefaultMapSettings): void {
//   const isPlaced = !!!Math.floor(Math.random() * weight)
//   if (!cell) { return }
//   if (cell.neighbors[neighborIndex] && neighborIndex < 8 && isPlaced) {
//     const neighbor = cell.neighbors[neighborIndex]

//     for (let i = 0; i < 8; i++) {
//       if (neighbor.neighbors[i]) {
//         neighbor.neighbors[i].obstacle = true
//         neighbor.neighbors[i].growableTileId = defaultMapSettings.terrainTypeId


//         if (neighbor.neighbors[i].neighbors[0]) {
//           neighbor.neighbors[i].neighbors[0].obstacle = true
//           neighbor.neighbors[i].neighbors[0].growableTileId = defaultMapSettings.terrainTypeId
//         }

//         if (neighbor.neighbors[i].neighbors[1]) {
//           neighbor.neighbors[i].neighbors[1].obstacle = true
//           neighbor.neighbors[i].neighbors[1].growableTileId = defaultMapSettings.terrainTypeId
//         }

//         if (neighbor.neighbors[i].neighbors[4]) {
//           neighbor.neighbors[i].neighbors[4].obstacle = true
//           neighbor.neighbors[i].neighbors[4].growableTileId = defaultMapSettings.terrainTypeId
//         }
//       }

//       this.populateCell(neighbor.neighbors[i], neighborIndex++, weight, defaultMapSettings)
//     }

//   } else {
//     return
//   }
// }

// function clearObstacles(width: number, height: number): void {
//   for(let h = 0; h < height; h++) {
//     for(let w = 0; w < width; w++) {
//       grid[`x${w}:y${h}`] = false
//     }
//   }
// }

// //////////////////////////

// function generateMap(width: number, height: number, mapDetails: DefaultMapSettings): GameMap {
//   const map = GSM.Map.createNewGrid(width, height, mapDetails)
//   const randomLeft = Math.floor(Math.random() * ((height - 10) - 10 + 1) + 10)
//   const randomRight = Math.floor(Math.random() * ((height - 10) - 10 + 1) + 10)

//   this.addPortalMarkerIcons(map, randomLeft, randomRight)
//   this.autoFillBackgroundTerrain(mapDetails.backgroundTypeId)
//   this.autoPopulateForegroundTerrain(mapDetails, randomLeft, randomRight)
//   map.defaultSettings = mapDetails
//   return map
// }

// function generateAttachmentMap(transitionFromMap: GameMap, mapDetails: DefaultMapSettings, pageTransitionMarker: PageTransitionMarker): GameMap {
//   const map = GSM.Map.createNewGrid(transitionFromMap.width, transitionFromMap.height, mapDetails)
//   const randomLeft = Math.floor(Math.random() * ((transitionFromMap.height - 10) - 10 + 1) + 10)
//   const randomRight = Math.floor(Math.random() * ((transitionFromMap.height - 10) - 10 + 1) + 10)
  
//   if (pageTransitionMarker.position === MapPosition.left) {
//     addPortalMarkerIcons(map, randomLeft, randomRight, pageTransitionMarker, null)
//   }
//   if (pageTransitionMarker.position === MapPosition.right) {
//     addPortalMarkerIcons(map, randomLeft, randomRight, null, pageTransitionMarker)
//   }
  
//   autoFillBackgroundTerrain(mapDetails.backgroundTypeId)
//   autoPopulateForegroundTerrain(mapDetails, randomLeft, randomRight)
//   map.defaultSettings = mapDetails
//   return map
// }

// function autoPopulateForegroundTerrain(defaultMapSettings: any, randomLeft: number, randomRight: number): void {
//   let path

//   // Places random obstacles in the map to make the path somewhat wind around
//   for (let i = 0; i < 5; i++) {
//     try {
//       clearObstacles(defaultMapSettings.width, defaultMapSettings.height)
//       randomlyPlaceInvisibleObstacles(defaultMapSettings.width, defaultMapSettings.height)
//       path = ShortestPath.find(grid[`x0:y${randomLeft}`], grid[`x${defaultMapSettings.width - 2}:y${randomRight}`], [])

//     } catch { }
//   }
//   clearObstacles(defaultMapSettings.width, defaultMapSettings.height)

//   // Adds random objects like trees or cliffs
//   addRandomTerrain(defaultMapSettings)

//   // Creates a drawn path if desired
//   path.forEach((cell: any) => {
//     if (cell.neighbors[0]) { cell.neighbors[0].backgroundGrowableTileId = defaultMapSettings.pathTypeId }
//     if (cell.neighbors[1]) { cell.neighbors[1].backgroundGrowableTileId = defaultMapSettings.pathTypeId }
//     if (cell.neighbors[4]) { cell.neighbors[4].backgroundGrowableTileId = defaultMapSettings.pathTypeId }
//     cell.backgroundGrowableTileId = defaultMapSettings.pathTypeId
//   })

//   // creates a randomized boarder to encapsulate the map
//   createRandomizedBoarder(defaultMapSettings)

//   // clears all obstacles from path
//   clearOpening(path)
//   terrainCleanup()
//  }

// function setEdgeLayerRandomization(cell: any, neighborIndex: number, defaultMapSettings: any): void {
//   const random = !!!Math.floor(Math.random() * 2)
//   if (random) {
//     if (cell.neighbors[neighborIndex]) {
//       cell.neighbors[neighborIndex].obstacle = true
//       cell.neighbors[neighborIndex].growableTileId = defaultMapSettings.terrainTypeId
//     }

//     cell.obstacle = true
//     cell.growableTileId = defaultMapSettings.terrainTypeId
//   }
// }

// function randomlyPlaceInvisibleObstacles(width: number, height: number): void {
//   for(let h = 0; h < height; h++) {
//     for(let w = 0; w < width; w++) {
//       grid[`x${w}:y${h}`].obstacle = !!!Math.floor(Math.random() * 4)
//     }
//   }
// }

// ////////////////////////////

// function createDisplayArray(width: number, height: number, terrainTypeId: string) {
//   let imgIndexX = 1
//   let imgIndexY = 1

//   for (let i = 0; i < height; i++) {
//     for (let l = 0; l < width; l++) {
//       grid[`x${l}:y${i}`] = grid[`x${l}:y${i}`]
//         || {
//           x: l,
//           y: i,
//           posX: l * 32,
//           posY: i * 32,
//           obstacle: false,
//           id: `x${l}:y${i}`,
//           growableTileId: undefined
//         };

//       imgIndexX++

//       if (imgIndexX > 3 && imgIndexY < 3) {
//         imgIndexX = 1
//         imgIndexY++
//       } else if (imgIndexX > 3 && imgIndexY >= 3) {
//         imgIndexX = 1
//         imgIndexY = 1
//       }
//     }
//   }
// }

// function addNeighbors(width: number, height: number) {
//   for (let i = 0; i < height; i++) {
//     for (let l = 0; l < width; l++) {
//       const cell = grid[`x${l}:y${i}`];
//       cell.neighbors = [];
//       cell.neighbors[5] = grid[`x${l + 1}:y${i + 1}`];
//       cell.neighbors[0] = grid[`x${l}:y${i - 1}`];
//       cell.neighbors[2] = grid[`x${l}:y${i + 1}`];
//       cell.neighbors[4] = grid[`x${l + 1}:y${i - 1}`];
//       cell.neighbors[1] = grid[`x${l + 1}:y${i}`];
//       cell.neighbors[6] = grid[`x${l - 1}:y${i + 1}`];
//       cell.neighbors[3] = grid[`x${l - 1}:y${i}`];
//       cell.neighbors[7] = grid[`x${l - 1}:y${i - 1}`];
//     }
//   }
// }

// function generateGridFeatures(width: number, height: number, terrainTypeId: string) {
//   createDisplayArray(width, height, terrainTypeId)
//   // addNeighbors(width, height)
// }

// addEventListener('message', ({ data }) => {
//   const mapDetails = {
//     autoGeneratedMap: true,
//     backgroundTypeId: "greenGrass",
//     terrainTypeId: "DrawableTrees",
//     inverted: false,
//     pathTypeId: "DrawableDirtRoad",
//     width: 100,
//     height: 100,
//   }

//   generateGridFeatures(100, 100, mapDetails.terrainTypeId)
//   postMessage(JSON.stringify(grid))
// });
