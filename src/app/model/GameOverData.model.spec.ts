import { async } from '@angular/core/testing';
import { Color } from './enum/color.enum';
import { GameOverData } from './gameOverData.model'
import { INode } from './node.model';
import { PlayerType } from './enum/playerType.enum';

describe('Game Over Model', () => {

  it('should return the Game Over Data constructor', async(() => {
    const move = new GameOverData(Color.GOLD, 20, 0, PlayerType.AI, PlayerType.HUMAN, 7, 1);
    expect(move).toBeTruthy();
  }))
});
