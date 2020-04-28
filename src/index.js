import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Modal extends React.Component {
  render() {
    let actions = this.props.calculateActions("place", "holder");
    return (
      <div style={{ display: this.props.display }} className="modal_bg">
        <div className="modal">
          <div className="actions_modal"> {actions} </div>
          <div onClick={() => this.props.close()} className="close_modal">
            <i className="fas fa-times"></i>
          </div>
        </div>
      </div>
    );
  }
}

class Board extends React.Component {
  renderSquare(i, j) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i, j)}
      />
    );
  }

  render() {
    let jsxToRender = [];
    for (let i = 0; i < this.props.fieldSize; i++) {
      let items = [];
      for (let j = 0; j < this.props.fieldSize; j++) {
        items.push(this.renderSquare(i, j));
      }
      jsxToRender.push(<div className="board-row"> {items} </div>);
    }
    return jsxToRender;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    let playerNumber = 2;
    let fieldSize = 16;

    this.state = {
      playerNumber: playerNumber,
      history: [
        {
          squares: Array(fieldSize).fill(Array(fieldSize).fill(null)),
        },
      ],
      players: [
        {
          id: 1,
          arany: 50,
          buza: 50,
          fa: 50,
          katona: 0,
        },
        {
          id: 2,
          arany: 50,
          buza: 50,
          fa: 50,
          katona: 0,
        },
      ],
      fieldSize: fieldSize,
      stepNumber: 0,
      nextPlayer: 1,
      modalDisplay: "none",
    };
  }

  close() {
    this.setState({
      modalDisplay: "none",
    });
  }

  handleClick(i, j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    console.log(squares);

    //Calculate Winner
    /*
    if (calculateWinner(squares) || squares[i]) {
      return;
    }*/
    console.log(squares[i]);
    squares[i][j] = this.state.nextPlayer;
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      nextPlayer:
        this.state.nextPlayer < this.state.playerNumber
          ? this.state.nextPlayer + 1
          : 1,
      modalDisplay: "block",
    });
  }
  //milyen adat kell egy field objectbe, a playert hol tároljam
  calculateActions(player, field) {
    return <h1>Actions</h1>;
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      nextPlayer: step % this.state.playerNumber,
    });
  }

  render() {
    const history = this.state.history;
    console.log(history);
    console.log(this.state.stepNumber);
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + this.state.nextPlayer;
    }

    let playersData = [];
    for (let i = 0; i < this.state.playerNumber; i++) {
      let player = this.state.players[i];
      playersData.push(<div className="player_id">Player{player.id}</div>);
      playersData.push(
        <div className="player_arany">Arany: {player.arany}</div>
      );
      playersData.push(<div className="player_buza">Búza: {player.buza}</div>);
      playersData.push(<div className="player_fa">Fa: {player.fa}</div>);
      playersData.push(
        <div className="player_katona">Katona: {player.katona}</div>
      );
      playersData.push(<br />);
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i, j) => this.handleClick(i, j)}
            fieldSize={this.state.fieldSize}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <br />
          <div>{playersData}</div>
          <ol>{moves}</ol>
        </div>
        <Modal
          close={() => this.close()}
          calculateActions={(player, field) => this.calculateActions()}
          display={this.state.modalDisplay}
        />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

//Helper function
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i of lines) {
    let [a, b, c] = i;
    if (
      squares[a] !== null &&
      squares[a] === squares[b] &&
      squares[b] === squares[c]
    )
      return squares[a];
  }

  return null;
}
