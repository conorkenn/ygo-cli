/**
 * OpenClaw Yu-Gi-Oh! Skill Wrapper
 * 
 * This file exports the skill for OpenClaw, importing from the core API.
 * For development, modify src/skill.ts and run: npm run build
 */

interface Context {
  config?: Record<string, any>;
}

// Import API functions from compiled dist
const api = require('./api');
const YGO_API_BASE = 'https://db.ygoprodeck.com/api/v7';

/**
 * Format a card for display
 */
function formatCard(card: any, showImage = false) {
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
 * Fetch cards from the Yu-Gi-Oh! API
 */
async function fetchCards(params: Record<string, any> = {}) {
  const url = new URL(`${YGO_API_BASE}/cardinfo.php`);

  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`YGO API request failed: ${response.status}`);
  }

  const jsonData = await response.json() as { data?: any[] };
  return jsonData.data || [];
}

// Handler functions
async function searchCards(args: any, context: Context) {
  const { query, type, attribute, race, archetype, atk, limit = 10 } = args;

  const params: Record<string, any> = {};
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

  limitedCards.forEach((card: any, i: number) => {
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

async function getCard(args: any, context: Context) {
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

async function getRandomCard(args: any, context: Context) {
  const { showImage = true, type, attribute, race } = args;

  const url = `${YGO_API_BASE}/cardinfo.php?misc=yes`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch card list');
  }

  const jsonData = await response.json() as { data?: any[] };
  let cards = jsonData.data || [];

  if (type) cards = cards.filter((c: any) => c.type?.includes(type));
  if (attribute) cards = cards.filter((c: any) => c.attribute === attribute);
  if (race) cards = cards.filter((c: any) => c.race?.includes(race));

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

async function getHighATK(args: any, context: Context) {
  const { minAtk = 3000, limit = 10 } = args;

  const cards = await fetchCards({ atk: minAtk.toString() });

  if (cards.length === 0) {
    return { output: `No monsters with ${minAtk}+ ATK found.` };
  }

  cards.sort((a: any, b: any) => (b.atk || 0) - (a.atk || 0));

  const limitedCards = cards.slice(0, limit);
  let output = `**⚔️ High ATK Monsters (${minAtk}+)**\n\n`;

  limitedCards.forEach((card: any, i: number) => {
    output += `${i + 1}. **${card.name}** — ${card.atk} ATK`;
    if (card.race) output += ` (${card.race})`;
    output += `\n`;
  });

  return { output, count: cards.length };
}

async function getArchetype(args: any, context: Context) {
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

  limitedCards.forEach((card: any, i: number) => {
    const stats = card.atk !== undefined ? ` (${card.atk} ATK)` : '';
    output += `${i + 1}. **${card.name}**${stats}\n`;
  });

  if (cards.length > limitedCards.length) {
    output += `\n...and ${cards.length - limitedCards.length} more`;
  }

  return { output, count: cards.length };
}

async function getCardPrices(args: any, context: Context) {
  const { name, showImage = true } = args;

  if (!name) {
    throw new Error('Card name required');
  }

  const cards = await fetchCards({ name });

  if (cards.length === 0) {
    return { output: `No card found with name "${name}"` };
  }

  const card = cards[0];

  if (!card.card_prices || card.card_prices.length === 0) {
    return {
      output: `**${card.name}**\n\nNo price data available for this card.`,
      card: { name: card.name }
    };
  }

  const prices = card.card_prices[0];
  
  let output = `**💰 ${card.name}**\n\n`;
  output += `📊 **Prices**\n`;
  output += `━━━━━━━━━━━━━━━━━━━━━\n`;
  output += `💳 CardMarket: $${prices.cardmarket_price}\n`;
  output += `🎴 TCGPlayer: $${prices.tcgplayer_price}\n`;
  output += `📦 eBay: $${prices.ebay_price}\n`;
  output += `📱 Amazon: $${prices.amazon_price}\n`;
  output += `🏪 CoolStuffInc: $${prices.coolstuffinc_price}\n`;
  output += `━━━━━━━━━━━━━━━━━━━━━\n`;

  if (showImage && card.card_images?.[0]?.image_url) {
    output += `\n${card.card_images[0].image_url}`;
  }

  output += `\n\n🔗 ${card.ygoprodeck_url || 'https://ygoprodeck.com'}`;

  return {
    output,
    card: {
      name: card.name,
      prices: {
        cardmarket: prices.cardmarket_price,
        tcgplayer: prices.tcgplayer_price,
        ebay: prices.ebay_price,
        amazon: prices.amazon_price,
        coolstuffinc: prices.coolstuffinc_price
      },
      image: card.card_images?.[0]?.image_url
    }
  };
}

async function getBanlistStatus(args: any, context: Context) {
  const { name } = args;

  if (!name) {
    throw new Error('Card name required');
  }

  const cards = await fetchCards({ misc: 'yes', name });

  if (cards.length === 0) {
    return { output: `No card found with name "${name}"` };
  }

  const card = cards[0];
  const banlist = card.banlist_info;

  if (!banlist || Object.keys(banlist).length === 0) {
    return {
      output: `**🚫 ${card.name}**\n\nThis card is **Legal** in all current formats! ✅`,
      card: { name: card.name },
      banlist: null
    };
  }

  const formatEmojis: Record<string, string> = {
    'TCG': '🇺🇸',
    'OCG': '🇯🇵',
    'GOAT': '🐐',
    'Master Duel': '🎮',
    'Speed Duel': '⚡',
    'Duel Links': '📱'
  };

  const statusEmojis: Record<string, string> = {
    'Forbidden': '⛔',
    'Limited': '🔶',
    'Semi-Limited': '🔷',
    'Unlimited': '✅'
  };

  let output = `**🚫 ${card.name}**\n\n`;
  output += `📋 **Banlist Status**\n`;
  output += `━━━━━━━━━━━━━━━━━━━━━\n`;

  Object.entries(banlist).forEach(([format, status]) => {
    const formatEmoji = formatEmojis[format] || '🌐';
    const statusEmoji = statusEmojis[status as string] || '⚪';
    output += `${formatEmoji} ${format}: ${statusEmoji} ${status}\n`;
  });

  output += `━━━━━━━━━━━━━━━━━━━━━\n`;
  output += `\n🔗 ${card.ygoprodeck_url || 'https://ygoprodeck.com'}`;

  return {
    output,
    card: { name: card.name },
    banlist
  };
}

async function getCardRarity(args: any, context: Context) {
  const { name, showImage = true } = args;

  if (!name) {
    throw new Error('Card name required');
  }

  const cards = await fetchCards({ misc: 'yes', name });

  if (cards.length === 0) {
    return { output: `No card found with name "${name}"` };
  }

  const card = cards[0];
  const miscInfo = card.misc_info?.[0];

  let rarity = miscInfo?.md_rarity || 'Unknown';
  const rarityEmojis: Record<string, string> = {
    'Common': '⚪',
    'Rare': '🔵',
    'Super Rare': '🔷',
    'Ultra Rare': '🟣',
    'Secret Rare': '🔴',
    'Ultimate Rare': '🌟',
    'Ghost Rare': '👻',
    'Millennium Rare': '💎',
    'Parallel Rare': '✨',
    'Unknown': '❓'
  };

  let output = `**💎 ${card.name}**\n\n`;
  output += `📦 **Rarity**\n`;
  output += `━━━━━━━━━━━━━━━━━━━━━\n`;
  output += `${rarityEmojis[rarity] || '❓'} Master Duel: ${rarity}\n`;
  
  if (miscInfo?.konami_id) {
    output += `\n🆔 Konami ID: ${miscInfo.konami_id}\n`;
  }

  output += `━━━━━━━━━━━━━━━━━━━━━\n`;

  if (showImage && card.card_images?.[0]?.image_url) {
    output += `\n${card.card_images[0].image_url}`;
  }

  output += `\n\n🔗 ${card.ygoprodeck_url || 'https://ygoprodeck.com'}`;

  return {
    output,
    card: {
      name: card.name,
      rarity,
      konami_id: miscInfo?.konami_id
    }
  };
}

// Skill definition
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
    },
    
    get_card_prices: {
      description: 'Get card prices from various vendors',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Exact card name' },
          showImage: { type: 'boolean', description: 'Show card image', default: true }
        },
        required: ['name']
      },
      handler: getCardPrices
    },
    
    get_banlist_status: {
      description: 'Check if a card is banned, limited, or legal in different formats',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Exact card name' }
        },
        required: ['name']
      },
      handler: getBanlistStatus
    },
    
    get_card_rarity: {
      description: 'Get card rarity from Master Duel',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Exact card name' },
          showImage: { type: 'boolean', description: 'Show card image', default: true }
        },
        required: ['name']
      },
      handler: getCardRarity
    }
  }
};

// Export for both CommonJS and ES modules
export default skill;
module.exports = skill;
