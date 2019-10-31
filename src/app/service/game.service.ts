import { Injectable } from '@angular/core';
import { Color, getOpponentColor } from '../model/enum/color.enum';
import { changeColor, INode } from '../model/node.model';
import { MoveType } from '../model/enum/moveType.enum';
import { MoveResult } from '../model/enum/moveResult.enum';
import { IPlayerState } from '../model/playerState.model';
import { GameState, IGameState } from '../model/gameState.model';
import { cloneDeep } from 'lodash';
import { BasicMove, ShiftMove } from '../model/move.model';
import { HeuristicsType } from '../model/enum/heuristicsType.enum';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() {
  }
  private boardCenter = 3;

  private static compareNodesPosition(node1: INode, node2: INode): boolean {
    return node1.x === node2.x && node1.y === node2.y;
  }

  clone(gameState: IGameState): GameState {
    return cloneDeep(gameState);
  }

  private getLastMovedPiece(gameState: IGameState): INode {
    switch (gameState.turn) {
      case Color.GOLD:
        return gameState.goldPlayerState.lastMovedPiece;
      case Color.BLUE:
        return gameState.bluePlayerState.lastMovedPiece;
    }
  }

  private getPreviousPosition(gameState: IGameState): INode {
    switch (gameState.turn) {
      case Color.GOLD:
        return gameState.goldPlayerState.previousPosition;
      case Color.BLUE:
        return gameState.bluePlayerState.previousPosition;
    }
  }

  private setLastMove(gameState: IGameState, previousPosition: INode, lastMovedPiece: INode) {
    switch (previousPosition.color) {
      case Color.GOLD:
        gameState.goldPlayerState.previousPosition = previousPosition;
        gameState.goldPlayerState.lastMovedPiece = lastMovedPiece;
        break;
      case Color.BLUE:
        gameState.bluePlayerState.previousPosition = previousPosition;
        gameState.bluePlayerState.lastMovedPiece = lastMovedPiece;
        break;
    }
  }

  isMoveAllowed(gameState: IGameState, selectedNode: INode): boolean {
    return gameState.allowedMoves.find(node => GameService.compareNodesPosition(node, selectedNode)) != null;
  }

  private findDestinationsForNormalMove(gameState: IGameState): INode[] {
    const pieces: INode[] = gameState.nodes.filter(node => node.color === Color.GRAY);
    return pieces;
  }

  private findDestinationsForOpponentRemove(gameState: IGameState): INode[] {
    const filtered = gameState.nodes.filter(piece => piece.color === getOpponentColor(gameState.turn));
    const piecesNotInMills = this.findPiecesNotInMills(filtered, getOpponentColor(gameState.turn));
    if (piecesNotInMills.length > 0) {
      return piecesNotInMills;
    } else {
      return filtered;
    }
  }

  private findPiecesNotInMills(pieces: INode[], color: Color): INode[] {
    let temp: INode[] = [];
    for (let i = 0; i < 7; ++i) {
      const xPieces = pieces.filter(piece => piece.x === i && piece.color === color);
      const yPieces = pieces.filter(piece => piece.y === i && piece.color === color);
      if (i === 3) {
        temp = this.addToResultWhenInMill(temp, xPieces.filter(piece => piece.y < 3));
        temp = this.addToResultWhenInMill(temp, xPieces.filter(piece => piece.y > 3));
        temp = this.addToResultWhenInMill(temp, yPieces.filter(piece => piece.x < 3));
        temp = this.addToResultWhenInMill(temp, yPieces.filter(piece => piece.x > 3));
      }
      temp = this.addToResultWhenInMill(temp, xPieces);
      temp = this.addToResultWhenInMill(temp, yPieces);
    }
    let result: INode[] = pieces;
    for (const pieceTemp of temp) {
      result = result.filter(piece => !(piece.x === pieceTemp.x && piece.y === pieceTemp.y));
    }
    return result;
  }

  private addToResultWhenInMill(result: INode[], possibleMill: INode[]): INode[] {
    if (possibleMill.length === 3) {
      result = [...result, ...possibleMill];
    }
    return result;
  }

  private findShiftSources(gameState: IGameState): INode[] {
    return gameState.nodes.filter(piece => piece.color === gameState.turn);
  }


  isShiftToAllowed(gameState: IGameState, selectedNode: INode, destinationNode: INode): boolean {
    if (selectedNode.color !== gameState.turn) {
      return false;
    }
    switch (gameState.moveType) {
      case MoveType.MOVE_NEARBY:
        return this.findDestinationsForNearbyMove(gameState, selectedNode)
          .find(node => GameService.compareNodesPosition(node, destinationNode)) != null;
      case MoveType.MOVE_ANYWHERE:
        return gameState.nodes.find(node => node.color === Color.GRAY && GameService.compareNodesPosition(node, destinationNode)) != null;
      default:
        return false;
    }
  }

  private putPieceOnBoard(gameState: IGameState, destination: INode, isShifting: boolean): MoveResult {
    const currentPlayer = this.getCurrentPlayer(gameState);

    let operationPossible: boolean = isShifting;

    if (currentPlayer.piecesInDrawer > 0) {
      currentPlayer.piecesInDrawer--;
      operationPossible = true;
    }

    if (operationPossible) {
      changeColor(destination, gameState.turn);
      if (!isShifting) {
        this.getCurrentPlayer(gameState).piecesOnBoard++;
      }

      const pieces = gameState.nodes.filter(c => c.color === gameState.turn);
      const mill = this.checkForMill(pieces, destination);
      if (mill > 0) {
        gameState.movesWithoutMill = 0;
      } else {
        gameState.movesWithoutMill++;
      }
      switch (mill) {
        case 1:
          gameState.moveType = MoveType.REMOVE_OPPONENT;
          gameState.allowedMoves = this.findDestinationsForOpponentRemove(gameState);
          return MoveResult.CHANGED_STATE_TO_REMOVE;
        case 2:
          gameState.moveType = MoveType.REMOVE_OPPONENT_2;
          gameState.allowedMoves = this.findDestinationsForOpponentRemove(gameState);
          return MoveResult.CHANGED_STATE_TO_REMOVE;
      }
      return MoveResult.FINISHED_TURN;
    }
    return MoveResult.MOVE_NOT_ALLOWED;
  }

  private checkForMill(pieces: INode[], newPiece: INode): number {
    let result = 0;
    if (newPiece.x === 3) {
      if (pieces.filter(piece => piece.x === newPiece.x &&
        ((newPiece.y > 3 && piece.y > 3) || (newPiece.y < 3 && piece.y < 3))).length === 3) {
        result++;
      }
    } else {
      if (pieces.filter(piece => piece.x === newPiece.x).length === 3) {
        result++;
      }
    }

    if (newPiece.y === 3) {
      if (pieces.filter(piece => piece.y === newPiece.y &&
        ((newPiece.x > 3 && piece.x > 3) || (newPiece.x < 3 && piece.x < 3))).length === 3) {
        result++;
      }
    } else {
      if (pieces.filter(piece => piece.y === newPiece.y).length === 3) {
        result++;
      }
    }
    return result;
  }

  getCurrentPlayer(gameState: IGameState): IPlayerState {
    switch (gameState.turn) {
      case Color.GOLD:
        return gameState.goldPlayerState;
      case Color.BLUE:
        return gameState.bluePlayerState;
    }
  }

  getOpponentPlayer(gameState: IGameState): IPlayerState {
    switch (gameState.turn) {
      case Color.GOLD:
        return gameState.bluePlayerState;
      case Color.BLUE:
        return gameState.goldPlayerState;
    }
  }

  private findDestinationsForNearbyMove(gameState: IGameState, chosenNode: INode): INode[] {
    const foundNodes: INode[] = gameState.nodes.filter(node => node.color === Color.GRAY);
    const result: INode[] = [];

    for (const node of foundNodes) {
      if (Math.abs(this.boardCenter - chosenNode.x) === Math.abs(this.boardCenter - chosenNode.y)) {
        if ((node.x === chosenNode.x && node.y === this.boardCenter) || (node.x === this.boardCenter && node.y === chosenNode.y)) {
          result.push(node);
        }
      } else if (chosenNode.x === this.boardCenter) {
        if ((node.y === chosenNode.y
          && (node.x === chosenNode.x + Math.abs(this.boardCenter - chosenNode.y)
            || node.x === chosenNode.x - Math.abs(this.boardCenter - chosenNode.y))
        ) || (node.x === this.boardCenter && (node.y === chosenNode.y + 1 || node.y === chosenNode.y - 1))) {
          result.push(node);
        }

      } else if (chosenNode.y === this.boardCenter) {
        if ((node.x === chosenNode.x
          && (node.y === chosenNode.y + Math.abs(this.boardCenter - chosenNode.x)
            || node.y === chosenNode.y - Math.abs(this.boardCenter - chosenNode.x))
        ) || (node.y === this.boardCenter && (node.x === chosenNode.x + 1 || node.x === chosenNode.x - 1))) {
          result.push(node);
        }
      }
    }
    const lastMove = this.getLastMovedPiece(gameState);
    const previousPosition = this.getPreviousPosition(gameState);

    if (lastMove && GameService.compareNodesPosition(lastMove, chosenNode) && previousPosition) {
      return result.filter(node => !GameService.compareNodesPosition(node, previousPosition));
    } else {
      return result;
    }
  }


  private findDestinationsForAnywhereMove(gameState: IGameState, chosenNode: INode): INode[] {
    const result: INode[] = gameState.nodes.filter(node => node.color === Color.GRAY);
    const lastMove = this.getLastMovedPiece(gameState);
    const previousPosition = this.getPreviousPosition(gameState);
    if (lastMove && GameService.compareNodesPosition(lastMove, chosenNode) && previousPosition) {
      return result.filter(node => !GameService.compareNodesPosition(node, previousPosition));
    } else {
      return result;
    }
  }

  private performNormalMove(gameState: IGameState, selectedNode: INode): MoveResult {
    if (this.isMoveAllowed(gameState, selectedNode)) {
      gameState.moveCount++;
      gameState.moves.push(new BasicMove(gameState.moveCount, gameState.turn, gameState.moveType, selectedNode));
      return this.putPieceOnBoard(gameState, selectedNode, false);
    }
    return MoveResult.MOVE_NOT_ALLOWED;
  }

  private performRemoveMove(gameState: IGameState, selectedNode: INode): MoveResult {
    const removeAllowed = this.isMoveAllowed(gameState, selectedNode);
    if (removeAllowed && selectedNode.x != null && selectedNode.y != null) {
      changeColor(selectedNode, Color.GRAY);
      this.getCurrentPlayer(gameState).points++;
      this.getOpponentPlayer(gameState).piecesOnBoard--;
      if (gameState.moveType === MoveType.REMOVE_OPPONENT_2) {
        gameState.moves.push(new BasicMove(gameState.moveCount, gameState.turn, gameState.moveType, selectedNode));
        gameState.moveType = MoveType.REMOVE_OPPONENT;
        return MoveResult.CHANGED_STATE_TO_REMOVE;
      } else {
        gameState.moves.push(new BasicMove(gameState.moveCount, gameState.turn, gameState.moveType, selectedNode));
        return MoveResult.FINISHED_TURN;
      }
    }
    return MoveResult.MOVE_NOT_ALLOWED;
  }

  private performShift(gameState: IGameState, selectedNode: INode): MoveResult {
    if (this.isMoveAllowed(gameState, selectedNode)) {
      gameState.chosenForShift = selectedNode;
      switch (gameState.moveType) {
        case MoveType.MOVE_NEARBY:
          gameState.shiftDestinations = this.findDestinationsForNearbyMove(gameState, selectedNode);
          break;
        case MoveType.MOVE_ANYWHERE:
          gameState.shiftDestinations = this.findDestinationsForAnywhereMove(gameState, selectedNode);
          break;
        default:
          return MoveResult.MOVE_NOT_ALLOWED;
      }
      return MoveResult.SELECTED_TO_SHIFT;
    } else if (gameState.chosenForShift && this.isShiftToAllowed(gameState, gameState.chosenForShift, selectedNode)) {
      gameState.shiftDestinations = [];
      const chosen = gameState.chosenForShift;
      gameState.chosenForShift = null;

      this.setLastMove(gameState, chosen, selectedNode);
      changeColor(chosen, Color.GRAY);
      gameState.moveCount++;
      gameState.moves.push(new ShiftMove(gameState.moveCount, gameState.turn, gameState.moveType, chosen, selectedNode));
      return this.putPieceOnBoard(gameState, gameState.nodes.find(node => node.x === selectedNode.x && node.y === selectedNode.y), true);
    }
    return MoveResult.MOVE_NOT_ALLOWED;
  }

  performMove(gameState: IGameState, selectedNode: INode): MoveResult {
    let moveResult = MoveResult.MOVE_NOT_ALLOWED;
    switch (gameState.moveType) {
      case MoveType.NORMAL:
        moveResult = this.performNormalMove(gameState, selectedNode);
        break;
      case MoveType.REMOVE_OPPONENT:
      case MoveType.REMOVE_OPPONENT_2:
        moveResult = this.performRemoveMove(gameState, selectedNode);
        break;
      case MoveType.MOVE_NEARBY:
      case MoveType.MOVE_ANYWHERE:
        moveResult = this.performShift(gameState, selectedNode);
        break;
      case MoveType.END_GAME:
        moveResult = MoveResult.END_GAME;
        break;
      default:
        moveResult = MoveResult.MOVE_NOT_ALLOWED;
        break;
    }

    if (moveResult === MoveResult.FINISHED_TURN) {
      return this.initNewTurn(gameState);
    }
    return moveResult;
  }

  private initNewTurn(gameState: IGameState): MoveResult {
    gameState.turn = getOpponentColor(gameState.turn);

    const availablePieces = this.getCurrentPlayer(gameState).piecesInDrawer;
    const usedPieces = this.getCurrentPlayer(gameState).piecesOnBoard;

    const allPieces = usedPieces + availablePieces;

    if (allPieces < 3) {
      gameState.moveType = MoveType.END_GAME;
    } else if (gameState.movesWithoutMill >= 50) {
      if (gameState.bluePlayerState.points === gameState.goldPlayerState.points) {
        gameState.moveType = MoveType.DRAW;
      } else {
        gameState.moveType = MoveType.END_GAME;
      }
    } else if (availablePieces > 0) {
      gameState.moveType = MoveType.NORMAL;
    } else if (usedPieces === 3) {
      if (this.checkIfAnyCanMoveNearby(gameState)) {
        gameState.moveType = MoveType.MOVE_ANYWHERE;
      } else {
        gameState.moveType = MoveType.END_GAME;
      }
    } else if (availablePieces === 0) {
      gameState.moveType = MoveType.MOVE_NEARBY;
    }

    if (gameState.moveType === MoveType.END_GAME || gameState.moveType === MoveType.DRAW) {
      if (this.getOpponentPlayer(gameState).points > this.getCurrentPlayer(gameState).points) {
        gameState.turn = this.getOpponentPlayer(gameState).color;
      }
      return MoveResult.END_GAME;
    } else {
      switch (gameState.moveType) {
        case MoveType.NORMAL:
          gameState.allowedMoves = this.findDestinationsForNormalMove(gameState);
          break;
        case MoveType.MOVE_NEARBY:
        case MoveType.MOVE_ANYWHERE:
          gameState.allowedMoves = this.findShiftSources(gameState);
          break;
      }

      return MoveResult.FINISHED_TURN;
    }
  }


  private checkIfAnyCanMoveNearby(gameState: IGameState): boolean {
    const currentPlayerPieces = gameState.nodes.filter(node => node.color === gameState.turn);
    for (const piece of currentPlayerPieces) {
      if (this.findDestinationsForNearbyMove(gameState, piece).length > 0) {
        return true;
      }
    }
    return false;
  }

  public getPotentialNextMove(gameState: IGameState): IGameState[] {
    let destinations: INode[] = [];
    switch (gameState.moveType) {
      case MoveType.NORMAL:
        destinations = gameState.allowedMoves;
        break;
      case MoveType.MOVE_NEARBY:
      case MoveType.MOVE_ANYWHERE:
        destinations = this.findShiftSources(gameState);
        break;
      default:
        break;
    }
    return this.getPonetialNextMoveDestinations(gameState, destinations);
  }

  private getPonetialNextMoveDestinations(gameState: IGameState, destinations: INode[]): IGameState[] {
    let result: IGameState[] = [];
    for (const possibleMove of destinations) {
      const newGameState = this.clone(gameState);
      const moveDestination = newGameState.nodes.find(node => GameService.compareNodesPosition(node, possibleMove));
      switch (this.performMove(newGameState, moveDestination)) {
        case MoveResult.CHANGED_STATE_TO_REMOVE:
          result = [...result, ...this.getPonetialNextMoveDestinations(newGameState, newGameState.allowedMoves)];
          break;
        case MoveResult.SELECTED_TO_SHIFT:
          result = [...result, ...this.getPonetialNextMoveDestinations(newGameState, newGameState.shiftDestinations)];
          break;
        case MoveResult.FINISHED_TURN:
        case MoveResult.END_GAME:
          result.push(newGameState);
          break;
        case MoveResult.MOVE_NOT_ALLOWED:
          break;
        default:
          break;
      }

    }
    return result;
  }

  getValue(gameState: IGameState, heuristics: HeuristicsType): number {
    switch (heuristics) {
      case HeuristicsType.NAIVE:
        return this.getValueNaive(gameState);
      case HeuristicsType.ALMOST_MILL:
        return this.getValueAlmostMill(gameState);
    }
  }

  getValueNaive(gameState: IGameState): number {
    let gameOverMultiplier = 1;
    if (gameState.moveType === MoveType.END_GAME) {
      gameOverMultiplier = 10;
    } else if (gameState.moveType === MoveType.DRAW) {
      gameOverMultiplier = 0;
    }
    return ((gameState.bluePlayerState.points - gameState.goldPlayerState.points)
      / (gameState.bluePlayerState.points + gameState.goldPlayerState.points + 1)) * gameOverMultiplier;
  }

  getValueAlmostMill(gameState: IGameState): number {
    const valueNaive = this.getValueNaive(gameState);
    if (valueNaive !== 0) {
      const almostMills = this.countAlmostMills(gameState.nodes, Color.BLUE) - this.countAlmostMills(gameState.nodes, Color.GOLD);
      return valueNaive * 10 + almostMills;
    } else {
      return 0;
    }
  }

  private countAlmostMills(pieces: INode[], color: Color): number {
    let result = 0;
    for (let i = 0; i < 7; ++i) {
      const xPieces = pieces.filter(piece => piece.x === i && piece.color === color);
      const yPieces = pieces.filter(piece => piece.y === i && piece.color === color);
      if (i === 3) {
        if (xPieces.filter(piece => piece.y < 3).length === 2
          && !pieces.find(piece => piece.x === i && piece.y < 3 && piece.color === getOpponentColor(color))) {
          result++;
        }
        if (xPieces.filter(piece => piece.y > 3).length === 2
          && !pieces.find(piece => piece.x === i && piece.y > 3 && piece.color === getOpponentColor(color))) {
          result++;
        }
        if (yPieces.filter(piece => piece.x < 3).length === 2
          && !pieces.find(piece => piece.y === i && piece.x < 3 && piece.color === getOpponentColor(color))) {
          result++;
        }
        if (yPieces.filter(piece => piece.x > 3).length === 2
          && !pieces.find(piece => piece.y === i && piece.x < 3 && piece.color === getOpponentColor(color))) {
          result++;
        }
      } else {
        if (xPieces.length === 2 && !pieces.find(piece => piece.x === i && piece.color === getOpponentColor(color))) {
          result++;
        }
        if (yPieces.length === 2 && !pieces.find(piece => piece.y === i && piece.color === getOpponentColor(color))) {
          result++;
        }
      }
    }
    return result;
  }
}
