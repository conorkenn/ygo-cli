"use strict";
/**
 * Yu-Gi-Oh! Card Database API
 * Reusable module for both CLI and OpenClaw skill
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCards = fetchCards;
exports.getRandomCard = getRandomCard;
exports.searchByName = searchByName;
exports.getCardByExactName = getCardByExactName;
exports.getCardsByType = getCardsByType;
exports.getCardsByAttribute = getCardsByAttribute;
exports.getCardsByRace = getCardsByRace;
exports.getCardsByArchetype = getCardsByArchetype;
exports.getCardsByMinATK = getCardsByMinATK;
exports.getCardsByLevel = getCardsByLevel;
exports.getHighATKCards = getHighATKCards;
const YGO_API_BASE = 'https://db.ygoprodeck.com/api/v7';
/**
 * Fetch cards from the Yu-Gi-Oh! API
 */
async function fetchCards(params = {}) {
    const url = new URL(`${YGO_API_BASE}/cardinfo.php`);
    if (params.name)
        url.searchParams.set('fname', params.name);
    if (params.exactName)
        url.searchParams.set('name', params.exactName);
    if (params.type)
        url.searchParams.set('type', params.type);
    if (params.attribute)
        url.searchParams.set('attribute', params.attribute);
    if (params.race)
        url.searchParams.set('race', params.race);
    if (params.archetype)
        url.searchParams.set('archetype', params.archetype);
    if (params.atk)
        url.searchParams.set('atk', params.atk);
    if (params.def)
        url.searchParams.set('def', params.def);
    if (params.level)
        url.searchParams.set('level', params.level);
    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }
    const jsonData = await response.json();
    const data = jsonData.data || [];
    return data;
}
/**
 * Get a random card from the database
 */
async function getRandomCard() {
    // Get all cards with misc info to pick a random one
    const allCardsUrl = `${YGO_API_BASE}/cardinfo.php?misc=yes`;
    const response = await fetch(allCardsUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch card list');
    }
    const jsonData = await response.json();
    const cards = jsonData.data || [];
    if (cards.length === 0) {
        throw new Error('No cards found in database');
    }
    const randomIndex = Math.floor(Math.random() * cards.length);
    return cards[randomIndex];
}
/**
 * Search for cards by name (partial match)
 */
async function searchByName(name) {
    return fetchCards({ name });
}
/**
 * Get exact card by name
 */
async function getCardByExactName(name) {
    const cards = await fetchCards({ exactName: name });
    return cards[0] || null;
}
/**
 * Get cards by type (Monster, Spell, Trap)
 */
async function getCardsByType(type) {
    return fetchCards({ type });
}
/**
 * Get cards by attribute (DARK, LIGHT, WATER, FIRE, EARTH, WIND, DIVINE)
 */
async function getCardsByAttribute(attribute) {
    return fetchCards({ attribute });
}
/**
 * Get cards by race/species
 */
async function getCardsByRace(race) {
    return fetchCards({ race });
}
/**
 * Get cards by archetype
 */
async function getCardsByArchetype(archetype) {
    return fetchCards({ archetype });
}
/**
 * Get cards with minimum ATK
 */
async function getCardsByMinATK(atk) {
    return fetchCards({ atk: atk.toString() });
}
/**
 * Get cards by level/rank
 */
async function getCardsByLevel(level) {
    return fetchCards({ level: level.toString() });
}
/**
 * Get high ATK cards (3000+)
 */
async function getHighATKCards(minAtk = 3000) {
    return getCardsByMinATK(minAtk);
}
//# sourceMappingURL=api.js.map