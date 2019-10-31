import { async } from '@angular/core/testing';
import { GameService } from './game.service'
import { Color } from '../model/enum/color.enum';
import { INode } from '../model/node.model';
import { MoveType } from '../model/enum/moveType.enum';
import { IMove } from '../model/move.model';
import { IPlayerState } from '../model/playerState.model';
import { HeuristicsType } from '../model/enum/heuristicsType.enum';

describe('Game Service', () => {

  const mockNode = {
    x: 1,
    y: 2,
    radius: 1,
    color: Color.GOLD
  }
  const nodes = [
    {
      x: 1,
      y: 2,
      radius: 1,
      color: Color.GOLD
    }
  ]

  const moves = [
    {
      moveType: MoveType.NORMAL,
      moveDescription: 'normal',
      color: Color.GOLD,
      count: 2
    }
  ]

  const playerState = {
    piecesInDrawer: 3,
    piecesOnBoard: 4,
    points: 1,
    color: Color.GOLD,
    previousPosition: mockNode,
    lastMovedPiece: mockNode
  }

  const mockGameState = {
    turn: Color.GOLD,
    moveType: MoveType.END_GAME,
    nodes: nodes,
    shiftDestinations: nodes,
    goldPlayerState: playerState,
    bluePlayerState: playerState,
    chosenForShift: mockNode,
    allowedMoves: nodes,
    moveCount: 5,
    moves: moves,
    movesWithoutMill: 2
  }

  const mockGameStateDraw = {
    turn: Color.GOLD,
    moveType: MoveType.DRAW,
    nodes: nodes,
    shiftDestinations: nodes,
    goldPlayerState: playerState,
    bluePlayerState: playerState,
    chosenForShift: mockNode,
    allowedMoves: nodes,
    moveCount: 5,
    moves: moves,
    movesWithoutMill: 2
  }

  it('should return the Game Service constructor', async(() => {

    const AI = new GameService()
    expect(AI).toEqual({ "boardCenter": 3 })
  }));

  it('should return the getValueAlmostMill -- End Game', async(() => {

    const AI = new GameService().getValueAlmostMill(mockGameState)
    expect(AI).toEqual(0)
  }));

  it('should return the getValueAlmostMill -- Draw', async(() => {

    const AI = new GameService().getValueAlmostMill(mockGameStateDraw)
    expect(AI).toEqual(0)
  }));

  it('should return the getValue NAIVE', async(() => {

    const naive = new GameService().getValue(mockGameState, HeuristicsType.NAIVE)
    expect(naive).toBeCalled
  }));

  it('should return the getValue ALMOST_MILL', async(() => {

    const almostMill = new GameService().getValue(mockGameState, HeuristicsType.ALMOST_MILL)
    expect(almostMill).toBeCalled
  }));

});
