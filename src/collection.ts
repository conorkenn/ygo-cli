/**
 * Collection Management
 * Track your Yu-Gi-Oh! card collection
 */

import * as fs from 'fs';
import * as path from 'path';
import * as api from './api';
import { Card } from './types';

export interface CollectionEntry {
  name: string;
  count: number;
  added: string;
  cardId: number;
}

export interface Collection {
  [cardName: string]: CollectionEntry;
}

// Get collection file path
function getCollectionPath(): string {
  const homeDir = process.env.HOME || process.env.USERPROFILE || '.';
  return path.join(homeDir, '.ygo-collection.json');
}

/**
 * Load collection from disk
 */
export function loadCollection(): Collection {
  const filePath = getCollectionPath();
  
  if (!fs.existsSync(filePath)) {
    return {};
  }
  
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading collection:', error);
    return {};
  }
}

/**
 * Save collection to disk
 */
function saveCollection(collection: Collection): void {
  const filePath = getCollectionPath();
  fs.writeFileSync(filePath, JSON.stringify(collection, null, 2));
}

/**
 * Add a card to collection
 */
export async function addToCollection(cardName: string, count: number = 1): Promise<string> {
  // Find the card
  const cards = await api.fetchCards({ name: cardName });
  
  if (cards.length === 0) {
    throw new Error(`Card not found: ${cardName}`);
  }
  
  const card = cards[0];
  const collection = loadCollection();
  
  const existingEntry = collection[card.name];
  const newCount = existingEntry ? existingEntry.count + count : count;
  
  collection[card.name] = {
    name: card.name,
    count: newCount,
    added: existingEntry?.added || new Date().toISOString().split('T')[0],
    cardId: card.id
  };
  
  saveCollection(collection);
  
  return `${card.name} x${newCount}`;
}

/**
 * Remove a card from collection
 */
export function removeFromCollection(cardName: string, count: number = 1): string {
  const collection = loadCollection();
  
  // Find matching card (case-insensitive)
  const key = Object.keys(collection).find(k => 
    k.toLowerCase() === cardName.toLowerCase()
  );
  
  if (!key) {
    throw new Error(`Card not in collection: ${cardName}`);
  }
  
  const entry = collection[key];
  
  if (entry.count <= count) {
    delete collection[key];
    saveCollection(collection);
    return `${entry.name} removed from collection`;
  }
  
  entry.count -= count;
  saveCollection(collection);
  
  return `${entry.name} x${entry.count}`;
}

/**
 * List collection
 */
export async function listCollection(): Promise<string> {
  const collection = loadCollection();
  const entries = Object.values(collection);
  
  if (entries.length === 0) {
    return 'Your collection is empty!';
  }
  
  let output = `📦 Your Collection (${entries.length} unique cards)\n\n`;
  
  // Get prices for all cards
  for (const entry of entries) {
    const cards = await api.fetchCards({ name: entry.name });
    
    let price = '$0.00';
    if (cards.length > 0 && cards[0].card_prices && cards[0].card_prices.length > 0) {
      price = `$${cards[0].card_prices[0].tcgplayer_price || '0.00'}`;
    }
    
    output += `  ${entry.name} x${entry.count} (${price})\n`;
  }
  
  return output;
}

/**
 * Get collection value
 */
export async function getCollectionValue(): Promise<string> {
  const collection = loadCollection();
  const entries = Object.values(collection);
  
  if (entries.length === 0) {
    return 'Your collection is empty!';
  }
  
  let totalValue = 0;
  
  for (const entry of entries) {
    const cards = await api.fetchCards({ name: entry.name });
    
    if (cards.length > 0 && cards[0].card_prices && cards[0].card_prices.length > 0) {
      const price = parseFloat(cards[0].card_prices[0].tcgplayer_price) || 0;
      totalValue += price * entry.count;
    }
  }
  
  return `💰 Total Collection Value: $${totalValue.toFixed(2)}`;
}

/**
 * Export collection as YDK format
 */
export function exportCollection(): string {
  const collection = loadCollection();
  const entries = Object.values(collection);
  
  if (entries.length === 0) {
    return 'Your collection is empty!';
  }
  
  let output = '#created by YGO CLI Collection\n';
  output += '#main\n';
  
  for (const entry of entries) {
    for (let i = 0; i < entry.count; i++) {
      output += `${entry.cardId}\n`;
    }
  }
  
  output += '#extra\n';
  output += '!side\n';
  
  return output;
}

/**
 * Clear collection
 */
export function clearCollection(): void {
  saveCollection({});
  return;
}
