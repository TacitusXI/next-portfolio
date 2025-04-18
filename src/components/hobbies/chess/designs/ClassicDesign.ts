import { ChessDesign, CustomSquareStyleOptions } from '../types';

const ClassicDesign: ChessDesign = {
  name: 'Classic',
  boardColors: {
    lightSquares: '#f0d9b5',
    darkSquares: '#b58863',
    selected: 'rgba(20, 85, 30, 0.5)',
    validMove: 'rgba(20, 85, 30, 0.3)',
    lastMove: 'rgba(100, 100, 100, 0.3)',
    check: 'rgba(255, 0, 0, 0.4)',
    checkmate: 'rgba(255, 0, 0, 0.6)'
  },
  boardContainerStyles: {
    width: '100%',
    maxWidth: '500px',
    marginBottom: '1.5rem',
    position: 'relative',
    aspectRatio: '1/1',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    borderRadius: '4px',
    background: '#8b5a2b',
  },
  infoContainerStyles: {
    width: '100%',
    background: '#f5f5f5',
    borderRadius: '4px',
    padding: '1.5rem',
    border: '1px solid #ddd',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    color: '#333',
    position: 'relative',
  },
  buttonStyles: {
    background: '#4d4d4d',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    width: '100%',
  },
  generateCustomSquareStyles: (options: CustomSquareStyleOptions) => {
    const { selectedSquare, validMoves, lastMove } = options;
    const styles: Record<string, React.CSSProperties> = {};
    
    // Highlight selected square
    if (selectedSquare) {
      styles[selectedSquare] = {
        background: 'rgba(20, 85, 30, 0.5)',
      };
    }
    
    // Highlight valid move destinations
    if (validMoves) {
      Object.keys(validMoves).forEach(fromSquare => {
        validMoves[fromSquare].forEach(toSquare => {
          styles[toSquare] = {
            background: 'rgba(20, 85, 30, 0.3)',
            position: 'relative',
          };
        });
      });
    }
    
    // Show last move
    if (lastMove) {
      styles[lastMove.from] = {
        background: 'rgba(100, 100, 100, 0.3)'
      };
      styles[lastMove.to] = {
        background: 'rgba(100, 100, 100, 0.3)'
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
      backgroundColor: '#f0d9b5',
    },
    dark: {
      backgroundColor: '#b58863',
    },
  },
  selectedSquareStyles: {
    background: 'rgba(20, 85, 30, 0.5)',
  },
  lastMoveSquareStyles: {
    background: 'rgba(100, 100, 100, 0.3)',
  },
  validMoveSquareStyles: {
    background: 'rgba(20, 85, 30, 0.3)',
  },
  pieceStyles: {},
  draggedPieceStyles: {
    transform: 'scale(1.1)',
  },
  statusTextStyles: {
    fontWeight: 600,
    color: '#333',
  },
  historyContainerStyles: {
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  historyHeaderStyles: {
    fontWeight: 600,
    background: '#f5f5f5',
  },
  historyTextStyles: {
    padding: '0.25rem',
  },
  selectedHistoryBackground: '#e6f7ff',
  controlsContainerStyles: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  buttonHoverStyles: {
    background: '#333',
  },
  activeButtonStyles: {
    background: '#1890ff',
  },
  disabledButtonStyles: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  dropdownStyles: {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '0.5rem',
  }
};

export default ClassicDesign; 