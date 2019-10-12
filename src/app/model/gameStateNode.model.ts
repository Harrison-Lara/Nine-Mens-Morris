import { IGameState } from "./gameState.model";
import { GameService } from "../service/game.service";
import { HeuristicsType } from "./enum/heuristicsType.enum";
import { AlgorithmType } from "./enum/algorithmType.enum";
import { PathCounter } from "./pathCounter.model";

export interface IGameStateNode {
  root: IGameState;
  children: IGameStateNode[];
  value: number;
  level: number;

  isMaximizing: boolean;

  algorithmType: AlgorithmType;
  alpha: number;
  beta: number;

  calcValue(): number;

  getBestChild(): IGameStateNode;

  calcImminentValue(): number;

  gameService: GameService;
  heuristics: HeuristicsType;
  pathCounter: PathCounter;
}

export class GameStateNode implements IGameStateNode {
  children: IGameStateNode[];
  alpha: number = null;
  beta: number = null;
  value: number = null;

  constructor(public gameService: GameService, public root: IGameState, public isMaximizing: boolean, public level: number, public heuristics: HeuristicsType, public algorithmType: AlgorithmType, public pathCounter: PathCounter) {
  }

  static createFromParent(parent: IGameStateNode, root: IGameState): IGameStateNode {
    return new GameStateNode(parent.gameService, root, !parent.isMaximizing, parent.level + 1, parent.heuristics, parent.algorithmType, parent.pathCounter);
  }

  calcImminentValue(): number {
    return this.gameService.getValue(this.root, this.heuristics);
  }

  calcValue(): number {
    if (!this.children || this.children.length == 0) {
      this.value = this.calcImminentValue();
      this.pathCounter.increase();
      return this.value;
    } else {
      if (this.algorithmType != AlgorithmType.ALPHA_BETA) {
        const childrenValues: number[] = this.children.map(child => child.calcValue());
        this.value = this.isMaximizing ? Math.max(...childrenValues) : Math.min(...childrenValues);
        return this.value;
      } else {
        let alphabetaCut = false;
        for (let i = 0; i < this.children.length && !alphabetaCut; ++i) {
          let currentChild = this.children[i];
          currentChild.alpha = this.alpha;
          currentChild.beta = this.beta;

          let childValue = currentChild.calcValue();
          if (childValue != null) {
            if (this.isMaximizing && (this.alpha == null || this.alpha < childValue)) {
              this.alpha = childValue;
            } else if (!this.isMaximizing && (this.beta == null || this.beta > childValue)) {
              this.beta = childValue;
            }
          }

          if (this.alpha != null && this.beta != null) {
            if (this.isMaximizing && this.alpha > this.beta) {
              alphabetaCut = true;
            } else if (!this.isMaximizing && this.alpha < this.beta) {
              alphabetaCut = true;
            }
          }
        }
        if (alphabetaCut) {
          this.value = null;
        } else {
          if (this.isMaximizing) {
            this.value = this.alpha;
          } else {
            this.value = this.beta;
          }
        }
        return this.value;
      }
    }
  }

  getBestChild(): IGameStateNode {
    let result: IGameStateNode = null;
    let resultImminentValue = null;
    for (let i = 0; i < this.children.length; ++i) {
      const childImminentValue = this.children[i].calcImminentValue();
      if (this.children[i].value == this.value && (result == null
        || (this.isMaximizing ? childImminentValue > resultImminentValue : childImminentValue < resultImminentValue)
        || (resultImminentValue == childImminentValue && Math.random() > 0.75))) {
        result = this.children[i];
        resultImminentValue = childImminentValue;
      }
    }
    return result;
  }
}
