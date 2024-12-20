import './App.css'
import Board from './Board';
import { useState, useEffect, useCallback } from 'react';
let score = 0;
const maxScore = localStorage.getItem("maxScore") || 0;

function App() {
  const [board, setBoard] = useState(generateInitialBoard());
  const [gameOver, setGameOver] = useState(false);
  const [movements, setMovements] = useState([]);

  const handleMove = useCallback((direction) => {
    const { rotatedBoard: newBoard, movements } = move(board, direction);
    setMovements(movements);

    // Esperar a que termine la animación antes de actualizar el tablero
    setTimeout(() => {
      addRandomTile(newBoard); // Añadir un nuevo número
      setBoard(newBoard);
      setMovements([]);

      // Verificar si el juego ha terminado
      if (checkGameOver(newBoard)) {
        setGameOver(true);
        saveMaxScore(score);
      }
    }, 200); // Duración de la animación
  }, [board]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;

      if (e.key === "ArrowUp") handleMove(0);
      else if (e.key === "ArrowRight") handleMove(1);
      else if (e.key === "ArrowDown") handleMove(2);
      else if (e.key === "ArrowLeft") handleMove(3);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board, gameOver, handleMove]); // Dependencias

  return (
    <>
      <h1>2048</h1>
      <Board board={board} movements={movements} />
      <p>creado por <a href="https://github.com/JuanVel1" target='_blank'>JuanVel1</a></p>


      <p>
        Cómo se juega : Utiliza <strong> las flechas del teclado </strong> para mover las fichas.
        Cuando dos fichas con el mismo número se tocan, <strong>¡se fusionan en una!</strong>
      </p>
      <p>
        Basado en <a href="https://play2048.co/">play2048.co</a>.
      </p>
      <button onClick={() => setGameOver(false) || setBoard(generateInitialBoard())}>
        Nuevo juego
      </button>
      <div className='scores-container'> 
        <div className='scores'>
          <div>Tu puntaje : {score}</div>
          <div>Puntaje máximo : {maxScore}</div>
        </div>
      </div>
    </>
  );
}


export default App

function generateInitialBoard() {
  const newBoard = Array(4).fill().map(() => Array(4).fill(0));
  addRandomTile(newBoard);
  addRandomTile(newBoard);
  return newBoard;
}

function addRandomTile(board) {
  const emptyTiles = [];
  board.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (cell === 0) emptyTiles.push([i, j]);
    })
  );

  if (emptyTiles.length > 0) {
    const [x, y] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[x][y] = 2;
  }
}

function move(board, direction) {
  let movements = []; // Para guardar las animaciones de las celdas
  let rotatedBoard = rotateBoard(board, direction); // Rota el tablero según la dirección
  rotatedBoard = rotatedBoard.map(processRow); // Procesa cada fila
  rotatedBoard = rotateBoard(rotatedBoard, -direction); // Deshace la rotación
  // Por cada movimiento registrado:
  movements.push({ from: { row: 1, col: 2 }, to: { row: 1, col: 3 } });

  return { rotatedBoard, movements };
}


function processRow(row) {
  const slidedRow = slide(row);
  const combinedRow = combine(slidedRow);
  return slide(combinedRow);
}

function combine(row) {
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1] && row[i] !== 0) {
      row[i] *= 2; // Combina los valores 
      score += row[i]; // Actualiza la puntuación
      row[i + 1] = 0; // Vacía la celda combinada
    }
  }
  return row;
}

function slide(row) {
  const filteredRow = row.filter(num => num !== 0); // Quita los ceros
  const zeros = Array(4 - filteredRow.length).fill(0); // Rellena con ceros
  return [...filteredRow, ...zeros];
}

function rotateBoard(board, rotations) {
  // Copia profunda del tablero para evitar mutaciones
  const newBoard = JSON.parse(JSON.stringify(board));

  // Aplica la rotación en pasos de 90 grados
  for (let i = 0; i < Math.abs(rotations); i++) {
    if (rotations > 0) {
      // Rotación de 90° en sentido horario
      for (let row = 0; row < newBoard.length; row++) {
        for (let col = row; col < newBoard.length; col++) {
          // Intercambiar elementos (transponer)
          [newBoard[row][col], newBoard[col][row]] = [
            newBoard[col][row],
            newBoard[row][col],
          ];
        }
      }
      // Invertir las filas
      newBoard.forEach(row => row.reverse());
    } else {
      // Rotación de -90° (sentido antihorario)
      for (let row = 0; row < newBoard.length; row++) {
        for (let col = row; col < newBoard.length; col++) {
          [newBoard[row][col], newBoard[col][row]] = [
            newBoard[col][row],
            newBoard[row][col],
          ];
        }
      }
      // Invertir las columnas
      newBoard.reverse();
    }
  }

  return newBoard;
}


function checkGameOver(board) {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 0) return false;
      if (col < board[row].length - 1 && board[row][col] === board[row][col + 1]) return false;
      if (row < board.length - 1 && board[row][col] === board[row + 1][col]) return false;
    }
  }
  return true;
}

function saveMaxScore(score) {
  if (score > maxScore) {
    localStorage.setItem("maxScore", score);
  }
}




