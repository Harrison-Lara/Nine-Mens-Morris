import { Color } from './enum/color.enum';
import { MoveType } from './enum/moveType.enum';
import { Node, INode } from './node.model';
import { IPlayerState, PlayerState } from './playerState.model';
import { PlayerType } from './enum/playerType.enum';
import { IMove } from './move.model';

export interface IGameState {
  turn: Color;
  moveType: MoveType;
  nodes: INode[];
  shiftDestinations: INode[];
  goldPlayerState: IPlayerState;
  bluePlayerState: IPlayerState;
  chosenForShift: INode;
  allowedMoves: INode[];
  moveCount: number;
  moves: IMove[];
  movesWithoutMill: number;
}

const boardCenter = 3;
const boardSize = 7;

export class GameState implements IGameState {
  chosenForShift: INode;

  turn: Color = Color.GOLD;
  moveType: MoveType = MoveType.NORMAL;
  nodes: INode[] = [];
  shiftDestinations: INode[] = [];
  goldPlayerState: IPlayerState;
  bluePlayerState: IPlayerState;
  allowedMoves: INode[];
  moveCount: number;
  moves: IMove[] = [];
  movesWithoutMill = 0;

  constructor(goldPlayerType: PlayerType, bluePlayerType: PlayerType) {
    this.goldPlayerState = new PlayerState(Color.GOLD, goldPlayerType);
    this.bluePlayerState = new PlayerState(Color.BLUE, bluePlayerType);

    this.allowedMoves = this.nodes;
    this.moveCount = 0;

    this.goldPlayerState.piecesOnBoard = 0;
    this.bluePlayerState.piecesOnBoard = 0;

    for (let x = 0; x < boardSize; ++x) {
      for (let y = 0; y < boardSize; ++y) {
        if ((Math.abs(x - boardCenter) === Math.abs(y - boardCenter) || x === boardCenter || y === boardCenter)
          && !(x === boardCenter && y === boardCenter)) {
          this.nodes.push(new Node(x, y, 1));
        }
      }
    }
  }

}

