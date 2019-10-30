import { async, TestBed } from '@angular/core/testing';
import { changeColor, Node } from './node.model';
import { Color } from './enum/color.enum';

describe('Node Model', () => {
    it('should output the radius if gray', async(() => {
      const testCircle = new Node(0, 0, 2);
      changeColor(testCircle, Color.GRAY);
      expect(testCircle.radius).toEqual(1);
    }));
  });

//test.skip('skip', () => { }) //remove this when tests are written