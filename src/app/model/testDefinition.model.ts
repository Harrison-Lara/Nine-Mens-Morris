import { AlgorithmType } from './enum/algorithmType.enum';
import { HeuristicsType } from './enum/heuristicsType.enum';

export class TestDefinition {
  blueAiAlgorithm: AlgorithmType;
  goldAiAlgorithm: AlgorithmType;

  blueHeuristics: HeuristicsType;
  goldHeuristics: HeuristicsType;

  constructor(blueAiAlgorithm: AlgorithmType, goldAiAlgorithm: AlgorithmType,
              blueHeuristics: HeuristicsType, goldHeuristics: HeuristicsType) {
    this.blueAiAlgorithm = blueAiAlgorithm;
    this.goldAiAlgorithm = goldAiAlgorithm;
    this.blueHeuristics = blueHeuristics;
    this.goldHeuristics = goldHeuristics;
  }

  public static generateTestDefinitions(): TestDefinition[] {
    const result: TestDefinition[] = [];
    for (const blueAiAlgorithm of Object.keys(AlgorithmType)) {
      for (const goldAiAlgorithm of Object.keys(AlgorithmType)) {
        for (const blueHeuristics of Object.keys(HeuristicsType)) {
          for (const goldHeuristics of Object.keys(HeuristicsType)) {
            result.push(new TestDefinition(
              AlgorithmType[blueAiAlgorithm],
              AlgorithmType[goldAiAlgorithm],
              HeuristicsType[blueHeuristics],
              HeuristicsType[goldHeuristics]
            ));
          }
        }
      }
    }
    return result;
  }
}
