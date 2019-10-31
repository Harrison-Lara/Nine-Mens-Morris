import { async } from '@angular/core/testing';
import { environment } from './environment.prod';

describe('Environment State', () => {
  it('should return production mode TRUE', async(() => {

    const env = environment;
    expect(env).toEqual({ "production": true })
  }))
});