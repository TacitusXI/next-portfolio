import { ChessDesign } from '../types';
import CyberpunkDesign from './CyberpunkDesign';
import DigitalLedgerDesign from './DigitalLedgerDesign';

// All available designs
export const designs: Record<string, ChessDesign> = {
  cyberpunk: CyberpunkDesign,
  digitalLedger: DigitalLedgerDesign,
};

// Default design
export const defaultDesign = DigitalLedgerDesign;

// Get design by name
export const getDesignByName = (name: string): ChessDesign => {
  return designs[name.toLowerCase()] || defaultDesign;
};

export default designs; 