import { async } from '@angular/core/testing';
import { Position } from './position.model'

describe('Position Model', () => {
  it('should return the player state constructor', async(() => {

    const location = new Position(1, 2)
    expect(location).toEqual({ "x": 1, "y": 2 })
  }))
});
