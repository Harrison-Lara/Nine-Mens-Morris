import { async } from '@angular/core/testing';
import { TestDefinition } from './testDefinition.model'
import { AlgorithmType } from './enum/algorithmType.enum';
import { HeuristicsType } from './enum/heuristicsType.enum';

describe('Test Definition Model', () => {
  it('should return the Test Definition constructor', async(() => {

    const testConstructor = new TestDefinition(AlgorithmType.ALPHA_BETA, AlgorithmType.ALPHA_BETA, HeuristicsType.NAIVE, HeuristicsType.NAIVE)
    expect(testConstructor).toEqual({ "blueAiAlgorithm": "ALPHA-BETA", "blueHeuristics": "NAIVE", "goldAiAlgorithm": "ALPHA-BETA", "goldHeuristics": "NAIVE" })
  }))
});
