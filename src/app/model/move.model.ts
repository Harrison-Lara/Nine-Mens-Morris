import { MoveType } from './enum/moveType.enum';
import { INode } from './node.model';
import { Color } from './enum/color.enum';

export interface IMove {
  moveType: MoveType;
  moveDescription: string;
  color: Color;
  count: number;
}

export class BasicMove implements IMove {
  moveDescription: string;

  constructor(public count: number, public color: Color, public moveType: MoveType, destination: INode) {
    this.moveDescription = getStringCoords(destination.x, destination.y);
  }
}

export class ShiftMove implements IMove {
  moveDescription: string;

  constructor(public count: number, public color: Color, public moveType: MoveType, source: INode, destination: INode) {
    this.moveDescription = getStringCoords(source.x, source.y) + ' - ' + getStringCoords(destination.x, destination.y);
  }
}

function getStringCoords(x: number, y: number): string {
  return String.fromCharCode('A'.charCodeAt(0) + x) + y;
}
