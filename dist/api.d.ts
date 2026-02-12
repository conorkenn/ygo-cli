/**
 * Yu-Gi-Oh! Card Database API
 * Reusable module for both CLI and OpenClaw skill
 */
import { Card, SearchParams } from './types';
/**
 * Fetch cards from the Yu-Gi-Oh! API
 */
export declare function fetchCards(params?: SearchParams): Promise<Card[]>;
/**
 * Get a random card from the database
 */
export declare function getRandomCard(): Promise<Card>;
/**
 * Search for cards by name (partial match)
 */
export declare function searchByName(name: string): Promise<Card[]>;
/**
 * Get exact card by name
 */
export declare function getCardByExactName(name: string): Promise<Card | null>;
/**
 * Get cards by type (Monster, Spell, Trap)
 */
export declare function getCardsByType(type: string): Promise<Card[]>;
/**
 * Get cards by attribute (DARK, LIGHT, WATER, FIRE, EARTH, WIND, DIVINE)
 */
export declare function getCardsByAttribute(attribute: string): Promise<Card[]>;
/**
 * Get cards by race/species
 */
export declare function getCardsByRace(race: string): Promise<Card[]>;
/**
 * Get cards by archetype
 */
export declare function getCardsByArchetype(archetype: string): Promise<Card[]>;
/**
 * Get cards with minimum ATK
 */
export declare function getCardsByMinATK(atk: number): Promise<Card[]>;
/**
 * Get cards by level/rank
 */
export declare function getCardsByLevel(level: number): Promise<Card[]>;
/**
 * Get high ATK cards (3000+)
 */
export declare function getHighATKCards(minAtk?: number): Promise<Card[]>;
//# sourceMappingURL=api.d.ts.map