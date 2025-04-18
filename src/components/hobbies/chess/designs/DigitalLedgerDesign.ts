import { ChessDesign, CustomSquareStyleOptions } from '../types';

const DigitalLedgerDesign: ChessDesign = {
  name: 'Digital Ledger',
  boardColors: {
    lightSquares: '#2a4c6d',
    darkSquares: '#1a2c3d',
    selected: 'rgba(0, 255, 136, 0.4)',
    validMove: 'rgba(0, 255, 136, 0.2)',
    lastMove: 'rgba(66, 184, 255, 0.3)',
    check: 'rgba(255, 97, 97, 0.5)',
    checkmate: 'rgba(255, 0, 0, 0.7)'
  },
  boardContainerStyles: {
    maxWidth: '910px',
    width: '100%',
    marginBottom: '2rem',
    position: 'relative',
    aspectRatio: '1',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(10, 10, 10, 0.9)',
    boxShadow: '0 0 20px rgba(0, 255, 136, 0.3), 0 0 40px rgba(0, 0, 0, 0.5)',
    borderRadius: '4px',
    border: '2px solid rgba(0, 255, 136, 0.4)',
    overflow: 'hidden',
    animation: 'neonBorderGlow 3s infinite ease-in-out',
  },
  generateCustomSquareStyles: (options: CustomSquareStyleOptions) => {
    const { selectedSquare, validMoves, lastMove, gameState } = options;
    const styles: { [square: string]: React.CSSProperties } = {};
    
    // Highlight selected square
    if (selectedSquare) {
      styles[selectedSquare] = {
        background: 'rgba(0, 255, 136, 0.4)',
        boxShadow: 'inset 0 0 10px rgba(0, 255, 136, 0.6)',
        animation: 'pulse 1.5s infinite',
      };
    }
    
    // Highlight valid moves
    if (validMoves) {
      Object.keys(validMoves).forEach(fromSquare => {
        validMoves[fromSquare].forEach(toSquare => {
          styles[toSquare] = {
            background: 'rgba(0, 255, 136, 0.2)',
            boxShadow: 'inset 0 0 8px rgba(0, 255, 136, 0.3)',
            position: 'relative',
          };
        });
      });
    }
    
    // Show last move
    if (lastMove) {
      styles[lastMove.from] = {
        background: 'rgba(66, 184, 255, 0.3)',
        boxShadow: 'inset 0 0 12px rgba(66, 184, 255, 0.4)'
      };
      styles[lastMove.to] = {
        background: 'rgba(66, 184, 255, 0.4)',
        boxShadow: 'inset 0 0 15px rgba(66, 184, 255, 0.5)'
      };
    }
    
    // Check and checkmate highlighting
    if (gameState === 'check' || gameState === 'checkmate') {
      // We would need to find the king's square here, but without that information
      // we can't highlight it specifically
    }
    
    return styles;
  },
  boardStyles: {
    maxWidth: '100%',
    aspectRatio: '1',
    width: '100%',
    borderRadius: '2px',
    background: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  squareStyles: {
    light: {
      background: '#2a4c6d',
      backgroundImage: 'radial-gradient(rgba(0, 255, 136, 0.05) 1px, transparent 1px)',
      backgroundSize: '8px 8px',
    },
    dark: {
      background: '#1a2c3d',
      backgroundImage: 'radial-gradient(rgba(0, 255, 136, 0.08) 1px, transparent 1px)',
      backgroundSize: '8px 8px',
    }
  },
  selectedSquareStyles: {
    boxShadow: 'inset 0 0 10px rgba(0, 255, 136, 0.6)',
    animation: 'pulse 1.5s infinite',
  },
  lastMoveSquareStyles: {
    boxShadow: 'inset 0 0 12px rgba(66, 184, 255, 0.4)',
  },
  validMoveSquareStyles: {
    boxShadow: 'inset 0 0 8px rgba(0, 255, 136, 0.3)',
  },
  pieceStyles: {
    cursor: 'grab',
  },
  draggedPieceStyles: {
    filter: 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.9))',
    transform: 'scale(1.1)',
  },
  infoContainerStyles: {
    background: 'linear-gradient(135deg, #1d2b3a 0%, #0f1923 100%)',
    borderRadius: '8px',
    padding: '1.5rem',
    border: '1px solid rgba(0, 255, 136, 0.2)',
    color: '#e0e0e0',
    fontFamily: 'monospace',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  },
  statusTextStyles: {
    color: '#00ff88',
    fontWeight: 600,
    textAlign: 'center',
    textShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
    padding: '0.5rem',
    borderBottom: '1px solid rgba(0, 255, 136, 0.2)',
    marginBottom: '1rem',
  },
  historyContainerStyles: {
    padding: '0.5rem',
    background: 'rgba(13, 25, 33, 0.5)',
    borderRadius: '4px',
    maxHeight: '200px',
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: '#00ff88 #0f1923',
  },
  historyHeaderStyles: {
    color: '#42b8ff',
    fontWeight: 600,
    textAlign: 'center',
    borderBottom: '1px solid rgba(66, 184, 255, 0.3)',
    padding: '0.25rem',
  },
  historyTextStyles: {
    textAlign: 'center',
    padding: '0.25rem',
    fontFamily: 'monospace',
  },
  selectedHistoryBackground: 'rgba(0, 255, 136, 0.15)',
  controlsContainerStyles: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
    flexWrap: 'wrap',
  },
  buttonStyles: {
    background: 'rgba(13, 25, 33, 0.7)',
    color: '#00ff88',
    border: '1px solid rgba(0, 255, 136, 0.3)',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontFamily: 'monospace',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  buttonHoverStyles: {
    background: 'rgba(0, 255, 136, 0.1)',
    boxShadow: '0 0 8px rgba(0, 255, 136, 0.5)',
  },
  activeButtonStyles: {
    background: 'rgba(0, 255, 136, 0.2)',
    boxShadow: '0 0 12px rgba(0, 255, 136, 0.6)',
  },
  disabledButtonStyles: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  dropdownStyles: {
    background: 'rgba(13, 25, 33, 0.7)',
    color: '#e0e0e0',
    border: '1px solid rgba(0, 255, 136, 0.3)',
    borderRadius: '4px',
    fontFamily: 'monospace',
  },
};

export default DigitalLedgerDesign; 