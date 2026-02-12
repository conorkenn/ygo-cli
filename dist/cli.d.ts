#!/usr/bin/env node
/**
 * Yu-Gi-Oh! Card Database CLI
 * TypeScript version - Search and explore the Yu-Gi-Oh! card database
 */
import { Card, CLIOptions } from './types';
/**
 * Format a card for display
 */
export declare function formatCard(card: Card, options?: CLIOptions): string;
/**
 * Parse command line arguments
 */
declare function parseArgs(args: string[]): CLIOptions;
/**
 * Main CLI function
 */
export declare function main(): Promise<void>;
export { parseArgs };
//# sourceMappingURL=cli.d.ts.map