import React from 'react';
import { ChessGame, GameHistoryItem, ChessDesign } from '../types';
import { Color } from 'chess.js';

// Define interface to match the actual usage
interface ChessInfoProps {
  gameState: ChessGame;
  design: ChessDesign;
  history: GameHistoryItem[];
  onSelectHistoryMove: (index: number) => void;
  selectedHistoryIndex: number | null;
}

const ChessInfo: React.FC<ChessInfoProps> = ({
  gameState,
  design,
  history,
  onSelectHistoryMove,
  selectedHistoryIndex,
}) => {
  // Determine game status
  let statusText = `${gameState.turn() === 'w' ? 'White' : 'Black'} to move`;
  
  if (gameState.isCheckmate()) {
    statusText = `Checkmate! ${gameState.turn() === 'w' ? 'Black' : 'White'} wins`;
  } else if (gameState.isDraw()) {
    statusText = "Game ended in draw";
  } else if (gameState.isStalemate()) {
    statusText = "Stalemate";
  } else if (gameState.isThreefoldRepetition()) {
    statusText = "Draw by repetition";
  } else if (gameState.isInsufficientMaterial()) {
    statusText = "Draw by insufficient material";
  } else if (gameState.isCheck()) {
    statusText = `${gameState.turn() === 'w' ? 'White' : 'Black'} is in check`;
  }

  // Format history
  const formattedHistory = history.map((move, index) => {
    const moveNumber = Math.floor(index / 2) + 1;
    const isWhiteMove = index % 2 === 0;
    
    return {
      moveNumber,
      side: isWhiteMove ? 'w' as Color : 'b' as Color,
      notation: move.move?.san || "",
      index,
    };
  });

  return (
    <div 
      className="chess-info"
      style={{
        padding: '1rem',
        ...design.infoContainerStyles,
      }}
    >
      <div 
        className="chess-status"
        style={{
          marginBottom: '1rem',
          ...design.statusTextStyles,
        }}
      >
        {statusText}
      </div>
      
      <div 
        className="chess-history"
        style={{
          height: '200px',
          overflowY: 'auto',
          ...design.historyContainerStyles,
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...design.historyHeaderStyles }}>Move</th>
              <th style={{ ...design.historyHeaderStyles }}>White</th>
              <th style={{ ...design.historyHeaderStyles }}>Black</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(new Array(Math.ceil(formattedHistory.length / 2))).map((_, rowIndex) => {
              const moveNumber = rowIndex + 1;
              const whiteIndex = rowIndex * 2;
              const blackIndex = rowIndex * 2 + 1;
              const whiteMove = formattedHistory[whiteIndex];
              const blackMove = formattedHistory[blackIndex];
              
              return (
                <tr key={moveNumber}>
                  <td style={{ ...design.historyTextStyles, textAlign: 'center' }}>{moveNumber}.</td>
                  <td 
                    onClick={() => whiteMove && onSelectHistoryMove(whiteMove.index)}
                    style={{ 
                      ...design.historyTextStyles, 
                      cursor: 'pointer',
                      background: selectedHistoryIndex === whiteIndex ? design.selectedHistoryBackground : 'transparent',
                    }}
                  >
                    {whiteMove?.notation || ''}
                  </td>
                  <td 
                    onClick={() => blackMove && onSelectHistoryMove(blackMove.index)}
                    style={{ 
                      ...design.historyTextStyles, 
                      cursor: blackMove ? 'pointer' : 'default',
                      background: selectedHistoryIndex === blackIndex ? design.selectedHistoryBackground : 'transparent',
                    }}
                  >
                    {blackMove?.notation || ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChessInfo; 