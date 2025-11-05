import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, className }) {
  return (
    <button className={`square ${className || ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, playerNames }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);

  return (
    <>
      {winner && (
        <div className="winner-banner">
          Câștigător: {playerNames[winner] || winner}
        </div>
      )}

      {!winner && (
        <div className="status">
          Următorul jucător: {xIsNext ? playerNames['X'] || 'Jucător X' : playerNames['O'] || 'Jucător 0'}
        </div>
      )}

      <div className="board-row">
        {squares.slice(0, 3).map((val, i) => (
          <Square key={i} value={val} className={val} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
      <div className="board-row">
        {squares.slice(3, 6).map((val, i) => (
          <Square key={i + 3} value={val} className={val} onSquareClick={() => handleClick(i + 3)} />
        ))}
      </div>
      <div className="board-row">
        {squares.slice(6, 9).map((val, i) => (
          <Square key={i + 6} value={val} className={val} onSquareClick={() => handleClick(i + 6)} />
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [playerX, setPlayerX] = useState('');
  const [player0, setPlayer0] = useState('');
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const playerNames = { X: playerX, O: player0 };

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    const description = move ? 'Mutarea #' + move : 'Începe jocul';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="player-inputs">
        <div>
          <label>Jucător X:</label>
          <input
            type="text"
            value={playerX}
            onChange={(e) => setPlayerX(e.target.value)}
            placeholder="Introduceți numele jucătorului X"
          />
        </div>
        <div>
          <label>Jucător 0:</label>
          <input
            type="text"
            value={player0}
            onChange={(e) => setPlayer0(e.target.value)}
            placeholder="Introduceți numele jucătorului 0"
          />
        </div>
      </div>

      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} playerNames={playerNames} />
      </div>

      <div className="game-info">
        <h3>Istoric mișcări</h3>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
