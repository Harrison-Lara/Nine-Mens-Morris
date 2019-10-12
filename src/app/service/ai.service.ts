import { Injectable } from '@angular/core';
import { GameService } from "./game.service";
import { IGameState } from "../model/gameState.model";
import { Color } from "../model/enum/color.enum";
import { GameStateNode, IGameStateNode } from "../model/gameStateNode.model";
import { MoveType } from "../model/enum/moveType.enum";
import { AlgorithmType } from "../model/enum/algorithmType.enum";
import { HeuristicsType } from "../model/enum/heuristicsType.enum";
import { PathCounter } from "../model/pathCounter.model";

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
