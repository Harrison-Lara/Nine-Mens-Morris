import { async } from '@angular/core/testing';
import { GameState } from './gameState.model'
import { PlayerType } from './enum/playerType.enum';

describe('Game State Model', () => {
  it('should return the Game State', async(() => {

    const game = new GameState(PlayerType.HUMAN, PlayerType.HUMAN)
    const expectedResult = {
      "allowedMoves": [{ "color": "GRAY", "radius": 1, "x": 0, "y": 0 }, { "color": "GRAY", "radius": 1, "x": 0, "y": 3 }, { "color": "GRAY", "radius": 1, "x": 0, "y": 6 }, { "color": "GRAY", "radius": 1, "x": 1, "y": 1 }, { "color": "GRAY", "radius": 1, "x": 1, "y": 3 }, { "color": "GRAY", "radius": 1, "x": 1, "y": 5 }, { "color": "GRAY", "radius": 1, "x": 2, "y": 2 }, { "color": "GRAY", "radius": 1, "x": 2, "y": 3 }, { "color": "GRAY", "radius": 1, "x": 2, "y": 4 }, { "color": "GRAY", "radius": 1, "x": 3, "y": 0 }, {
        "color": "GRAY", "radius": 1, "x": 3, "y":
          1
      }, { "color": "GRAY", "radius": 1, "x": 3, "y": 2 }, { "color": "GRAY", "radius": 1, "x": 3, "y": 4 }, {
        "color": "GRAY", "radius": 1, "x": 3,
        "y": 5
      }, { "color": "GRAY", "radius": 1, "x": 3, "y": 6 }, { "color": "GRAY", "radius": 1, "x": 4, "y": 2 }, { "color": "GRAY", "radius": 1, "x": 4, "y": 3 }, { "color": "GRAY", "radius": 1, "x": 4, "y": 4 }, { "color": "GRAY", "radius": 1, "x": 5, "y": 1 }, { "color": "GRAY", "radius": 1, "x": 5, "y": 3 }, { "color": "GRAY", "radius": 1, "x": 5, "y": 5 }, { "color": "GRAY", "radius": 1, "x": 6, "y": 0 }, { "color": "GRAY", "radius": 1, "x": 6, "y": 3 }, { "color": "GRAY", "radius": 1, "x": 6, "y": 6 }], "bluePlayerState": { "color": "BLUE", "piecesInDrawer": 9, "piecesOnBoard": 0, "playerType": "HUMAN", "points": 0 }, "goldPlayerState": { "color": "GOLD", "piecesInDrawer": 9, "piecesOnBoard": 0, "playerType": "HUMAN", "points": 0 }, "moveCount": 0, "moveType": "NORMAL", "moves": [], "movesWithoutMill": 0, "nodes": [{ "color": "GRAY", "radius": 1, "x": 0, "y": 0 }, { "color": "GRAY", "radius": 1, "x": 0, "y": 3 }, { "color": "GRAY", "radius": 1, "x": 0, "y": 6 }, { "color": "GRAY", "radius": 1, "x": 1, "y": 1 }, { "color": "GRAY", "radius": 1, "x": 1, "y": 3 }, { "color": "GRAY", "radius": 1, "x": 1, "y": 5 }, { "color": "GRAY", "radius": 1, "x": 2, "y": 2 }, { "color": "GRAY", "radius": 1, "x": 2, "y": 3 }, { "color": "GRAY", "radius": 1, "x": 2, "y": 4 }, { "color": "GRAY", "radius": 1, "x": 3, "y": 0 }, { "color": "GRAY", "radius": 1, "x": 3, "y": 1 }, { "color": "GRAY", "radius": 1, "x": 3, "y": 2 }, {
        "color":
          "GRAY", "radius": 1, "x": 3, "y": 4
      }, { "color": "GRAY", "radius": 1, "x": 3, "y": 5 }, { "color": "GRAY", "radius": 1, "x": 3, "y": 6 }, { "color": "GRAY", "radius": 1, "x": 4, "y": 2 }, { "color": "GRAY", "radius": 1, "x": 4, "y": 3 }, { "color": "GRAY", "radius": 1, "x": 4, "y": 4 },
      { "color": "GRAY", "radius": 1, "x": 5, "y": 1 }, { "color": "GRAY", "radius": 1, "x": 5, "y": 3 }, { "color": "GRAY", "radius": 1, "x": 5, "y": 5 }, { "color": "GRAY", "radius": 1, "x": 6, "y": 0 }, { "color": "GRAY", "radius": 1, "x": 6, "y": 3 }, { "color": "GRAY", "radius": 1, "x": 6, "y": 6 }], "shiftDestinations": [], "turn": "GOLD"
    }
    expect(game).toEqual(expectedResult)
  }))
})
