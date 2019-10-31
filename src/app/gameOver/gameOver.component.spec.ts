import { async } from '@angular/core/testing';
import { GameOverComponent } from './gameOver.component';

describe('Help Component', () => {
  it('should return the Help Component', async(() => {

    const help = GameOverComponent;
    expect(help).toHaveLength(2)
  }))
});