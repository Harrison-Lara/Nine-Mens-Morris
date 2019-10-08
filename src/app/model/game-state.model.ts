import { Color } from "./enum/color.enum";
import { MoveType } from "./enum/move-type.enum";
import { Circle, ICircle } from "./circle.model";
import { IPlayerState, PlayerState } from "./player-state.model";
import { PlayerType } from "./enum/player-type.enum";
import { IMove } from "./move.model";

export interface IGameState {
  turn: Color;
  moveType: MoveType;
  circles: ICircle[];
  shiftDestinations: ICircle[];
  goldPlayerState: IPlayerState;
  bluePlayerState: IPlayerState;
  chosenForShift: ICircle;
  allowedMoves: ICircle[];
  moveCount: number;
  moves: IMove[];
  movesWithoutMill: number;
}

const boardCenter = 3;
const boardSize = 7;

export class GameState implements IGameState {
  chosenForShift: ICircle;

  turn: Color = Color.GOLD;
  moveType: MoveType = MoveType.NORMAL;
  circles: ICircle[] = [];
  shiftDestinations: ICircle[] = [];
  goldPlayerState: IPlayerState;
  bluePlayerState: IPlayerState;
  allowedMoves: ICircle[];
  moveCount: number;
  moves: IMove[] = [];
  movesWithoutMill = 0;

  constructor(goldPlayerType: PlayerType, bluePlayerType: PlayerType) {
    this.goldPlayerState = new PlayerState(Color.GOLD, goldPlayerType);
    this.bluePlayerState = new PlayerState(Color.BLUE, bluePlayerType);

    this.allowedMoves = this.circles;
    this.moveCount = 0;

    this.goldPlayerState.piecesOnBoard = 0;
    this.bluePlayerState.piecesOnBoard = 0;

    for (let x = 0; x < boardSize; ++x) {
      for (let y = 0; y < boardSize; ++y) {
        if ((Math.abs(x - boardCenter) === Math.abs(y - boardCenter) || x === boardCenter || y === boardCenter)
          && !(x === boardCenter && y === boardCenter)) {
          this.circles.push(new Circle(x, y, 1));
        }
      }
    }
  }

}

