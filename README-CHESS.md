# Chess Engine Integration

This document provides information about the chess engine integration used in the portfolio chess component.

## Overview

The chess component now uses Stockfish.js, a JavaScript port of the Stockfish chess engine, configured to play at approximately 1200 ELO rating strength. This provides a more realistic and challenging chess-playing experience compared to the previous simple evaluation function.

## Features

- Stockfish chess engine integration
- Configurable engine strength (currently set to ~1200 ELO)
- Fallback to local evaluation when Stockfish is not available
- Visual indicator when the engine is "thinking"
- Opening book for standard chess openings

## Implementation Details

The engine is implemented as a standalone module in `src/components/hobbies/chess/logic/StockfishEngine.ts`. It uses a Web Worker to run the engine in a separate thread, avoiding UI lag during calculations.

### Configuration Options

The engine is configured with the following parameters to achieve approximately 1200 ELO rating:

- **Skill Level**: 1 (Stockfish internal skill level)
- **Search Depth**: 5 (limits how deep the engine looks ahead)
- **Thinking Time**: 500ms (limits how long the engine can think)
- **NNUE Disabled**: Disables Stockfish neural network evaluation
- **Contempt Value**: 0 (does not avoid or seek draws)

### Files

- `src/components/hobbies/chess/logic/StockfishEngine.ts` - Main engine integration
- `public/stockfish/stockfish.js` - Stockfish engine (JavaScript port)
- `public/stockfish/stockfish.worker.js` - Worker file to load Stockfish in a separate thread

## How To Use

The chess engine is automatically used when you choose to play against the computer. Simply:

1. Open the chess component
2. Choose your side (White or Black)
3. The engine will play as your opponent

## Upgrading Engine Strength

To adjust the engine strength, modify the following constants in `StockfishEngine.ts`:

- Increase `SKILL_LEVEL` (0-20) for stronger play
- Increase `DEPTH` for deeper search
- Increase `MAX_ANALYSIS_TIME` for more thinking time

Note that higher values will make the engine play stronger than 1200 ELO. 