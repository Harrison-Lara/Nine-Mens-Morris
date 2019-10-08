import { Injectable } from '@angular/core';
import { GameService } from "./game.service";
import { IGameState } from "../model/game-state.model";
import { Color } from "../model/enum/color.enum";
import { GameStateNode, IGameStateNode } from "../model/game-state-node.model";
import { MoveType } from "../model/enum/move-type.enum";
import { AlgorithmType } from "../model/enum/algorithm-type.enum";
import { HeuristicsType } from "../model/enum/heuristics-type.enum";
import { PathCounter } from "../model/path-counter.model";

@Injectable({
  providedIn: 'root'
})
export class aiService {

  constructor(private gameService: GameService) {
  }

  public performAIMove(gameState: IGameState, algorithmType: AlgorithmType, heuristics: HeuristicsType, pathCounter: PathCounter): IGameState {
    if (gameState.moveType == MoveType.END_GAME) {
      return gameState;
    }
    let isMaximizing: boolean = gameState.turn == Color.BLUE;

    let root = new GameStateNode(this.gameService, gameState, isMaximizing, 0, heuristics, algorithmType, pathCounter);
    root = this.broadFirstTreeGenerate(root, Date.now(), 5 * 10e4, heuristics);
    root.calcValue();
    return root.getBestChild().root;
  }

  private broadFirstTreeGenerate(root: IGameStateNode, timeStart: number, timeout: number, heuristics: HeuristicsType): IGameStateNode {
    let firstQueue: IGameStateNode[] = [root];
    let secondQueue: IGameStateNode[] = [];
    let level = 0;
    let iterationTime = Date.now() - timeStart;
    let iterationFinishedTimestamp = Date.now();
    while ((Date.now() - timeStart) + (iterationTime ** 2) < timeout && level < 10) {
      level++;
      for (const firstQueueElem of firstQueue) {
        const children = this.gameService.getAllPossibleNextMoveResults(firstQueueElem.root)
          .map(state => GameStateNode.createFromParent(firstQueueElem, state));
        firstQueueElem.children = children;
        secondQueue = [...secondQueue, ...children];
      }
      firstQueue = secondQueue;
      secondQueue = [];
      const newIterationTimestamp = Date.now();
      iterationTime = newIterationTimestamp - iterationFinishedTimestamp;
      iterationFinishedTimestamp = newIterationTimestamp;
    }
    return root;
  }

}
