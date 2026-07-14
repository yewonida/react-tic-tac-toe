import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    //만약에 기존에 사각형에 값이 먼저 채워져 있다면 그냥 종료
    //혹시 승자가 존재한다면 종료
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();

    //플레이어가 X 일 때
    if (xIsNext) {
      nextSquares[i] = "X";
    }
    //플레이어가 O 일 때
    else {
      nextSquares[i] = "O";
    }
    
    //다음 상태가 이거라는 것만 알려주고, 상태 변경은 Game이 알아서 변경하도록 
    onPlay(nextSquares);

  }

  return (
    <>
      <div className="status">{status}</div>

      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

//이 게임의 가장 최상위 컴포넌트
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);

  //사용자가 선택한 시점 상태 관리
  const [currentMove, setCurrentMove] = useState(0);

  //사용자가 선택한 시점이 지금 보고 있는 보드가 되어야 함
  const currentSquares = history[currentMove];


  
  function handlePlay(nextSquares) {
    //여기서 currentMove + 1 인 이유는 slice()메소드가 0부터 n-1까지만 자르기 때문에
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    
    setHistory(nextHistory);

    setCurrentMove(nextHistory.length - 1);
    // Board에서 했던 것처럼 xIsNext 값을 반전
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);

    // 지금이 짝수번째면 다음 차례는 X 가 된다.
    //nextMove가 짝수면 → nextMove % 2 === 0이 true → xIsNext = true → X 차례
    //nextMove가 홀수면 → nextMove % 2 === 0이 false → xIsNext = false → O 차례
    setXIsNext(nextMove % 2 === 0);
  }
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move} >
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />  
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
