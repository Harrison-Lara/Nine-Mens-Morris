import { async } from '@angular/core/testing';
import { PathCounter } from './pathCounter.model'

describe('Path Counter Model', () => {

  it('should return the Path Counter constructor', async(() => {
    const counter = new PathCounter();
    expect(counter).toEqual({ "counter": 0 });
  }))
  it('should increase the counter', async(() => {
    const counter = new PathCounter();
    expect(counter.increase()).toBeCalled;
  }))
});
