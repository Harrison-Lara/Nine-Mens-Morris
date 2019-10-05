import React from 'react';
import Node from './Node';
import 'normalize.css'
import 'styles/App.css'

class Board extends React.Component {

  constructor() {
    super();
    let board = [];
    for (let i = 0; i < 24; i++) {
      board.push({ 'position': getPosition(i), 'currentPlayer': 0 });
    }
    this.state = {
      board: board,
      info: 'Place your chip',
      gameStatus: '1',
      removingPhase: false,
      player1Moves: 0,
      player2Moves: 0,
      player1Nodes: 0,
      player2Nodes: 0,
      currentPlayer: 1
    }
  }

  switchPlayer(player) {
    if (player === 1) {
      return 2;
    } else {
      return 1;
    }
  }

  millCreated(location) {
    let board = this.state.board;
    const player = board[location].currentPlayer;
    if ((location % 2) == 0) {
      if (location == 2 || location == 4 || location == 10 || location == 12 || location == 18 || location == 20) {
        if ((board[location - 1].currentPlayer == player) && (board[location - 2].currentPlayer == player)) {
          return true;
        } else if ((board[location + 1].currentPlayer == player) && (board[location + 2].currentPlayer == player)) {
          return true;
        }
      } else if (location == 0 || location == 8 || location == 16) {
        if ((board[location + 1].currentPlayer == player) && (board[location + 2].currentPlayer == player)) {
          return true;
        } else if ((board[location + 6].currentPlayer == player) && (board[location + 7].currentPlayer == player)) {
          return true;
        }
      } else if (location == 6 || location == 14 || location == 22) {
        if ((board[location - 1].currentPlayer == player) && (board[location - 2].currentPlayer == player)) {
          return true;
        } else if ((board[location + 1].currentPlayer == player) && (board[location - 6].currentPlayer == player)) {
          return true;
        }
      }
    } else if ((location % 2) == 1) {
      if (location != 7 && location != 15 && location != 23) {
        if ((board[location - 1].currentPlayer == player) && (board[location + 1].currentPlayer == player)) {
          return true;
        }
      } else {
        if ((board[location - 1].currentPlayer == player) && (board[location - 7].currentPlayer == player)) {
          return true;
        }
      }
      if (location <= 7) {
        if ((board[location + 8].currentPlayer == player) && (board[location + 16].currentPlayer == player)) {
          return true;
        }
      } else if (location > 7 && location <= 15) {
        if ((board[location - 8].currentPlayer == player) && (board[location + 8].currentPlayer == player)) {
          return true;
        }
      } else if (location > 15 && location <= 23) {
        if ((board[location - 8].currentPlayer == player) && (board[location - 16].currentPlayer == player)) {
          return true;
        }
      }
    }
  }

  playerMove(node) {
    if (this.state.removingPhase) {
      if (this.state.board[node].currentPlayer !== 0 && this.state.board[node].currentPlayer !== this.state.currentPlayer) {
        if (this.state.board[node].currentPlayer === 1) {
          this.state.player1Nodes--;
        } else if (this.state.board[node].currentPlayer === 2) {
          this.state.player2Nodes--;
        }
        this.state.board[node].currentPlayer = 0;
        this.state.removingPhase = false;
        this.state.currentPlayer = this.switchPlayer(this.state.currentPlayer);
        this.state.info = 'Place your chip';
        this.forceUpdate();
      } else {
        const info = this.state.info;
        this.setState({ info: 'Invalid move!' });
        setTimeout(function () { this.setState({ info: info }) }.bind(this), 1500);
      }
    } else if (!(this.state.removingPhase)) {
      if (this.state.gameStatus === '1') {
        if (this.state.board[node].currentPlayer === 0) {
          this.state.board[node].currentPlayer = this.state.currentPlayer;
          if (this.state.currentPlayer === 1) {
            this.state.player1Nodes++;
            this.state.player1Moves++;
          } else if (this.state.currentPlayer === 2) {
            this.state.player2Nodes++;
            this.state.player2Moves++;
          }
          if (this.millCreated(node)) {
            this.state.info = 'Mill formed! Remove opponents chip.';
            this.state.removingPhase = true;
            this.forceUpdate();
          } else if (!(this.millCreated(node))) {
            this.state.currentPlayer = this.switchPlayer(this.state.currentPlayer);
            this.forceUpdate();
          }
          if (this.state.player2Moves === 9) {
            this.state.gameStatus = '2';
          }
        } else {
          const info = this.state.info;
          this.setState({ info: 'Invalid placement!' });
          setTimeout(function () { this.setState({ info: info }) }.bind(this), 1500);
        }
      } else { this.state.info = 'Second game phase not yet implemented'; }
    }
  }

  render() {
    let quarters = [];
    for (let i = 0; i < 4; i++) {
      let quarter = <div className='quarter panel2' key={i} />
      quarters.push(quarter)
    }
    let nodes = [];
    for (let i = 0; i < 24; i++) {
      const pos = this.state.board[i].position;
      const player = this.state.board[i].currentPlayer;
      let node = <Node
        index={i}
        key={'cell' + i}
        currentPlayer={player}
        position={pos}
        nodeIsClicked={this.playerMove.bind(this)}
      />
      nodes.push(node)
    }

    return (
      <div className='board panel2'>
        {nodes}
        <div className='phase-div panel3'>Mill Stage: <span className='black'>{this.state.gameStatus}</span></div>
        <div className='player-div panel3'> Player: <span className='black'>{this.state.currentPlayer}</span></div>
        <div className='info-div panel3'>Nine Men's Morris <br></br> {this.state.info}</div>
        {quarters}
        <div className='inner1 panel4' />
        <div className='inner2 panel4' />
        <div className='lateral panel3'><span className='white'>Player One Pieces: {this.state.player1Nodes}</span></div>
        <div className='lateral2 panel3'><span className='black'>Player Two Pieces: {this.state.player2Nodes}</span></div>
      </div >
    );
  }
}

let getPosition = function (location) {
  let xPos = 0;
  let yPos = 0;
  if (location == 0 || location == 1 || location == 2) {
    yPos = 0;
  } else if (location == 8 || location == 9 || location == 10) {
    yPos = 16.66;
  } else if (location == 16 || location == 17 || location == 18) {
    yPos = 33.33;
  } else if (location == 7 || location == 15 || location == 23 || location == 19 || location == 11 || location == 3) {
    yPos = 50;
  } else if (location == 22 || location == 21 || location == 20) {
    yPos = 66.66;
  } else if (location == 14 || location == 13 || location == 12) {
    yPos = 83.33;
  } else if (location == 6 || location == 5 || location == 4) {
    yPos = 100;
  }
  if (location == 0 || location == 7 || location == 6) {
    xPos = 0;
  } else if (location == 8 || location == 15 || location == 14) {
    xPos = 16.66;
  } else if (location == 16 || location == 23 || location == 22) {
    xPos = 33.33;
  } else if (location == 1 || location == 9 || location == 17 || location == 21 || location == 13 || location == 5) {
    xPos = 50;
  } else if (location == 18 || location == 19 || location == 20) {
    xPos = 66.66;
  } else if (location == 10 || location == 11 || location == 12) {
    xPos = 83.33;
  } else if (location == 2 || location == 3 || location == 4) {
    xPos = 100;
  }

  return { 'xPos': xPos, 'yPos': yPos };
}

export default Board;
