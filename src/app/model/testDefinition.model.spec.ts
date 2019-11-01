import { async } from '@angular/core/testing';
import { TestDefinition } from './testDefinition.model'
import { AlgorithmType } from './enum/algorithmType.enum';
import { HeuristicsType } from './enum/heuristicsType.enum';

describe('Test Definition Model', () => {
  it('should return the Test Definition constructor', async(() => {

    const testConstructor = new TestDefinition(AlgorithmType.ALPHA_BETA, AlgorithmType.ALPHA_BETA, HeuristicsType.NAIVE, HeuristicsType.NAIVE)
    expect(testConstructor).toEqual({ "blueAiAlgorithm": "ALPHA-BETA", "blueHeuristics": "NAIVE", "goldAiAlgorithm": "ALPHA-BETA", "goldHeuristics": "NAIVE" })
  }))

  it('should return the generateTestDefinitions method -- blueAiAlgorithm ', async(() => {

    const testConstructor = new TestDefinition(AlgorithmType.ALPHA_BETA, AlgorithmType.ALPHA_BETA, HeuristicsType.NAIVE, HeuristicsType.NAIVE).blueAiAlgorithm
    expect(testConstructor).toEqual("ALPHA-BETA")
  }))

  it('should return the generateTestDefinitions method -- goldAiAlgorithm  ', async(() => {

    const testConstructor = new TestDefinition(AlgorithmType.MINI_MAX, AlgorithmType.MINI_MAX, HeuristicsType.NAIVE, HeuristicsType.NAIVE).goldAiAlgorithm
    expect(testConstructor).toEqual("MINI-MAX")
  }))

  it('should return the generateTestDefinitions method -- blueHeuristics  ', async(() => {

    const testConstructor = new TestDefinition(AlgorithmType.ALPHA_BETA, AlgorithmType.ALPHA_BETA, HeuristicsType.NAIVE, HeuristicsType.NAIVE).blueHeuristics
    expect(testConstructor).toEqual("NAIVE")
  }))

  it('should return the generateTestDefinitions method -- goldHeuristics ', async(() => {

    const testConstructor = new TestDefinition(AlgorithmType.ALPHA_BETA, AlgorithmType.ALPHA_BETA, HeuristicsType.NAIVE, HeuristicsType.NAIVE).goldHeuristics
    expect(testConstructor).toEqual("NAIVE")
  }))
});
