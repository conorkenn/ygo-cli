/**
 * OpenClaw Yu-Gi-Oh! Card Database Skill
 * Search and lookup Yu-Gi-Oh! cards from conversation
 * 
 * This skill wraps the ygo-cli API for OpenClaw conversation use.
 */

const YGO_API_BASE = 'https://db.ygoprodeck.com/api/v7';

/**
 * Fetch cards from the Yu-Gi-Oh! API
 */
async function fetchCards(params = {}) {
  const url = new URL(`${YGO_API_BASE}/cardinfo.php`);

  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`YGO API request failed: ${response.status}`);
  }

  const jsonData = await response.json();
  return jsonData.data || [];
}

/**
 * Format a card for display
 */
function formatCard(card, showImage = false) {
  let output = `**${card.name}**\n`;
  output += `*${card.humanReadableCardType || card.type}*\n\n`;
  output += `${card.desc.substring(0, 300)}${card.desc.length > 300 ? '...' : ''}\n\n`;

  if (card.atk !== undefined) output += `⚔️ ATK: ${card.atk} `;
  if (card.def !== undefined) output += `🛡️ DEF: ${card.def} `;
  if (card.level !== undefined) output += `⭐ Level: ${card.level} `;
  if (card.attribute) output += `✨ ${card.attribute} `;
  if (card.race) output += `🦎 ${card.race}`;
  if (card.archetype) output += `\n📁 ${card.archetype}`;

  if (showImage && card.card_images?.[0]?.image_url) {
    output += `\n\n${card.card_images[0].image_url}`;
  }

  output += `\n\n🔗 ${card.ygoprodeck_url || 'https://ygoprodeck.com'}`;

  return output;
}

/**
 * Search for cards with filters
 */
async function searchCards(args, context) {
  const { query, type, attribute, race, archetype, atk, limit = 10 } = args;

  const params = {};
  if (query) params.fname = query;
  if (type) params.type = type;
  if (attribute) params.attribute = attribute;
  if (race) params.race = race;
  if (archetype) params.archetype = archetype;
  if (atk) params.atk = atk;

  const cards = await fetchCards(params);

  if (cards.length === 0) {
    return { output: 'No cards found matching your criteria.' };
  }

  const limitedCards = cards.slice(0, limit);
  let output = `Found ${cards.length} cards. Showing ${limitedCards.length}:\n\n`;

  limitedCards.forEach((card, i) => {
    const stats = [];
    if (card.atk !== undefined) stats.push(`ATK:${card.atk}`);
    if (card.def !== undefined) stats.push(`DEF:${card.def}`);
    if (card.level) stats.push(`Lv${card.level}`);

    output += `${i + 1}. **${card.name}** ${stats.join(' / ') || card.type}\n`;
  });

  if (cards.length > limitedCards.length) {
    output += `\n...and ${cards.length - limitedCards.length} more`;
  }

  return { output, count: cards.length };
}

/**
 * Get a specific card by exact name
 */
async function getCard(args, context) {
  const { name, showImage = true } = args;

  if (!name) {
    throw new Error('Card name required');
  }

  const cards = await fetchCards({ name });

  if (cards.length === 0) {
    return { output: `No card found with name "${name}"` };
  }

  const card = cards[0];
  const formatted = formatCard(card, showImage);

  return {
    output: formatted,
    card: {
      name: card.name,
      type: card.type,
      atk: card.atk,
      def: card.def,
      level: card.level,
      attribute: card.attribute,
      race: card.race,
      archetype: card.archetype,
      image: card.card_images?.[0]?.image_url,
      url: card.ygoprodeck_url
    }
  };
}

/**
 * Get a random card
 */
async function getRandomCard(args, context) {
  const { showImage = true, type, attribute, race } = args;

  const url = `${YGO_API_BASE}/cardinfo.php?misc=yes`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch card list');
  }

  const jsonData = await response.json();
  let cards = jsonData.data || [];

  // Filter if requested
  if (type) cards = cards.filter(c => c.type?.includes(type));
  if (attribute) cards = cards.filter(c => c.attribute === attribute);
  if (race) cards = cards.filter(c => c.race?.includes(race));

  if (cards.length === 0) {
    return { output: 'No cards found matching your criteria.' };
  }

  const randomIndex = Math.floor(Math.random() * cards.length);
  const card = cards[randomIndex];
  const formatted = formatCard(card, showImage);

  return {
    output: `🎴 **Random Card**\n\n${formatted}`,
    card: {
      name: card.name,
      type: card.type,
      atk: card.atk,
      def: card.def,
      image: card.card_images?.[0]?.image_url
    }
  };
}

/**
 * Find high ATK monsters
 */
async function getHighATK(args, context) {
  const { minAtk = 3000, limit = 10 } = args;

  const cards = await fetchCards({ atk: minAtk.toString() });

  if (cards.length === 0) {
    return { output: `No monsters with ${minAtk}+ ATK found.` };
  }

  // Sort by ATK descending
  cards.sort((a, b) => (b.atk || 0) - (a.atk || 0));

  const limitedCards = cards.slice(0, limit);
  let output = `**⚔️ High ATK Monsters (${minAtk}+)**\n\n`;

  limitedCards.forEach((card, i) => {
    output += `${i + 1}. **${card.name}** — ${card.atk} ATK`;
    if (card.race) output += ` (${card.race})`;
    output += `\n`;
  });

  return { output, count: cards.length };
}

/**
 * Get cards by archetype
 */
async function getArchetype(args, context) {
  const { archetype, limit = 10 } = args;

  if (!archetype) {
    throw new Error('Archetype name required');
  }

  const cards = await fetchCards({ archetype });

  if (cards.length === 0) {
    return { output: `No cards found for archetype "${archetype}"` };
  }

  const limitedCards = cards.slice(0, limit);
  let output = `**📁 ${archetype}** — ${cards.length} cards found\n\n`;

  limitedCards.forEach((card, i) => {
    const stats = card.atk !== undefined ? ` (${card.atk} ATK)` : '';
    output += `${i + 1}. **${card.name}**${stats}\n`;
  });

  if (cards.length > limitedCards.length) {
    output += `\n...and ${cards.length - limitedCards.length} more`;
  }

  return { output, count: cards.length };
}

// Skill definition for OpenClaw
const skill = {
  name: 'yugioh',
  version: '2.0.0',
  description: 'Search and lookup Yu-Gi-Oh! cards from the official database',
  
  actions: {
    search_cards: {
      description: 'Search for Yu-Gi-Oh! cards',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Partial name search' },
          type: { type: 'string', description: 'Card type (e.g., "Effect Monster")' },
          attribute: { type: 'string', description: 'Attribute (DARK, LIGHT, WATER, FIRE, EARTH, WIND, DIVINE)' },
          race: { type: 'string', description: 'Race/species (e.g., "Dragon", "Spellcaster")' },
          archetype: { type: 'string', description: 'Archetype (e.g., "Dark Magician", "Blue-Eyes")' },
          atk: { type: 'string', description: 'Minimum ATK value' },
          limit: { type: 'number', description: 'Max results', default: 10 }
        }
      },
      handler: searchCards
    },
    
    get_card: {
      description: 'Get a specific card by exact name',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Exact card name' },
          showImage: { type: 'boolean', description: 'Show card image', default: true }
        },
        required: ['name']
      },
      handler: getCard
    },
    
    get_random_card: {
      description: 'Get a random Yu-Gi-Oh! card',
      parameters: {
        type: 'object',
        properties: {
          showImage: { type: 'boolean', description: 'Show card image', default: true },
          type: { type: 'string', description: 'Filter by type' },
          attribute: { type: 'string', description: 'Filter by attribute' },
          race: { type: 'string', description: 'Filter by race' }
        }
      },
      handler: getRandomCard
    },
    
    get_high_atk: {
      description: 'Find high ATK monsters',
      parameters: {
        type: 'object',
        properties: {
          minAtk: { type: 'number', description: 'Minimum ATK', default: 3000 },
          limit: { type: 'number', description: 'Max results', default: 10 }
        }
      },
      handler: getHighATK
    },
    
    get_archetype: {
      description: 'Get all cards in an archetype',
      parameters: {
        type: 'object',
        properties: {
          archetype: { type: 'string', description: 'Archetype name' },
          limit: { type: 'number', description: 'Max results', default: 10 }
        },
        required: ['archetype']
      },
      handler: getArchetype
    }
  }
};

module.exports = skill;
