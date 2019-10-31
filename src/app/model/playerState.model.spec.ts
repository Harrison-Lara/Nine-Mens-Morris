import { async } from '@angular/core/testing';
import { Color } from './enum/color.enum';
import { PlayerState } from './playerState.model'
import { PlayerType } from './enum/playerType.enum';

describe('Player State Model', () => {
  it('should return the player state constructor', async(() => {

    const player = new PlayerState(Color.GOLD, PlayerType.HUMAN)
    expect(player).toEqual({ "color": "GOLD", "piecesInDrawer": 9, "piecesOnBoard": 0, "playerType": "HUMAN", "points": 0 })
  }));
});
