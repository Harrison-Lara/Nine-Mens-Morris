import React from 'react';
import Board from './Board';
import 'normalize.css'
import 'styles/App.css'

class App extends React.Component {

  render() {
    return (
      <div>
        <Board className={'app'} />
      </div>
    );
  }
}

export default App;
