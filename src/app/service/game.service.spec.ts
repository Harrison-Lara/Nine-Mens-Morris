import { async } from '@angular/core/testing';
import { GameService } from './game.service'
import { Color } from '../model/enum/color.enum';
import { MoveType } from '../model/enum/moveType.enum';
import { HeuristicsType } from '../model/enum/heuristicsType.enum';

describe('Game Service', () => {

  const mockNode = {
    x: 1,
    y: 2,
    radius: 1,
    color: Color.GOLD
  }

  const mockDestinationNode = {
    x: 2,
    y: 4,
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

    const constructor = new GameService()
    expect(constructor).toEqual({ "boardCenter": 3 })
  }));

  it('should return the getValueAlmostMill -- End Game', async(() => {

    const endGame = new GameService().getValueAlmostMill(mockGameState)
    expect(endGame).toEqual(0)
  }));

  it('should return the getValueAlmostMill -- Draw', async(() => {

    const draw = new GameService().getValueAlmostMill(mockGameStateDraw)
    expect(draw).toEqual(0)
  }));

  it('should return the getValue NAIVE', async(() => {

    const naive = new GameService().getValue(mockGameState, HeuristicsType.NAIVE)
    expect(naive).toBeCalled
  }));

  it('should return the getValue ALMOST_MILL', async(() => {

    const almostMill = new GameService().getValue(mockGameState, HeuristicsType.ALMOST_MILL)
    expect(almostMill).toBeCalled
  }));

  it('should return the Clone method', async(() => {
    const deepClone = { "allowedMoves": [{ "color": "GOLD", "radius": 1, "x": 1, "y": 2 }], "bluePlayerState": { "color": "GOLD", "lastMovedPiece": { "color": "GOLD", "radius": 1, "x": 1, "y": 2 }, "piecesInDrawer": 3, "piecesOnBoard": 4, "points": 1, "previousPosition": { "color": "GOLD", "radius": 1, "x": 1, "y": 2 } }, "chosenForShift": { "color": "GOLD", "radius": 1, "x": 1, "y": 2 }, "goldPlayerState": { "color": "GOLD", "lastMovedPiece": { "color": "GOLD", "radius": 1, "x": 1, "y": 2 }, "piecesInDrawer": 3, "piecesOnBoard": 4, "points": 1, "previousPosition": { "color": "GOLD", "radius": 1, "x": 1, "y": 2 } }, "moveCount": 5, "moveType": "END GAME", "moves": [{ "color": "GOLD", "count": 2, "moveDescription": "normal", "moveType": "NORMAL" }], "movesWithoutMill": 2, "nodes": [{ "color": "GOLD", "radius": 1, "x": 1, "y": 2 }], "shiftDestinations": [{ "color": "GOLD", "radius": 1, "x": 1, "y": 2 }], "turn": "GOLD" }
    const clone = new GameService().clone(mockGameState)
    expect(clone).toEqual(deepClone)
  }));

  it('should return the isMoveAllowed method', async(() => {

    const moveAllowed = new GameService().isMoveAllowed(mockGameState, mockNode)
    expect(moveAllowed).toEqual(true)
  }));

  it('should return the isShiftToAllowed method', async(() => {

    const shiftAllowed = new GameService().isShiftToAllowed(mockGameState, mockNode, mockDestinationNode)
    expect(shiftAllowed).toEqual(false)
  }));

  it('should return the isShiftToAllowed method -- not turn', async(() => {
    const state = {
      turn: Color.BLUE,
      moveType: MoveType.MOVE_NEARBY,
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
    const shiftAllowed = new GameService().isShiftToAllowed(state, mockNode, mockDestinationNode)
    expect(shiftAllowed).toEqual(false)
  }));

  it('should return the isShiftToAllowed method -- Nearby', async(() => {
    const state = {
      turn: Color.GOLD,
      moveType: MoveType.MOVE_NEARBY,
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
    const shiftAllowed = new GameService().isShiftToAllowed(state, mockNode, mockDestinationNode)
    expect(shiftAllowed).toEqual(false)
  }));

  it('should return the isShiftToAllowed method -- Anywhere', async(() => {
    const state = {
      turn: Color.GOLD,
      moveType: MoveType.MOVE_ANYWHERE,
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
    const shiftAllowed = new GameService().isShiftToAllowed(state, mockNode, mockDestinationNode)
    expect(shiftAllowed).toEqual(false)
  }));

  it('should return the getCurrentPlayer method -- Gold Turn', async(() => {
    const expected = {
      "color": "GOLD", "lastMovedPiece": { "color": "GOLD", "radius": 1, "x": 1, "y": 2 }, "piecesInDrawer": 3, "piecesOnBoard": 4,
      "points": 1, "previousPosition": { "color": "GOLD", "radius": 1, "x": 1, "y": 2 }
    }
    const getPlayer = new GameService().getCurrentPlayer(mockGameState)
    expect(getPlayer).toEqual(expected)
  }));

  it('should return the getCurrentPlayer method -- Blue Turn', async(() => {
    const expected = {
      "color": "GOLD", "lastMovedPiece": { "color": "GOLD", "radius": 1, "x": 1, "y": 2 }, "piecesInDrawer": 3, "piecesOnBoard": 4,
      "points": 1, "previousPosition": { "color": "GOLD", "radius": 1, "x": 1, "y": 2 }
    }
    const state = {
      turn: Color.BLUE,
      moveType: MoveType.MOVE_ANYWHERE,
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
    const getPlayer = new GameService().getCurrentPlayer(state)
    expect(getPlayer).toEqual(expected)
  }));

  it('should return the getOpponentPlayer method -- Gold Turn', async(() => {
    const expected = {
      "color": "GOLD", "lastMovedPiece": { "color": "GOLD", "radius": 1, "x": 1, "y": 2 }, "piecesInDrawer": 3, "piecesOnBoard": 4,
      "points": 1, "previousPosition": { "color": "GOLD", "radius": 1, "x": 1, "y": 2 }
    }
    const getPlayer = new GameService().getOpponentPlayer(mockGameState)
    expect(getPlayer).toEqual(expected)
  }));

  it('should return the getOpponentPlayer method -- Blue Turn', async(() => {
    const expected = {
      "color": "GOLD", "lastMovedPiece": { "color": "GOLD", "radius": 1, "x": 1, "y": 2 }, "piecesInDrawer": 3, "piecesOnBoard": 4,
      "points": 1, "previousPosition": { "color": "GOLD", "radius": 1, "x": 1, "y": 2 }
    }
    const state = {
      turn: Color.BLUE,
      moveType: MoveType.MOVE_ANYWHERE,
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
    const getPlayer = new GameService().getOpponentPlayer(state)
    expect(getPlayer).toEqual(expected)
  }));
});
