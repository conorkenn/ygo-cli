/**
 * Yu-Gi-Oh! Card Database API
 * Reusable module for both CLI and OpenClaw skill
 */

import { Card, SearchParams } from './types';

export const YGO_API_BASE = 'https://db.ygoprodeck.com/api/v7';

/**
 * Fetch cards from the Yu-Gi-Oh! API
 */
export async function fetchCards(params: SearchParams = {}): Promise<Card[]> {
  const url = new URL(`${YGO_API_BASE}/cardinfo.php`);
  
  if (params.name) url.searchParams.set('fname', params.name);
  if (params.exactName) url.searchParams.set('name', params.exactName);
  if (params.type) url.searchParams.set('type', params.type);
  if (params.attribute) url.searchParams.set('attribute', params.attribute);
  if (params.race) url.searchParams.set('race', params.race);
  if (params.archetype) url.searchParams.set('archetype', params.archetype);
  if (params.atk) url.searchParams.set('atk', params.atk);
  if (params.def) url.searchParams.set('def', params.def);
  if (params.level) url.searchParams.set('level', params.level);
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  const jsonData: unknown = await response.json();
  const data = (jsonData as { data?: Card[] }).data || [];
  return data;
}

/**
 * Get a random card from the database
 */
export async function getRandomCard(): Promise<Card> {
  // Get all cards with misc info to pick a random one
  const allCardsUrl = `${YGO_API_BASE}/cardinfo.php?misc=yes`;
  const response = await fetch(allCardsUrl);
  
  if (!response.ok) {
    throw new Error('Failed to fetch card list');
  }
  
  const jsonData: unknown = await response.json();
  const cards: Card[] = (jsonData as { data?: Card[] }).data || [];
  
  if (cards.length === 0) {
    throw new Error('No cards found in database');
  }
  
  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
}

/**
 * Search for cards by name (partial match)
 */
export async function searchByName(name: string): Promise<Card[]> {
  return fetchCards({ name });
}

/**
 * Get exact card by name
 */
export async function getCardByExactName(name: string): Promise<Card | null> {
  const cards = await fetchCards({ exactName: name });
  return cards[0] || null;
}

/**
 * Get cards by type (Monster, Spell, Trap)
 */
export async function getCardsByType(type: string): Promise<Card[]> {
  return fetchCards({ type });
}

/**
 * Get cards by attribute (DARK, LIGHT, WATER, FIRE, EARTH, WIND, DIVINE)
 */
export async function getCardsByAttribute(attribute: string): Promise<Card[]> {
  return fetchCards({ attribute });
}

/**
 * Get cards by race/species
 */
export async function getCardsByRace(race: string): Promise<Card[]> {
  return fetchCards({ race });
}

/**
 * Get cards by archetype
 */
export async function getCardsByArchetype(archetype: string): Promise<Card[]> {
  return fetchCards({ archetype });
}

/**
 * Get cards with minimum ATK
 */
export async function getCardsByMinATK(atk: number): Promise<Card[]> {
  return fetchCards({ atk: atk.toString() });
}

/**
 * Get cards by level/rank
 */
export async function getCardsByLevel(level: number): Promise<Card[]> {
  return fetchCards({ level: level.toString() });
}

/**
 * Get high ATK cards (3000+)
 */
export async function getHighATKCards(minAtk: number = 3000): Promise<Card[]> {
  return getCardsByMinATK(minAtk);
}
