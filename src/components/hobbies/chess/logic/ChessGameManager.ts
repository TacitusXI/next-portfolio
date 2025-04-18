import { Chess, Square } from 'chess.js';
import { 
  ChessGame, 
  GameState, 
  PlayerSide, 
  LastMove,
  FormattedMove
} from '../types';

import { 
  evaluateSimpleMove, 
  fetchStockfishMove,
  WHITE_OPENING,
  BLACK_OPENING
} from './ChessEngine';

export interface GameManagerProps {
  onGameUpdate: (game: ChessGame) => void;
  onMoveHistoryUpdate: (moves: string[]) => void;
  onLastMoveUpdate: (lastMove: LastMove | null) => void;
  onGameStateChange: (state: GameState) => void;
  onStatusMessageChange: (message: string) => void;
  onThinkingChange: (isThinking: boolean) => void;
}

export class ChessGameManager {
  private game: ChessGame;
  private moveHistory: string[] = [];
  private lastMove: LastMove | null = null;
  private gameState: GameState = 'playing';
  private playerSide: PlayerSide = null;
  private isThinking: boolean = false;
  private props: GameManagerProps;

  constructor(props: GameManagerProps) {
    this.game = new Chess();
    this.props = props;
  }

  public resetGame(): void {
    this.game = new Chess();
    this.moveHistory = [];
    this.lastMove = null;
    this.gameState = 'playing';
    this.playerSide = null;
    this.isThinking = false;
    
    this.updateAll();
    this.props.onStatusMessageChange("Make a move or choose a side");
  }

  public setPlayerSide(side: PlayerSide): void {
    this.playerSide = side;
    
    // Update status message
    this.props.onStatusMessageChange(
      side === 'w' ? "Your turn (White)" : "Bot's turn (Black)"
    );
    
    // If player chooses black, let the bot make the first move
    if (side === 'b') {
      this.makeBotMove();
    }
  }

  public handleSquareClick(square: Square): boolean {
    // Auto-select white as player side if not chosen yet and clicking on a white piece
    if (!this.playerSide) {
      const piece = this.game.get(square);
      if (piece && piece.color === 'w') {
        console.log('Auto-selecting white as player side');
        this.setPlayerSide('w');
        return true;
      }
      return false;
    }
    
    return true;
  }

  public makeMove(move: { from: Square; to: Square; promotion?: string }): boolean {
    if (!this.playerSide || this.isThinking || this.gameState !== 'playing') {
      return false;
    }
    
    try {
      // Ensure we're only moving the player's pieces
      const pieceColor = this.game.get(move.from)?.color;
      if (pieceColor !== this.playerSide || this.game.turn() !== this.playerSide) {
        return false;
      }
      
      const result = this.game.move(move);
      
      if (result) {
        this.moveHistory.push(result.san);
        this.lastMove = {
          from: move.from,
          to: move.to
        };
        
        this.checkGameOver();
        this.updateAll();
        
        // Have the bot respond if the game isn't over
        if (this.gameState === 'playing') {
          setTimeout(() => {
            this.makeBotMove();
          }, 500);
        }
        
        return true;
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
    
    return false;
  }

  public async makeBotMove(): Promise<void> {
    // Don't proceed if it's not bot's turn
    if (
      !this.playerSide || 
      this.game.isGameOver() || 
      this.gameState !== 'playing' || 
      this.game.turn() === this.playerSide
    ) {
      return;
    }
    
    this.isThinking = true;
    this.props.onThinkingChange(true);
    
    try {
      // If we have the predefined opening moves, prefer those
      const moveHistory = this.game.history({ verbose: true });
      const isWhite = this.game.turn() === 'w';
      const openingMoves = isWhite ? WHITE_OPENING : BLACK_OPENING;
      
      if (moveHistory.length < openingMoves.length) {
        // Get the next opening move
        const nextOpeningMove = openingMoves[moveHistory.length];
        
        // Check if the move is legal
        const moves = this.game.moves({ verbose: true });
        const matchingOpeningMove = moves.find(m => 
          m.from === nextOpeningMove.from && m.to === nextOpeningMove.to
        );
        
        if (matchingOpeningMove) {
          // Use the opening move
          console.log('Playing opening move:', matchingOpeningMove.san);
          
          // Short delay to simulate thinking
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const move = this.game.move(matchingOpeningMove);
          
          if (move) {
            this.moveHistory.push(move.san);
            this.lastMove = {
              from: move.from,
              to: move.to
            };
            
            this.checkGameOver();
            this.updateAll();
            return;
          }
        }
      }
      
      // First try the online Stockfish API
      const stockfishMove = await fetchStockfishMove(this.game.fen());
      
      if (stockfishMove) {
        const move = this.game.move(stockfishMove);
        
        if (move) {
          this.moveHistory.push(move.san);
          this.lastMove = {
            from: move.from,
            to: move.to
          };
          
          this.checkGameOver();
          this.updateAll();
          return;
        }
      }
      
      // Use improved local evaluation
      console.log("Using improved local evaluation...");
      const bestMove = evaluateSimpleMove(this.game);
      
      if (bestMove) {
        // Short delay to simulate thinking
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const move = this.game.move(bestMove);
        if (move) {
          this.moveHistory.push(move.san);
          this.lastMove = {
            from: move.from,
            to: move.to
          };
          
          this.checkGameOver();
          this.updateAll();
          return;
        }
      }
      
      // Last resort: make any random legal move
      const moves = this.game.moves({ verbose: true });
      if (moves.length > 0) {
        const randomIndex = Math.floor(Math.random() * moves.length);
        const move = this.game.move(moves[randomIndex]);
        
        if (move) {
          this.moveHistory.push(move.san);
          this.lastMove = {
            from: move.from,
            to: move.to
          };
          
          this.checkGameOver();
          this.updateAll();
          return;
        }
      }
    } catch (error) {
      console.error('Error getting bot move:', error);
    } finally {
      this.isThinking = false;
      this.props.onThinkingChange(false);
    }
  }

  public formatMoves(): FormattedMove[] {
    const result: FormattedMove[] = [];
    
    for (let i = 0; i < this.moveHistory.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1;
      const whiteMove = this.moveHistory[i] || '';
      const blackMove = this.moveHistory[i + 1] || '';
      
      result.push({ 
        moveNumber,
        whiteMove,
        blackMove,
        whiteIndex: i,
        blackIndex: i + 1
      });
    }
    
    return result;
  }

  private checkGameOver(): void {
    if (this.game.isGameOver()) {
      if (this.game.isCheckmate()) {
        this.gameState = 'checkmate';
        
        // Determine winner
        const winner = this.game.turn() === 'w' ? 'black' : 'white';
        const isUserWin = 
          (this.playerSide === 'w' && winner === 'white') || 
          (this.playerSide === 'b' && winner === 'black');
        
        this.props.onStatusMessageChange(
          isUserWin ? 'Victory! Checkmate!' : 'Defeat! You were checkmated!'
        );
      } else if (this.game.isDraw()) {
        this.gameState = 'draw';
        this.props.onStatusMessageChange('Game ended in a draw');
      } else if (this.game.isStalemate()) {
        this.gameState = 'stalemate';
        this.props.onStatusMessageChange('Stalemate - game drawn');
      }
      
      this.props.onGameStateChange(this.gameState);
    }
  }

  private updateAll(): void {
    this.props.onGameUpdate(this.game);
    this.props.onMoveHistoryUpdate([...this.moveHistory]);
    this.props.onLastMoveUpdate(this.lastMove);
    this.props.onGameStateChange(this.gameState);
  }

  public getGame(): ChessGame {
    return this.game;
  }

  public getMoveHistory(): string[] {
    return [...this.moveHistory];
  }

  public getLastMove(): LastMove | null {
    return this.lastMove;
  }

  public getGameState(): GameState {
    return this.gameState;
  }

  public getPlayerSide(): PlayerSide {
    return this.playerSide;
  }

  public isInThinkingState(): boolean {
    return this.isThinking;
  }
} 