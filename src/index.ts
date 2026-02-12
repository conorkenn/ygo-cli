/**
 * Yu-Gi-Oh! Card Database CLI & Module
 * 
 * This package provides:
 * - CLI tool for searching Yu-Gi-Oh! cards
 * - Reusable module for building other tools (like OpenClaw skills)
 * 
 * Usage as CLI:
 *   ygo "dark magician"
 *   ygo --random
 *   ygo --type "XYZ Monster"
 * 
 * Usage as module:
 *   import { api, types } from 'ygo-cli';
 *   const cards = await api.fetchCards({ name: 'dark magician' });
 */

export * from './api';
export * from './types';
export { formatCard, parseArgs, main } from './cli';
