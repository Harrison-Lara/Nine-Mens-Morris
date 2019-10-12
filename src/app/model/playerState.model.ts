import { INode } from "./node.model";
import { Color } from "./enum/color.enum";

export interface IPlayerState {
  piecesInDrawer: number;
  piecesOnBoard: number;
  points: number;
  color: Color;
  previousPosition: INode;
  lastMovedPiece: INode;
}

export class PlayerState implements IPlayerState {
  piecesInDrawer: number;
  piecesOnBoard: number;
  points: number;

  previousPosition: INode;
  lastMovedPiece: INode;

  constructor(public color: Color, public playerType) {
    this.piecesInDrawer = 9;
    this.points = 0;
    this.piecesOnBoard = 0;
  }
}

