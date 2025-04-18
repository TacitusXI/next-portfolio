import React, { useEffect, useRef, useState } from 'react';
import { Color, Square } from 'chess.js';
import { 
  ChessGame, 
  ChessDesign, 
  LastMove, 
  PlayerSide
} from '../types';

interface ChessBoardProps {
  game: ChessGame;
  selectedSquare: Square | null;
  lastMove: LastMove | null;
  boardFlipped: boolean;
  playerSide: PlayerSide;
  validMoves: { [key: string]: Square[] };
  design: ChessDesign;
  onSquareClick: (square: Square) => void;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  game,
  selectedSquare,
  lastMove,
  boardFlipped,
  playerSide,
  validMoves,
  design,
  onSquareClick,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [draggingPiece, setDraggingPiece] = useState<{
    piece: string;
    square: Square;
    element: HTMLElement | null;
  } | null>(null);
  const customDraggedPieceRef = useRef<HTMLDivElement | null>(null);
  
  // Generate board squares
  const renderBoard = () => {
    const squares = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    
    // If board is flipped, reverse the ranks and files
    const displayFiles = boardFlipped ? [...files].reverse() : files;
    const displayRanks = boardFlipped ? ranks : [...ranks].reverse();
    
    // Generate custom square styles based on selected square, valid moves, and last move
    const gameState = game.isCheck() ? 'check' : 
                     game.isCheckmate() ? 'checkmate' : 
                     game.isDraw() ? 'draw' : 
                     game.isStalemate() ? 'stalemate' : 'playing';
    
    const customSquareStyles = design.generateCustomSquareStyles({
      selectedSquare,
      validMoves,
      lastMove,
      gameState,
    });
    
    for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
      for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
        const file = displayFiles[fileIndex];
        const rank = displayRanks[rankIndex];
        const square = `${file}${rank}` as Square;
        const isLightSquare = (fileIndex + rankIndex) % 2 === 0;
        
        // Base square color
        const squareColor = isLightSquare 
          ? design.boardColors.lightSquares 
          : design.boardColors.darkSquares;
        
        // Get piece at this square
        const piece = game.get(square);
        const pieceImageUrl = piece 
          ? `/assets/chess/pieces/${piece.color}${piece.type.toUpperCase()}.svg`
          : '';
        
        // Custom styles for this square
        const customStyle = customSquareStyles[square] || {};
        
        squares.push(
          <div
            key={square}
            data-square={square}
            className="square"
            onClick={() => onSquareClick(square)}
            onMouseDown={(e) => handleMouseDown(e, square, piece?.color, piece?.type)}
            onTouchStart={(e) => handleTouchStart(e, square, piece?.color, piece?.type)}
            style={{
              backgroundColor: squareColor,
              position: 'relative',
              width: '12.5%',
              height: '12.5%',
              ...customStyle,
            }}
          >
            {piece && (
              <div
                className="piece"
                data-piece={`${piece.color}${piece.type}`}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${pieceImageUrl})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  cursor: (playerSide === null || piece.color === playerSide) ? 'grab' : 'default',
                  zIndex: 1,
                }}
              />
            )}
          </div>
        );
      }
    }
    
    return squares;
  };
  
  // Create a custom dragged piece element
  const createCustomDraggedPiece = (
    pieceColor: Color,
    pieceType: string,
    targetElement: HTMLElement
  ) => {
    // Remove any existing custom dragged piece
    if (customDraggedPieceRef.current && customDraggedPieceRef.current.parentNode) {
      document.body.removeChild(customDraggedPieceRef.current);
    }
    
    // Get the piece element's size from the board
    const rect = targetElement.getBoundingClientRect();
    const pieceWidth = rect.width;
    const pieceHeight = rect.height;
    
    // Create a new div for the dragged piece
    const customDraggedPiece = document.createElement('div');
    customDraggedPiece.style.position = 'fixed';
    customDraggedPiece.style.width = `${pieceWidth}px`;
    customDraggedPiece.style.height = `${pieceHeight}px`;
    customDraggedPiece.style.backgroundImage = `url(/assets/chess/pieces/${pieceColor}${pieceType.toUpperCase()}.svg)`;
    customDraggedPiece.style.backgroundSize = 'contain';
    customDraggedPiece.style.backgroundRepeat = 'no-repeat';
    customDraggedPiece.style.backgroundPosition = 'center';
    customDraggedPiece.style.zIndex = '1000';
    customDraggedPiece.style.pointerEvents = 'none';
    customDraggedPiece.style.opacity = '0.8';
    
    // Add to body
    document.body.appendChild(customDraggedPiece);
    customDraggedPieceRef.current = customDraggedPiece;
    
    return customDraggedPiece;
  };
  
  // Update position of custom dragged piece
  const updatePosition = (clientX: number, clientY: number) => {
    if (customDraggedPieceRef.current) {
      const width = customDraggedPieceRef.current.offsetWidth;
      const height = customDraggedPieceRef.current.offsetHeight;
      
      // Center the piece on the cursor
      customDraggedPieceRef.current.style.left = `${clientX - width / 2}px`;
      customDraggedPieceRef.current.style.top = `${clientY - height / 2}px`;
    }
  };
  
  // Mouse event handlers
  const handleMouseDown = (
    e: React.MouseEvent,
    square: Square,
    pieceColor?: Color,
    pieceType?: string
  ) => {
    // Only allow dragging if it's the player's piece
    if (
      !pieceColor ||
      !pieceType ||
      (playerSide !== null && pieceColor !== playerSide)
    ) {
      return;
    }
    
    // Find the piece element
    let pieceElement: HTMLElement | null = null;
    const target = e.target as HTMLElement;
    
    // Check if clicked on the piece element
    if (target.classList.contains('piece')) {
      pieceElement = target;
    } else {
      // Check parent if clicked on a child of the piece element
      const parent = target.closest('.piece') as HTMLElement;
      if (parent) {
        pieceElement = parent;
      }
    }
    
    if (!pieceElement) return;
    
    e.preventDefault();
    
    // Create dragged piece element
    createCustomDraggedPiece(pieceColor, pieceType, pieceElement);
    
    // Set initial position
    updatePosition(e.clientX, e.clientY);
    
    // Set dragging state
    setDraggingPiece({
      piece: `${pieceColor}${pieceType}`,
      square,
      element: pieceElement
    });
    
    // Add event listeners for dragging
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleDragEnd);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    updatePosition(e.clientX, e.clientY);
  };
  
  // Touch event handlers
  const handleTouchStart = (
    e: React.TouchEvent,
    square: Square,
    pieceColor?: Color,
    pieceType?: string
  ) => {
    // Only allow dragging if it's the player's piece
    if (
      !pieceColor ||
      !pieceType ||
      (playerSide !== null && pieceColor !== playerSide)
    ) {
      return;
    }
    
    // Find the piece element
    let pieceElement: HTMLElement | null = null;
    const target = e.target as HTMLElement;
    
    // Check if touched on the piece element
    if (target.classList.contains('piece')) {
      pieceElement = target;
    } else {
      // Check parent if touched on a child of the piece element
      const parent = target.closest('.piece') as HTMLElement;
      if (parent) {
        pieceElement = parent;
      }
    }
    
    if (!pieceElement) return;
    
    // Prevent scrolling while dragging
    e.preventDefault();
    
    // Create dragged piece element
    createCustomDraggedPiece(pieceColor, pieceType, pieceElement);
    
    // Set initial position
    const touch = e.touches[0];
    updatePosition(touch.clientX, touch.clientY);
    
    // Set dragging state
    setDraggingPiece({
      piece: `${pieceColor}${pieceType}`,
      square,
      element: pieceElement
    });
    
    // Add event listeners for dragging
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    // Prevent scrolling while dragging
    e.preventDefault();
    const touch = e.touches[0];
    updatePosition(touch.clientX, touch.clientY);
  };
  
  // End dragging
  const handleDragEnd = (e: MouseEvent | TouchEvent) => {
    if (!draggingPiece) return;
    
    // Find the square under the cursor/touch point
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else {
        // No position information, just clean up
        cleanup();
        return;
      }
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Get square from position
    const boardRect = boardRef.current?.getBoundingClientRect();
    if (boardRect) {
      const relativeX = clientX - boardRect.left;
      const relativeY = clientY - boardRect.top;
      
      // Only proceed if cursor is over the board
      if (
        relativeX >= 0 &&
        relativeX < boardRect.width &&
        relativeY >= 0 &&
        relativeY < boardRect.height
      ) {
        // Calculate the square based on position
        const fileIndex = Math.floor((relativeX / boardRect.width) * 8);
        const rankIndex = Math.floor((relativeY / boardRect.height) * 8);
        
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
        
        // Adjust for board orientation
        const targetFiles = boardFlipped ? [...files].reverse() : files;
        const targetRanks = boardFlipped ? [...ranks].reverse() : ranks;
        
        const targetSquare = `${targetFiles[fileIndex]}${targetRanks[rankIndex]}` as Square;
        
        // Call the click handler with the target square
        onSquareClick(targetSquare);
      } else {
        // If dropped outside the board, click the original square to deselect
        onSquareClick(draggingPiece.square);
      }
    }
    
    // Clean up
    cleanup();
  };
  
  const handleTouchEnd = (e: TouchEvent) => {
    handleDragEnd(e);
  };
  
  // Clean up dragging state and event listeners
  const cleanup = () => {
    // Remove custom dragged piece
    if (customDraggedPieceRef.current && customDraggedPieceRef.current.parentNode) {
      document.body.removeChild(customDraggedPieceRef.current);
      customDraggedPieceRef.current = null;
    }
    
    // Reset dragging state
    setDraggingPiece(null);
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    document.removeEventListener('touchcancel', handleTouchEnd);
  };
  
  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
      
      // Remove custom dragged piece if it exists
      if (customDraggedPieceRef.current && customDraggedPieceRef.current.parentNode) {
        document.body.removeChild(customDraggedPieceRef.current);
      }
    };
  }, []);
  
  return (
    <div
      ref={boardRef}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        height: '100%',
        position: 'relative',
        ...design.boardContainerStyles,
      }}
    >
      {renderBoard()}
    </div>
  );
};

export default ChessBoard;

 