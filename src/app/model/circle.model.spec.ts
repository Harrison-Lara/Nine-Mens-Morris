import { async } from '@angular/core/testing';
import { changeColor, Circle } from './circle.model';
import { Color } from './enum/color.enum';

describe('Circle Model', () => {
  it('should output the radius if gray', async(() => {
    const testCircle = new Circle(0, 0, 2);
    changeColor(testCircle, Color.GRAY);
    expect(testCircle.radius).toEqual(1);
  }));
});

//remove this when tests are written
//test.skip('skip', () => { }) 