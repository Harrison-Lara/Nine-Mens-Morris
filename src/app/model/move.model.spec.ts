import { async } from '@angular/core/testing';
import { Color } from './enum/color.enum';
import { getStringCoords, BasicMove, ShiftMove } from './move.model';
import { MoveType } from './enum/moveType.enum';
import { INode } from './node.model';

describe('Move Model', () => {
  it('should return location B2', async(() => {
    const coordinates = getStringCoords(1, 2);
    expect(coordinates).toEqual('B2')
  }));
  it('should return location D6', async(() => {
    const coordinates = getStringCoords(3, 6);
    expect(coordinates).toEqual('D6')
  }));
  it('should return the basicMove constructor', async(() => {
    const position: INode = {
      x: 1,
      y: 2,
      radius: 1,
      color: Color.GOLD
    }
    const move = new BasicMove(1, Color.BLUE, MoveType.NORMAL, position)
    expect(move).toEqual({ "color": "BLUE", "count": 1, "moveDescription": "B2", "moveType": "NORMAL" })
  }));
  it('should return the ShiftMove constructor', async(() => {
    const position1: INode = {
      x: 1,
      y: 2,
      radius: 1,
      color: Color.GOLD
    }
    const position2: INode = {
      x: 1,
      y: 3,
      radius: 1,
      color: Color.GOLD
    }
    const move = new ShiftMove(1, Color.BLUE, MoveType.NORMAL, position1, position2)
    expect(move).toEqual({ "color": "BLUE", "count": 1, "moveDescription": "B2 - B3", "moveType": "NORMAL" })
  }));
});
