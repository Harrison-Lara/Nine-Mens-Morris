import { async } from '@angular/core/testing';
import { largeScreen } from './resize.service'

describe('Resize Service', () => {
  it('should return the largeScreen window size', async(() => {

    const windowSize = largeScreen()
    expect(windowSize).toEqual(false)
  }))
});
