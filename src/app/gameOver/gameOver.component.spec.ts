import { async } from '@angular/core/testing';
import { GameOverComponent } from './gameOver.component';

describe('Game Over Component', () => {
  it('should return the Game Over Component', async(() => {

    const gameOver = GameOverComponent;
    expect(gameOver).toHaveLength(2)
  }))
});