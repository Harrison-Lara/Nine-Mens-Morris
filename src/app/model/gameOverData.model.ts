import { Color } from "./enum/color.enum";
import { PlayerType } from "./enum/playerType.enum";
import { AlgorithmType } from "./enum/algorithmType.enum";
import { HeuristicsType } from "./enum/heuristicsType.enum";

export class GameOverData {
  public timeCounter: string;
  public blueAlgorithm: AlgorithmType;
  public goldAlgorithm: AlgorithmType;
  public blueHeuristics: HeuristicsType;
  public goldHeuristics: HeuristicsType;
  public blueAiPathCounter: number;
  public goldAiPathCounter: number;

  constructor(public winingPlayer: Color, public moveCount: number, timeStart: number, public bluePlayerType: PlayerType, public goldPlayerType: PlayerType, public goldPoints: number, public bluePoints: number) {
    this.timeCounter = ((Date.now() - timeStart) / 60000).toFixed(2);
  }
}
