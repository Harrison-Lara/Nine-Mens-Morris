import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HighlightedNode, INode } from './model/node.model';
import { MoveType } from './model/enum/moveType.enum';
import { BoardService } from './service/board.service';
import { IPosition } from './model/position.model';
import { Color } from "./model/enum/color.enum";
import { MoveService } from "./service/move.service";
import { getWinSize, largeScreen } from "./service/resize.service";
import { GameState, IGameState } from "./model/gameState.model";
import { PlayerType } from "./model/enum/playerType.enum";
import { GameService } from "./service/game.service";
import { aiService } from "./service/ai.service";
import { MatDialog, MatSnackBar } from "@angular/material";
import { HelpComponent } from "./help/help.component";
import { GameOverComponent } from "./gameOver/gameOver.component";
import { SwUpdate } from "@angular/service-worker";
import { AlgorithmType } from "./model/enum/algorithmType.enum";
import { HeuristicsType } from "./model/enum/heuristicsType.enum";
import { GameOverData } from "./model/gameOverData.model";
import { PathCounter } from "./model/pathCounter.model";
import { TestDefinition } from "./model/testDefinition.model";

@Component({
  selector: 'app-root',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class MillComponent implements AfterViewInit, OnInit {

  boardSize: number = 7;
  baseSize: number;
  offset: number;

  canvas: HTMLCanvasElement;
  BoardService: BoardService;

  goldMoveService: MoveService;
  blueMoveService: MoveService;

  gameStates: IGameState[] = [];
  currentIndex = 0;

  goldPlayerType: PlayerType;
  bluePlayerType: PlayerType;

  blueAiAlgorithm: AlgorithmType = AlgorithmType.MINI_MAX;
  goldAiAlgorithm: AlgorithmType = AlgorithmType.MINI_MAX;

  blueHeuristics: HeuristicsType = HeuristicsType.NAIVE;
  goldHeuristics: HeuristicsType = HeuristicsType.NAIVE;

  defaultCanvasSize = 400;

  gameStartTime = Date.now();

  blueAiPathCounter: PathCounter;
  goldAiPathCounter: PathCounter;

  testDefinitions: TestDefinition[] = TestDefinition.generateTestDefinitions();
  performTests: boolean = false;
  testCounter = 0;
  testResults: GameOverData[] = [];

  constructor(private gameService: GameService, private aiPlayerService: aiService, private snackBar: MatSnackBar, private dialog: MatDialog, private swUpdate: SwUpdate) {
    this.goldPlayerType = PlayerType.HUMAN;
    this.bluePlayerType = PlayerType.HUMAN;
  }

  ngOnInit(): void {
    this.initNewGame();
  }

  initNewGame(): void {
    if (!this.performTests) {
      this.goldPlayerType = PlayerType.HUMAN;
      this.bluePlayerType = PlayerType.HUMAN;
    } else {
      this.goldPlayerType = PlayerType.AI;
      this.bluePlayerType = PlayerType.AI;
      this.goldAiAlgorithm = this.testDefinitions[this.testCounter].goldAiAlgorithm;
      this.blueAiAlgorithm = this.testDefinitions[this.testCounter].blueAiAlgorithm;
      this.goldHeuristics = this.testDefinitions[this.testCounter].goldHeuristics;
      this.blueHeuristics = this.testDefinitions[this.testCounter].blueHeuristics;
    }
    this.gameStates = [];
    this.currentIndex = 0;
    this.blueAiPathCounter = new PathCounter();
    this.goldAiPathCounter = new PathCounter();
    this.gameStates.push(new GameState(this.goldPlayerType, this.bluePlayerType));
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.afterViewInitCallback());
  }

  afterViewInitCallback(): void {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!largeScreen()) {
      this.canvas.width = 0.8 * getWinSize();
      this.canvas.height = 0.8 * getWinSize();
    } else {
      this.canvas.width = this.defaultCanvasSize;
      this.canvas.height = this.defaultCanvasSize;
    }

    this.baseSize = this.canvas.width / 8;
    this.offset = this.baseSize * 1.25;
    const baseRadiusSize = this.baseSize / 6;

    this.BoardService = new BoardService(this.canvas, this.baseSize, this.offset, baseRadiusSize);

    this.goldMoveService = new MoveService(document.getElementById('gold-drawer') as HTMLCanvasElement,
      this.baseSize,
      this.offset * 0.5,
      this.gameStates[this.currentIndex].goldPlayerState.piecesInDrawer,
      Color.GOLD,
      2, baseRadiusSize);
    this.blueMoveService = new MoveService(document.getElementById('blue-drawer') as HTMLCanvasElement,
      this.baseSize,
      this.offset * 0.5,
      this.gameStates[this.currentIndex].bluePlayerState.piecesInDrawer,
      Color.BLUE,
      2, baseRadiusSize);

    this.drawBoard(this.gameStates[this.currentIndex]);
    this.addCanvasOnClickListener();
    this.addCanvasOnMouseMoveListener();
    if (this.goldPlayerType == PlayerType.AI) {
      this.moveAI();
    }
  }

  addCanvasOnClickListener(): void {
    this.canvas.addEventListener('click', (mouseEvent) => this.onClickOrTouchListener(mouseEvent));
  }

  onClickOrTouchListener(event: UIEvent) {
    if (this.getCurrentPlayer(this.gameStates[this.gameStates.length - 1]) == PlayerType.HUMAN) {
      const relativePosition = this.BoardService.getPositionInCanvas(event);
      const selectedNode: INode = this.findIntersectingPiece(this.gameStates[this.gameStates.length - 1].nodes, relativePosition);
      if (selectedNode) {
        let newGameState = this.gameService.clone(this.gameStates[this.currentIndex]);
        let node = newGameState.nodes.find(node => node.x == selectedNode.x && node.y == selectedNode.y);
        this.gameService.performMove(newGameState, node);
        this.processMoveResult(newGameState);
      }
    }
  }

  getCurrentPlayer(gameState: IGameState): PlayerType {
    switch (gameState.turn) {
      case Color.GOLD:
        return this.goldPlayerType;
      case Color.BLUE:
        return this.bluePlayerType;
    }
  }

  addCanvasOnMouseMoveListener(): void {
    this.canvas.addEventListener('mousemove', (mouseEvent) => {
      if (this.getCurrentPlayer(this.gameStates[this.currentIndex]) == PlayerType.HUMAN) {
        const relativePosition = this.BoardService.getMousePositionInCanvas(mouseEvent);
        const hoveredNode: INode = this.findIntersectingPiece(this.gameStates[this.currentIndex].nodes, relativePosition);
        let isMoveAllowed = false;

        if (hoveredNode) {
          switch (this.gameStates[this.currentIndex].moveType) {
            case MoveType.NORMAL:
            case MoveType.REMOVE_OPPONENT:
            case MoveType.REMOVE_OPPONENT_2:
              isMoveAllowed = this.gameService.isMoveAllowed(this.gameStates[this.currentIndex], hoveredNode);
              break;
            case MoveType.MOVE_NEARBY:
            case MoveType.MOVE_ANYWHERE:
              isMoveAllowed = this.gameService.isMoveAllowed(this.gameStates[this.currentIndex], hoveredNode);
              if (!isMoveAllowed && this.gameStates[this.currentIndex].chosenForShift != null) {
                isMoveAllowed = this.gameService.isShiftToAllowed(this.gameStates[this.currentIndex], this.gameStates[this.currentIndex].chosenForShift, hoveredNode);
              }
              break;
          }
        }
        if (isMoveAllowed) {
          this.canvas.style.cursor = 'pointer';
        } else {
          this.canvas.style.cursor = 'default';
        }
      }
    }, { passive: true });
  }

  processMoveResult(gameState: IGameState): void {
    if (this.currentIndex == 0) {
      this.gameStartTime = Date.now();
    }
    if (gameState != null) {

      this.gameStates = this.gameStates.slice(0, this.currentIndex + 1);
      this.gameStates.push(gameState);
      this.currentIndex++;
      this.drawBoard(this.gameStates[this.currentIndex]);
      if (gameState.moveType == MoveType.END_GAME || gameState.moveType == MoveType.DRAW) {
        this.openGameOverDialog();
      } else if (this.getCurrentPlayer(gameState) == PlayerType.AI) {
        this.moveAI();
      }
    }
  }

  drawBoard(gameState: IGameState): void {
    this.BoardService.clearCanvas();
    this.BoardService.drawSquare(2, 2, 2);
    this.BoardService.drawSquare(1, 1, 4);
    this.BoardService.drawSquare(0, 0, 6);
    this.BoardService.drawLine(0, 3, 2, 3);
    this.BoardService.drawLine(4, 3, 6, 3);
    this.BoardService.drawLine(3, 0, 3, 2);
    this.BoardService.drawLine(3, 4, 3, 6);
    const legendOffset = 0.15;
    for (let i = 0; i < this.boardSize; ++i) {
      this.BoardService.createCanvas(this.offset / 4, this.offset * (1 + legendOffset) + i * this.baseSize, i.toString());
      this.BoardService.createCanvas(this.offset * (1 - legendOffset) + i * this.baseSize, this.offset / 2, String.fromCharCode('A'.charCodeAt(0) + i));
    }

    this.goldMoveService.numberOfPieces = gameState.goldPlayerState.piecesInDrawer;
    this.blueMoveService.numberOfPieces = gameState.bluePlayerState.piecesInDrawer;

    gameState.nodes.forEach(node => this.BoardService.drawNode(node));
    gameState.shiftDestinations.forEach(node => this.BoardService.drawNode(new HighlightedNode(node)));

    this.goldMoveService.drawDrawer();
    this.blueMoveService.drawDrawer();
  }

  moveAI() {
    let state: IGameState = null;
    new Promise((resolve, reject) => setTimeout(() => {
      state = this.aiPlayerService.moveAI(this.gameStates[this.currentIndex], this.getAlgorithmForCurrentAI(), this.getHeuristicsForCurrentAI(), this.getCurrentAiPathCounter());
      if (state) {
        this.showSnackBarWithMoveResult(state);
      } else {
      }
      resolve();
    }, 100)).then(() => this.processMoveResult(state));

  }

  getCurrentAiPathCounter() {
    switch (this.gameStates[this.currentIndex].turn) {
      case Color.BLUE:
        return this.blueAiPathCounter;
      case Color.GOLD:
        return this.goldAiPathCounter;
    }
  }

  getAlgorithmForCurrentAI() {
    switch (this.gameStates[this.currentIndex].turn) {
      case Color.BLUE:
        return this.blueAiAlgorithm;
      case Color.GOLD:
        return this.goldAiAlgorithm;
    }
  }

  getHeuristicsForCurrentAI() {
    switch (this.gameStates[this.currentIndex].turn) {
      case Color.BLUE:
        return this.blueHeuristics;
      case Color.GOLD:
        return this.goldHeuristics;
    }
  }

  showSnackBarWithMoveResult(gameState: IGameState) {
    const moves = gameState.moves.filter(move => move.count === gameState.moveCount);
    let message: string = '';
    message += '=== ' + moves[0].color + ' === ';
    for (let i = 0; i < moves.length; ++i) {
      message += moves[i].moveType + ': ' + moves[i].moveDescription;
      if (i != moves.length - 1) {
        message += '; ';
      }
    }
    this.snackBar.open(message, 'OK', { duration: 3000 });
  }

  findIntersectingPiece(pieces: INode[], relativePosition: IPosition): INode {
    for (const piece of pieces) {
      if (this.BoardService.isIntersect(relativePosition, piece)) {
        return piece;
      }
    }
    return null;
  }

  getPlayerColor(color: Color): PlayerType {
    switch (color) {
      case Color.GOLD:
        return this.goldPlayerType;
      case Color.BLUE:
        return this.bluePlayerType;
    }
  }

  switchPlayers(colorString: string) {
    const color: Color = Color[colorString];
    let playerType = this.getPlayerColor(color);
    let result: PlayerType;
    switch (playerType) {
      case PlayerType.HUMAN:
        result = PlayerType.AI;
        break;
      case PlayerType.AI:
        result = PlayerType.HUMAN;
        break;
    }
    switch (color) {
      case Color.GOLD:
        this.goldPlayerType = result;
        break;
      case Color.BLUE:
        this.bluePlayerType = result;
        break;
    }
    if (this.getCurrentPlayer(this.gameStates[this.currentIndex]) == PlayerType.AI) {
      this.moveAI();
    }
  }

  undo() {
    this.currentIndex--;
    this.updateState();
  }

  redo() {
    this.currentIndex++;
    this.updateState();
  }

  updateState() {
    this.drawBoard(this.gameStates[this.currentIndex]);
    if (this.getCurrentPlayer(this.gameStates[this.currentIndex]) == PlayerType.AI) {
      this.moveAI();
    }
  }

  openHelpDialog(): void {
    this.dialog.open(HelpComponent);
  }

  reset() {
    this.initNewGame();
    this.drawBoard(this.gameStates[this.currentIndex]);
  }

  openGameOverDialog(): void {
    const gameOverData = new GameOverData(this.gameStates[this.currentIndex].moveType == MoveType.DRAW ? null : this.gameStates[this.currentIndex].turn, this.gameStates[this.currentIndex].moveCount, this.gameStartTime, this.bluePlayerType, this.goldPlayerType, this.gameStates[this.currentIndex].goldPlayerState.points, this.gameStates[this.currentIndex].bluePlayerState.points);
    if (this.bluePlayerType == PlayerType.AI) {
      gameOverData.blueAlgorithm = this.blueAiAlgorithm;
      gameOverData.blueHeuristics = this.blueHeuristics;
      gameOverData.blueAiPathCounter = this.blueAiPathCounter.counter;
    }
    if (this.goldPlayerType == PlayerType.AI) {
      gameOverData.goldAlgorithm = this.goldAiAlgorithm;
      gameOverData.goldHeuristics = this.goldHeuristics;
      gameOverData.goldAiPathCounter = this.goldAiPathCounter.counter;
    }
    if (!this.performTests) {
      const dialogRef = this.dialog.open(GameOverComponent, {
        width: '300px',
        data: gameOverData
      });

      dialogRef.afterClosed().subscribe(result => {
        this.reset();
      });
    } else {
      this.testResults.push(gameOverData);
      if (this.testCounter < this.testDefinitions.length - 1) {
        this.testCounter++;
        this.reset();
        this.moveAI();
      } else {
        this.downloadTestsResults();
      }
    }
  }

  downloadTestsResults() {
    const result = JSON.stringify(this.testResults);
    const element = document.createElement('a');
    element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(result));
    element.setAttribute('download', "mill-results.json");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  toggleTests() {
    this.performTests = !this.performTests;
    this.testCounter = 0;
    this.testResults = [];

    this.reset();
    if (this.getCurrentPlayer(this.gameStates[this.currentIndex]) == PlayerType.AI) {
      this.moveAI();
    }
  }
}
