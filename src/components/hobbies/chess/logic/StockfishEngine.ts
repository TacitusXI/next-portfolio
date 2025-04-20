import { ChessGame } from '../types';

// Stockfish engine skill levels approximately map to these Elo ratings:
// Level 0: ~1100, Level 5: ~1400, Level 10: ~1700, Level 20: ~2100

// Constants for 1200 Elo rating (slightly above level 0)
const SKILL_LEVEL = 1;         // Lower skill level for ~1200 Elo
const DEPTH = 5;               // Limited depth search
const MAX_ANALYSIS_TIME = 500; // Limit thinking time in ms

// Class to handle Stockfish integration
export class StockfishEngine {
  private worker: Worker | null = null;
  private isReady = false;
  private onReady: (() => void) | null = null;
  private resolveMove: ((move: string) => void) | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  // Initialize the engine
  private initialize() {
    try {
      // Load Stockfish worker file instead of the main script
      this.worker = new Worker('/stockfish/stockfish.worker.js');
      
      this.worker.onmessage = (e) => {
        const message = e.data;
        
        // Ready message
        if (message === 'readyok') {
          this.isReady = true;
          if (this.onReady) {
            this.onReady();
            this.onReady = null;
          }
        }
        
        // Best move found
        if (message.startsWith('bestmove')) {
          const moveMatch = message.match(/bestmove\s+(\w+)/);
          if (moveMatch && this.resolveMove) {
            this.resolveMove(moveMatch[1]);
            this.resolveMove = null;
          }
        }
      };
      
      // Configure the engine for 1200 Elo
      this.sendCommand('uci');
      this.sendCommand('setoption name Skill Level value ' + SKILL_LEVEL);
      this.sendCommand('setoption name Use NNUE value false'); // Disable neural network for weaker play
      this.sendCommand('setoption name Contempt value 0'); // No contempt for draws
      this.sendCommand('setoption name MultiPV value 1'); // Only consider the best line
      this.sendCommand('isready');
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing Stockfish engine:', error);
    }
  }

  // Send a command to the engine
  private sendCommand(command: string) {
    if (this.worker) {
      this.worker.postMessage(command);
    }
  }

  // Wait for the engine to be ready
  private waitForReady(): Promise<void> {
    return new Promise((resolve) => {
      if (this.isReady) {
        resolve();
      } else {
        this.onReady = resolve;
      }
    });
  }

  // Get the best move from the current position
  async getBestMove(game: ChessGame): Promise<string> {
    // Reinitialize if needed
    if (!this.isInitialized && typeof window !== 'undefined') {
      this.initialize();
    }
    
    // Return a random move if the engine isn't available
    if (!this.worker) {
      return this.getRandomMove(game);
    }
    
    try {
      await this.waitForReady();
      
      return new Promise<string>((resolve) => {
        this.resolveMove = resolve;
        
        // Set the position and start searching
        this.sendCommand('position fen ' + game.fen());
        
        // Use a mix of low depth and time control for a 1200 rating
        this.sendCommand(`go depth ${DEPTH} movetime ${MAX_ANALYSIS_TIME}`);
        
        // Timeout fallback in case engine doesn't respond
        setTimeout(() => {
          if (this.resolveMove) {
            this.resolveMove(this.getRandomMove(game));
            this.resolveMove = null;
          }
        }, MAX_ANALYSIS_TIME + 500);
      });
    } catch (error) {
      console.error('Error getting move from Stockfish:', error);
      return this.getRandomMove(game);
    }
  }
  
  // Get a random legal move as fallback
  private getRandomMove(game: ChessGame): string {
    const moves = game.moves({ verbose: true });
    if (moves.length === 0) return '';
    
    const randomIndex = Math.floor(Math.random() * moves.length);
    const move = moves[randomIndex];
    
    // Return in UCI format (e.g., "e2e4")
    return move.from + move.to + (move.promotion || '');
  }
  
  // Cleanup on unmount
  dispose() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
      this.isReady = false;
    }
  }
}

// Singleton instance
let stockfishInstance: StockfishEngine | null = null;

// Get the singleton instance
export function getStockfishEngine(): StockfishEngine {
  if (!stockfishInstance) {
    stockfishInstance = new StockfishEngine();
  }
  return stockfishInstance;
} 