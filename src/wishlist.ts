/**
 * Wishlist Management
 * Track cards you want to get
 */

import * as fs from 'fs';
import * as path from 'path';
import * as api from './api';

export interface WishlistEntry {
  name: string;
  added: string;
  cardId: number;
  priority?: 'high' | 'medium' | 'low';
}

export interface Wishlist {
  [cardName: string]: WishlistEntry;
}

// Get wishlist file path
function getWishlistPath(): string {
  const homeDir = process.env.HOME || process.env.USERPROFILE || '.';
  return path.join(homeDir, '.ygo-wishlist.json');
}

/**
 * Load wishlist from disk
 */
export function loadWishlist(): Wishlist {
  const filePath = getWishlistPath();
  
  if (!fs.existsSync(filePath)) {
    return {};
  }
  
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading wishlist:', error);
    return {};
  }
}

/**
 * Save wishlist to disk
 */
function saveWishlist(wishlist: Wishlist): void {
  const filePath = getWishlistPath();
  fs.writeFileSync(filePath, JSON.stringify(wishlist, null, 2));
}

/**
 * Add a card to wishlist
 */
export async function addToWishlist(cardName: string, priority: 'high' | 'medium' | 'low' = 'medium'): Promise<string> {
  const cards = await api.fetchCards({ name: cardName });
  
  if (cards.length === 0) {
    throw new Error(`Card not found: ${cardName}`);
  }
  
  const card = cards[0];
  const wishlist = loadWishlist();
  
  if (wishlist[card.name]) {
    return `${card.name} is already in your wishlist`;
  }
  
  wishlist[card.name] = {
    name: card.name,
    added: new Date().toISOString().split('T')[0],
    cardId: card.id,
    priority
  };
  
  saveWishlist(wishlist);
  
  return `${card.name} added to wishlist`;
}

/**
 * Remove a card from wishlist
 */
export function removeFromWishlist(cardName: string): string {
  const wishlist = loadWishlist();
  
  const key = Object.keys(wishlist).find(k => 
    k.toLowerCase() === cardName.toLowerCase()
  );
  
  if (!key) {
    throw new Error(`Card not in wishlist: ${cardName}`);
  }
  
  const entry = wishlist[key];
  delete wishlist[key];
  saveWishlist(wishlist);
  
  return `${entry.name} removed from wishlist`;
}

/**
 * List wishlist
 */
export function listWishlist(): Wishlist {
  return loadWishlist();
}

/**
 * Clear wishlist
 */
export function clearWishlist(): void {
  saveWishlist({});
}
