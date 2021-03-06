import { async } from '@angular/core/testing';
import { changeColor, Circle } from './circle.model';
import { Color } from './enum/color.enum';

describe('Circle Model', () => {
  it('should output the radius of 1 when gray', async(() => {
    const testCircle = new Circle(0, 0, 2);
    changeColor(testCircle, Color.GRAY);
    expect(testCircle.radius).toEqual(1);
  }));
  it('should output the radius of 2 when NOT gray', async(() => {
    const testCircle = new Circle(0, 0, 2);
    changeColor(testCircle, Color.BLANK);
    expect(testCircle.radius).toEqual(2);
  }));
});
