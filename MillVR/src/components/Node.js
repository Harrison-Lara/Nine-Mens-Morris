import React from 'react';
import 'normalize.css';
import 'styles/App.css'

class Node extends React.Component {

  nodeSelected() {
    this.props.nodeIsClicked(this.props.index);
  }

  render() {
    const position = this.props.position;
    const player = this.props.currentPlayer;
    let gameStyles = {};
    if (player == 0) {
      gameStyles.width = 20;
      gameStyles.height = 20;
      gameStyles.bkg = '#ffffff';
    } else if (player == 1) {
      gameStyles.width = 30;
      gameStyles.height = 30;
      gameStyles.bkg = 'blue';
    } else if (player == 2) {
      gameStyles.width = 30;
      gameStyles.height = 30;
      gameStyles.bkg = 'black';
    }
    const style = { left: position.xPos + '%', top: position.yPos + '%', width: gameStyles.width + 'px', height: gameStyles.height + 'px', backgroundColor: gameStyles.bkg };

    return (
      <div className='node' style={style} onClick={this.nodeSelected.bind(this)} />
    );
  }
}

export default Node;
