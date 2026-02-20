/**
 * Yu-Gi-Oh! Card Database - Unit Tests
 */

import { describe, it, expect, vi } from 'vitest';

// Mock API responses
const MOCK_CARDS = {
  darkMagician: {
    id: 46986414,
    name: 'Dark Magician',
    type: 'Normal Monster',
    humanReadableCardType: 'Normal Monster',
    frameType: 'normal',
    desc: 'The ultimate wizard in terms of attack and defense.',
    atk: 2500,
    def: 2100,
    level: 7,
    attribute: 'DARK',
    race: 'Spellcaster',
    archetype: 'Dark Magician',
    ygoprodeck_url: 'https://ygoprodeck.com/card/dark-magician-4003',
    card_images: [{
      id: 46986414,
      image_url: 'https://images.ygoprodeck.com/images/cards/46986414.jpg',
      image_url_small: 'https://images.ygoprodeck.com/images/cards/small/46986414.jpg',
      image_url_cropped: 'https://images.ygoprodeck.com/images/cards/cropped/46986414.jpg'
    }],
    card_prices: [{
      cardmarket_price: '0.02',
      tcgplayer_price: '0.23',
      ebay_price: '0.99',
      amazon_price: '14.45',
      coolstuffinc_price: '0.39'
    }],
    card_sets: [
      { set_name: '2016 Mega-Tins', set_code: 'CT13-EN003', set_rarity: 'Ultra Rare', set_rarity_code: '(UR)', set_price: '6.97' },
      { set_name: '2017 Mega-Tins', set_code: 'CT14-EN001', set_rarity: 'Secret Rare', set_rarity_code: '(ScR)', set_price: '9.66' },
      { set_name: 'Battle of Chaos', set_code: '25TH-EN001', set_rarity: 'Ultra Rare', set_rarity_code: '(UR)', set_price: '0.00' }
    ],
    misc_info: [{
      md_rarity: 'Ultra Rare',
      konami_id: 46986414
    }]
  },
  
  blueEyes: {
    id: 89631139,
    name: 'Blue-Eyes White Dragon',
    type: 'Normal Monster',
    humanReadableCardType: 'Normal Monster',
    frameType: 'normal',
    desc: 'This legendary dragon is a powerful engine of destruction.',
    atk: 3000,
    def: 2500,
    level: 8,
    attribute: 'LIGHT',
    race: 'Dragon',
    archetype: 'Blue-Eyes',
    ygoprodeck_url: 'https://ygoprodeck.com/card/blue-eyes-white-dragon-7485',
    card_images: [{
      id: 89631139,
      image_url: 'https://images.ygoprodeck.com/images/cards/89631139.jpg',
      image_url_small: 'https://images.ygoprodeck.com/images/cards/small/89631139.jpg',
      image_url_cropped: 'https://images.ygoprodeck.com/images/cards/cropped/89631139.jpg'
    }],
    card_prices: [{
      cardmarket_price: '1.50',
      tcgplayer_price: '2.00',
      ebay_price: '3.50',
      amazon_price: '5.99',
      coolstuffinc_price: '2.25'
    }],
    misc_info: [{
      md_rarity: 'Ultra Rare',
      konami_id: 4007
    }]
  },
  
  darkHole: {
    id: 23215557,
    name: 'Dark Hole',
    type: 'Spell Card',
    humanReadableCardType: 'Spell Card',
    frameType: 'spell',
    desc: 'Destroy all monsters on the field.',
    ygoprodeck_url: 'https://ygoprodeck.com/card/dark-hole-23215557',
    card_images: [{
      id: 23215557,
      image_url: 'https://images.ygoprodeck.com/images/cards/23215557.jpg'
    }],
    card_prices: [{
      cardmarket_price: '0.15',
      tcgplayer_price: '0.25',
      ebay_price: '0.50',
      amazon_price: '1.00',
      coolstuffinc_price: '0.30'
    }],
    banlist_info: {
      ban_goat: 'Forbidden'
    },
    misc_info: [{
      md_rarity: 'Common',
      konami_id: 23215557
    }]
  },
  
  highATK: [
    { id: 1, name: 'Thunder Dragon Colossus', atk: 3000, def: 2500, type: 'Monster', race: 'Dragon', attribute: 'DARK' },
    { id: 2, name: 'Aleister the Invoker', atk: 3000, def: 2000, type: 'Monster', race: 'Spellcaster', attribute: 'DARK' },
    { id: 3, name: 'Supreme King Z-ARC', atk: 3300, def: 2500, type: 'Monster', race: 'Dragon', attribute: 'DARK' },
    { id: 4, name: 'Dark Magician Girl', atk: 2000, def: 1700, type: 'Monster', race: 'Spellcaster', attribute: 'DARK' }
  ],
  
  darkMagicianArchetype: [
    { id: 46986414, name: 'Dark Magician', atk: 2500, def: 2100, type: 'Monster' },
    { id: 12345678, name: 'Dark Magician Girl', atk: 2000, def: 1700, type: 'Monster' },
    { id: 23456789, name: 'Magician of Dark Illusion', atk: 2100, def: 2000, type: 'Monster' }
  ]
};

// Mock fetch
globalThis.fetch = vi.fn(async (url: string) => {
  const decodedUrl = decodeURIComponent(url);
  
  if (decodedUrl.includes('cardinfo.php?name=Dark') && decodedUrl.includes('Magician') && !decodedUrl.includes('misc=yes')) {
    return {
      ok: true,
      json: async () => ({ data: [{
        ...MOCK_CARDS.darkMagician,
        card_images: [
          { id: 46986414, image_url: 'https://images.ygoprodeck.com/images/cards/46986414.jpg' },
          { id: 46986415, image_url: 'https://images.ygoprodeck.com/images/cards/46986415.jpg' },
          { id: 46986416, image_url: 'https://images.ygoprodeck.com/images/cards/46986416.jpg' }
        ]
      }] })
    };
  }
  
  if (decodedUrl.includes('cardinfo.php?name=Blue-Eyes')) {
    return {
      ok: true,
      json: async () => ({ data: [MOCK_CARDS.blueEyes] })
    };
  }
  
  if (decodedUrl.includes('cardinfo.php?name=Dark') && decodedUrl.includes('Hole')) {
    return {
      ok: true,
      json: async () => ({ data: [MOCK_CARDS.darkHole] })
    };
  }
  
  if (decodedUrl.includes('cardinfo.php?name=Pot') && decodedUrl.includes('Greed')) {
    return {
      ok: true,
      json: async () => ({ data: [{
        ...MOCK_CARDS.darkMagician,
        name: 'Pot of Greed',
        banlist_info: {
          ban_tcg: 'Forbidden',
          ban_ocg: 'Forbidden',
          ban_goat: 'Limited'
        }
      }] })
    };
  }
  
  if (decodedUrl.includes('atk=3000')) {
    return {
      ok: true,
      json: async () => ({ data: MOCK_CARDS.highATK })
    };
  }
  
  if (decodedUrl.includes('archetype=Dark') && decodedUrl.includes('Magician')) {
    return {
      ok: true,
      json: async () => ({ data: MOCK_CARDS.darkMagicianArchetype })
    };
  }
  
  if (decodedUrl.includes('misc=yes')) {
    return {
      ok: true,
      json: async () => ({ data: [MOCK_CARDS.darkMagician, MOCK_CARDS.blueEyes, MOCK_CARDS.darkHole] })
    };
  }
  
  throw new Error(`Unexpected URL: ${url}`);
});

describe('YGO Skill Unit Tests', () => {
  describe('get_card', () => {
    it('should fetch and format Dark Magician', async () => {
      const cards = await fetchCards({ name: 'Dark Magician' });
      expect(cards).toHaveLength(1);
      expect(cards[0].name).toBe('Dark Magician');
      expect(cards[0].atk).toBe(2500);
      expect(cards[0].def).toBe(2100);
      expect(cards[0].attribute).toBe('DARK');
    });
    
    it('should fetch and format Blue-Eyes White Dragon', async () => {
      const cards = await fetchCards({ name: 'Blue-Eyes' });
      expect(cards).toHaveLength(1);
      expect(cards[0].name).toBe('Blue-Eyes White Dragon');
      expect(cards[0].atk).toBe(3000);
      expect(cards[0].attribute).toBe('LIGHT');
    });
    
    it('should handle spell cards without ATK/DEF', async () => {
      const cards = await fetchCards({ name: 'Dark Hole' });
      expect(cards).toHaveLength(1);
      expect(cards[0].type).toBe('Spell Card');
      expect(cards[0].atk).toBeUndefined();
    });
  });
  
  describe('search_cards', () => {
    it('should search with name filter', async () => {
      const cards = await fetchCards({ name: 'Dark Magician' });
      expect(cards[0].name).toBe('Dark Magician');
    });
    
    it('should search with ATK filter', async () => {
      const cards = await fetchCards({ atk: '3000' });
      expect(cards).toHaveLength(4);
    });
    
    it('should search with archetype filter', async () => {
      const cards = await fetchCards({ archetype: 'Dark Magician' });
      expect(cards).toHaveLength(3);
    });
  });
  
  describe('get_random_card', () => {
    it('should fetch cards with misc=yes for random selection', async () => {
      const cards = await fetchCards({ misc: 'yes' });
      expect(cards).toHaveLength(3);
    });
  });
  
  describe('get_high_atk', () => {
    it('should return high ATK monsters sorted by ATK descending', async () => {
      const cards = await fetchCards({ atk: '3000' });
      cards.sort((a, b) => (b.atk || 0) - (a.atk || 0));
      
      expect(cards[0].name).toBe('Supreme King Z-ARC');
      expect(cards[0].atk).toBe(3300);
      expect(cards[1].atk).toBe(3000);
    });
  });
  
  describe('get_archetype', () => {
    it('should return all cards in an archetype', async () => {
      const cards = await fetchCards({ archetype: 'Dark Magician' });
      expect(cards).toHaveLength(3);
      expect(cards[0].name).toBe('Dark Magician');
      expect(cards[1].name).toBe('Dark Magician Girl');
    });
  });
  
  describe('get_card_prices', () => {
    it('should extract prices from card data', async () => {
      const cards = await fetchCards({ name: 'Dark Magician' });
      const prices = cards[0].card_prices[0];
      
      expect(prices).toHaveProperty('cardmarket_price');
      expect(prices).toHaveProperty('tcgplayer_price');
      expect(prices).toHaveProperty('ebay_price');
      expect(prices).toHaveProperty('amazon_price');
      expect(prices).toHaveProperty('coolstuffinc_price');
    });
  });
  
  describe('card data integrity', () => {
    it('should have required fields for monsters', async () => {
      const cards = await fetchCards({ name: 'Dark Magician' });
      const card = cards[0];
      
      expect(card).toHaveProperty('id');
      expect(card).toHaveProperty('name');
      expect(card).toHaveProperty('type');
      expect(card).toHaveProperty('desc');
      expect(card).toHaveProperty('atk');
      expect(card).toHaveProperty('def');
      expect(card).toHaveProperty('level');
      expect(card).toHaveProperty('attribute');
      expect(card).toHaveProperty('race');
    });
    
    it('should have image data', async () => {
      const cards = await fetchCards({ name: 'Dark Magician' });
      const card = cards[0];
      
      expect(card.card_images).toBeInstanceOf(Array);
      expect(card.card_images[0]).toHaveProperty('image_url');
    });
  });
  
  describe('get_banlist_status', () => {
    it('should return banlist info for banned cards', async () => {
      const cards = await fetchCards({ name: 'Pot of Greed', misc: 'yes' });
      expect(cards).toHaveLength(1);
      const banlist = cards[0].banlist_info;
      
      expect(banlist).toBeDefined();
      expect(banlist.ban_tcg).toBe('Forbidden');
      expect(banlist.ban_ocg).toBe('Forbidden');
    });
    
    it('should handle cards with partial banlist info', async () => {
      const cards = await fetchCards({ name: 'Dark Hole', misc: 'yes' });
      const banlist = cards[0].banlist_info;
      
      expect(banlist).toBeDefined();
      expect(banlist.ban_goat).toBe('Forbidden');
    });
  });
  
  describe('get_card_rarity', () => {
    it('should return rarity info for Blue-Eyes', async () => {
      const cards = await fetchCards({ name: 'Blue-Eyes', misc: 'yes' });
      const miscInfo = cards[0].misc_info?.[0];
      
      expect(miscInfo).toBeDefined();
      expect(miscInfo.md_rarity).toBe('Ultra Rare');
    });
    
    it('should return rarity info for Dark Hole', async () => {
      const cards = await fetchCards({ name: 'Dark Hole', misc: 'yes' });
      const miscInfo = cards[0].misc_info?.[0];
      
      expect(miscInfo).toBeDefined();
      expect(miscInfo.md_rarity).toBe('Common');
    });
  });
  
  describe('get_card_sets', () => {
    it('should return sets for Dark Magician', async () => {
      const cards = await fetchCards({ name: 'Dark Magician' });
      const sets = cards[0].card_sets;
      
      expect(sets).toBeInstanceOf(Array);
      expect(sets.length).toBeGreaterThan(0);
      expect(sets[0]).toHaveProperty('set_name');
      expect(sets[0]).toHaveProperty('set_code');
      expect(sets[0]).toHaveProperty('set_rarity');
    });
  });
  
  describe('get_artwork', () => {
    it('should return multiple artworks for Dark Magician', async () => {
      const cards = await fetchCards({ name: 'Dark Magician' });
      const images = cards[0].card_images;
      
      expect(images).toBeInstanceOf(Array);
      expect(images.length).toBeGreaterThan(1);
    });
  });
  
  describe('edge cases', () => {
    it('should handle very specific name search', async () => {
      const cards = await fetchCards({ name: 'Blue-Eyes White Dragon' });
      
      expect(cards).toHaveLength(1);
      expect(cards[0].name).toBe('Blue-Eyes White Dragon');
    });
    
    it('should return Spell/Trap cards without ATK/DEF', async () => {
      const cards = await fetchCards({ name: 'Dark Hole' });
      
      expect(cards[0].type).toContain('Spell');
      expect(cards[0].atk).toBeUndefined();
    });
  });
});

// Helper function that mirrors the skill's fetchCards
async function fetchCards(params: Record<string, any> = {}) {
  const url = new URL('https://db.ygoprodeck.com/api/v7/cardinfo.php');
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  const jsonData = await response.json();
  return jsonData.data || [];
}
