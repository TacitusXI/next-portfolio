import { ChessDesign, CustomSquareStyleOptions } from '../types';

const CyberpunkDesign: ChessDesign = {
  name: 'Cyberpunk',
  boardColors: {
    lightSquares: '#434364',
    darkSquares: '#232336',
    selected: 'rgba(0, 242, 96, 0.2)',
    validMove: 'rgba(0, 242, 96, 0.1)',
    lastMove: 'rgba(153, 69, 255, 0.15)',
    check: 'rgba(255, 60, 60, 0.3)',
    checkmate: 'rgba(255, 60, 60, 0.5)'
  },
  boardContainerStyles: {
    width: '100%',
    maxWidth: '910px',
    marginBottom: '1.5rem',
    position: 'relative',
    aspectRatio: '1/1',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainerStyles: {
    width: '100%',
    background: 'rgba(30, 30, 40, 0.7)',
    borderRadius: '10px',
    padding: '1.5rem',
    border: '1px solid rgba(153, 69, 255, 0.2)',
    zIndex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  buttonStyles: {
    background: 'rgba(153, 69, 255, 0.2)',
    color: 'rgb(153, 69, 255)',
    border: '1px solid rgba(153, 69, 255, 0.3)',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  generateCustomSquareStyles: (options: CustomSquareStyleOptions) => {
    const { selectedSquare, validMoves, lastMove } = options;
    const styles: Record<string, React.CSSProperties> = {};
    
    // Highlight selected square
    if (selectedSquare) {
      styles[selectedSquare] = {
        boxShadow: 'inset 0 0 15px rgba(0, 242, 96, 0.7)',
        backgroundColor: 'rgba(0, 242, 96, 0.2)'
      };
    }
    
    // Highlight valid move destinations
    if (validMoves) {
      Object.keys(validMoves).forEach(fromSquare => {
        validMoves[fromSquare].forEach(toSquare => {
          styles[toSquare] = {
            boxShadow: 'inset 0 0 15px rgba(0, 242, 96, 0.4)',
            backgroundColor: 'rgba(0, 242, 96, 0.1)',
            position: 'relative',
          };
        });
      });
    }
    
    // Show last move
    if (lastMove) {
      styles[lastMove.from] = {
        boxShadow: 'inset 0 0 15px rgba(153, 69, 255, 0.5)',
        backgroundColor: 'rgba(153, 69, 255, 0.1)'
      };
      styles[lastMove.to] = {
        boxShadow: 'inset 0 0 20px rgba(153, 69, 255, 0.7)',
        backgroundColor: 'rgba(153, 69, 255, 0.15)'
      };
    }
    
    return styles;
  },
  boardStyles: {
    width: '100%',
    height: '100%',
  },
  squareStyles: {
    light: {
      backgroundColor: '#434364',
    },
    dark: {
      backgroundColor: '#232336',
    },
  },
  selectedSquareStyles: {
    boxShadow: 'inset 0 0 15px rgba(0, 242, 96, 0.7)',
    backgroundColor: 'rgba(0, 242, 96, 0.2)'
  },
  lastMoveSquareStyles: {
    boxShadow: 'inset 0 0 15px rgba(153, 69, 255, 0.5)',
    backgroundColor: 'rgba(153, 69, 255, 0.1)'
  },
  validMoveSquareStyles: {
    boxShadow: 'inset 0 0 15px rgba(0, 242, 96, 0.4)', 
    backgroundColor: 'rgba(0, 242, 96, 0.1)'
  },
  pieceStyles: {},
  draggedPieceStyles: {
    transform: 'scale(1.2)',
    filter: 'drop-shadow(0 0 5px rgba(0, 242, 96, 0.7))'
  },
  statusTextStyles: {
    color: '#fff',
    fontWeight: 600,
  },
  historyContainerStyles: {},
  historyHeaderStyles: {
    color: 'rgba(153, 69, 255, 0.9)',
    fontWeight: 600,
  },
  historyTextStyles: {
    color: '#ccc',
  },
  selectedHistoryBackground: 'rgba(0, 242, 96, 0.1)',
  controlsContainerStyles: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  buttonHoverStyles: {
    background: 'rgba(153, 69, 255, 0.3)',
  },
  activeButtonStyles: {
    background: 'rgba(153, 69, 255, 0.4)',
  },
  disabledButtonStyles: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  dropdownStyles: {
    background: 'rgba(35, 35, 45, 0.95)',
    color: '#fff',
    border: '1px solid rgba(153, 69, 255, 0.3)'
  }
};

export default CyberpunkDesign; 