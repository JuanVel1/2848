import Tile from './Tile';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

function Board({ board, movements }) {
    useEffect(() => {
        // Cuando se mueve o combinan las celdas, se activan las animaciones
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
          // Remover las clases de animación después de que se complete la animación
          cell.addEventListener('animationend', () => {
            cell.classList.remove('new', 'merged');
          });
        });
      }, [board]); // Dependencia de `board` para aplicar las animaciones cuando cambia
    

    return (
        <>

            <div className="grid-container board">
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const movement = movements.find(
                            (m) => m.from.row === rowIndex && m.from.col === colIndex
                        );
                        const animationClass = movement
                            ? `move-to-${movement.to.row}-${movement.to.col}`
                            : "";

                        return (
                            <Tile
                                key={`${rowIndex}-${colIndex}`}
                                value={cell}
                                cellKey={`${rowIndex}-${colIndex}`}
                                className={`cell ${animationClass}`}
                            >
                                {cell !== 0 ? cell : ""}
                            </Tile>
                        );
                    })
                )}
            </div>
        </>
    )
}

Board.propTypes = {
    board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    movements: PropTypes.arrayOf(
        PropTypes.shape({
            from: PropTypes.shape({
                row: PropTypes.number.isRequired,
                col: PropTypes.number.isRequired,
            }).isRequired,
            to: PropTypes.shape({
                row: PropTypes.number.isRequired,
                col: PropTypes.number.isRequired,
            }).isRequired,
        })
    ).isRequired,
};

export default Board;