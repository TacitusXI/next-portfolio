import { ChessDesign, CustomSquareStyleOptions } from '../types';
import { CSSProperties } from 'react';

const NeoTechDesign: ChessDesign = {
  name: 'NeoTech',
  boardColors: {
    lightSquares: '#1a2333',
    darkSquares: '#0e1521',
    selected: 'rgba(67, 97, 238, 0.5)',
    validMove: 'rgba(67, 97, 238, 0.3)',
    lastMove: 'rgba(67, 97, 238, 0.2)',
    check: 'rgba(220, 53, 69, 0.6)',
    checkmate: 'rgba(220, 53, 69, 0.8)',
  },
  boardContainerStyles: {
    borderRadius: '4px',
    boxShadow: '0 0 0 1px #253146, 0 0 0 4px #0e1219, 0 0 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.3)',
    backgroundColor: '#0e1219',
    position: 'relative',
  } as CSSProperties,
  generateCustomSquareStyles: (options: CustomSquareStyleOptions) => {
    const { selectedSquare, validMoves, lastMove, gameState } = options;
    const styles: { [square: string]: CSSProperties } = {};
    
    // Selected square
    if (selectedSquare) {
      styles[selectedSquare] = {
        boxShadow: 'inset 0 0 0 2px rgba(67, 97, 238, 0.7)',
        position: 'relative',
        zIndex: 2,
      };
      
      // Valid moves for selected piece
      if (validMoves[selectedSquare]) {
        validMoves[selectedSquare].forEach(square => {
          styles[square] = {
            background: 'rgba(67, 97, 238, 0.3)',
            borderRadius: '0',
          };
        });
      }
    }
    
    // Last move highlighting
    if (lastMove) {
      styles[lastMove.from] = {
        background: 'rgba(67, 97, 238, 0.2)',
        borderRadius: '0',
      };
      styles[lastMove.to] = {
        background: 'rgba(67, 97, 238, 0.2)',
        borderRadius: '0',
      };
    }
    
    // Check and checkmate
    if (gameState === 'check' || gameState === 'checkmate') {
      const kingSquare = Object.keys(validMoves).find(
        square => validMoves[square].length === 0
      );
      if (kingSquare) {
        styles[kingSquare] = {
          background: gameState === 'check' 
            ? 'rgba(220, 53, 69, 0.6)' 
            : 'rgba(220, 53, 69, 0.8)',
          position: 'relative',
        };
      }
    }
    
    return styles;
  },
  boardStyles: {
    border: '1px solid #253146',
    borderRadius: '4px',
    overflow: 'hidden',
  } as CSSProperties,
  squareStyles: {
    light: {
      backgroundColor: '#1a2333',
      color: 'rgba(255, 255, 255, 0.7)',
      position: 'relative',
    } as CSSProperties,
    dark: {
      backgroundColor: '#0e1521',
      color: 'rgba(255, 255, 255, 0.7)',
      position: 'relative',
    } as CSSProperties,
  },
  selectedSquareStyles: {
    boxShadow: 'inset 0 0 0 2px rgba(67, 97, 238, 0.7)',
    position: 'relative',
    zIndex: 2,
  } as CSSProperties,
  lastMoveSquareStyles: {
    backgroundColor: 'rgba(67, 97, 238, 0.2)',
    borderRadius: '0',
  } as CSSProperties,
  validMoveSquareStyles: {
    backgroundColor: 'rgba(67, 97, 238, 0.3)',
    borderRadius: '0',
  } as CSSProperties,
  pieceStyles: {
    filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3))',
    transition: 'transform 0.15s',
  } as CSSProperties,
  draggedPieceStyles: {
    filter: 'drop-shadow(0 5px 8px rgba(0, 0, 0, 0.5))',
    cursor: 'grabbing',
  } as CSSProperties,
  infoContainerStyles: {
    backgroundColor: 'rgba(10, 14, 20, 0.8)',
    borderRadius: '4px',
    padding: '15px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'monospace',
    border: '1px solid rgba(67, 97, 238, 0.3)',
  } as CSSProperties,
  statusTextStyles: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    fontWeight: 500,
    textShadow: '0 0 10px rgba(67, 97, 238, 0.5)',
  } as CSSProperties,
  historyContainerStyles: {
    backgroundColor: 'rgba(10, 14, 20, 0.6)',
    borderRadius: '3px',
    padding: '10px',
    maxHeight: '150px',
    overflowY: 'auto',
    fontFamily: 'monospace',
    fontSize: '12px',
    border: '1px solid rgba(67, 97, 238, 0.2)',
  } as CSSProperties,
  historyHeaderStyles: {
    color: 'rgba(67, 97, 238, 0.9)',
    fontSize: '13px',
    marginBottom: '8px',
    fontWeight: 'bold',
    borderBottom: '1px solid rgba(67, 97, 238, 0.2)',
    paddingBottom: '5px',
  } as CSSProperties,
  historyTextStyles: {
    cursor: 'pointer',
    padding: '2px 5px',
    borderRadius: '2px',
    transition: 'background-color 0.2s',
  } as CSSProperties,
  selectedHistoryBackground: 'rgba(67, 97, 238, 0.2)',
  controlsContainerStyles: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
  } as CSSProperties,
  buttonStyles: {
    backgroundColor: 'rgba(14, 18, 25, 0.8)',
    border: '1px solid rgba(67, 97, 238, 0.4)',
    color: 'rgba(255, 255, 255, 0.8)',
    padding: '6px 12px',
    borderRadius: '3px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'monospace',
  } as CSSProperties,
  buttonHoverStyles: {
    backgroundColor: 'rgba(67, 97, 238, 0.2)',
    border: '1px solid rgba(67, 97, 238, 0.6)',
  } as CSSProperties,
  activeButtonStyles: {
    backgroundColor: 'rgba(67, 97, 238, 0.3)',
    border: '1px solid rgba(67, 97, 238, 0.8)',
  } as CSSProperties,
  disabledButtonStyles: {
    opacity: 0.5,
    cursor: 'not-allowed',
  } as CSSProperties,
  dropdownStyles: {
    backgroundColor: 'rgba(14, 18, 25, 0.8)',
    border: '1px solid rgba(67, 97, 238, 0.4)',
    color: 'rgba(255, 255, 255, 0.8)',
    padding: '5px 10px',
    borderRadius: '3px',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: 'monospace',
  } as CSSProperties,
};

export default NeoTechDesign; 