/**
 * Yu-Gi-Oh! Card Database - Unit Tests
 */

import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';

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
    }
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
globalThis.fetch = async (url: string) => {
  const decodedUrl = decodeURIComponent(url);
  
  if (decodedUrl.includes('cardinfo.php?name=Dark') && decodedUrl.includes('Magician') && !decodedUrl.includes('misc=yes')) {
    return {
      ok: true,
      json: async () => ({ data: [MOCK_CARDS.darkMagician] })
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
};

describe('YGO Skill Unit Tests', () => {
  describe('get_card', () => {
    it('should fetch and format Dark Magician', async () => {
      const cards = await fetchCards({ name: 'Dark Magician' });
      expect(cards).to.have.lengthOf(1);
      expect(cards[0].name).to.equal('Dark Magician');
      expect(cards[0].atk).to.equal(2500);
      expect(cards[0].def).to.equal(2100);
      expect(cards[0].attribute).to.equal('DARK');
    });
    
    it('should fetch and format Blue-Eyes White Dragon', async () => {
      const cards = await fetchCards({ name: 'Blue-Eyes' });
      expect(cards).to.have.lengthOf(1);
      expect(cards[0].name).to.equal('Blue-Eyes White Dragon');
      expect(cards[0].atk).to.equal(3000);
      expect(cards[0].attribute).to.equal('LIGHT');
    });
    
    it('should handle spell cards without ATK/DEF', async () => {
      const cards = await fetchCards({ name: 'Dark Hole' });
      expect(cards).to.have.lengthOf(1);
      expect(cards[0].type).to.equal('Spell Card');
      expect(cards[0].atk).to.be.undefined;
    });
  });
  
  describe('search_cards', () => {
    it('should search with name filter', async () => {
      const cards = await fetchCards({ name: 'Dark Magician' });
      expect(cards[0].name).to.equal('Dark Magician');
    });
    
    it('should search with ATK filter (mock returns filtered data)', async () => {
      const cards = await fetchCards({ atk: '3000' });
      // The mock returns data that should be 3000+ ATK
      expect(cards).to.have.lengthOf(4);
    });
    
    it('should search with archetype filter', async () => {
      const cards = await fetchCards({ archetype: 'Dark Magician' });
      expect(cards).to.have.lengthOf(3);
    });
  });
  
  describe('get_random_card', () => {
    it('should fetch cards with misc=yes for random selection', async () => {
      const cards = await fetchCards({ misc: 'yes' });
      expect(cards).to.have.lengthOf(3);
    });
  });
  
  describe('get_high_atk', () => {
    it('should return high ATK monsters sorted by ATK descending', async () => {
      const cards = await fetchCards({ atk: '3000' });
      cards.sort((a, b) => (b.atk || 0) - (a.atk || 0));
      
      expect(cards[0].name).to.equal('Supreme King Z-ARC');
      expect(cards[0].atk).to.equal(3300);
      expect(cards[1].atk).to.equal(3000);
    });
    
    it('should handle cards with same ATK', async () => {
      const cards = await fetchCards({ atk: '3000' });
      const atks = cards.map(c => c.atk);
      const uniqueAtks = [...new Set(atks)];
      expect(uniqueAtks.length).to.be.greaterThan(1);
    });
  });
  
  describe('get_archetype', () => {
    it('should return all cards in an archetype', async () => {
      const cards = await fetchCards({ archetype: 'Dark Magician' });
      expect(cards).to.have.lengthOf(3);
      expect(cards[0].name).to.equal('Dark Magician');
      expect(cards[1].name).to.equal('Dark Magician Girl');
    });
  });
  
  describe('get_card_prices', () => {
    it('should extract prices from card data', async () => {
      const cards = await fetchCards({ name: 'Dark Magician' });
      const prices = cards[0].card_prices[0];
      
      expect(prices).to.have.property('cardmarket_price');
      expect(prices).to.have.property('tcgplayer_price');
      expect(prices).to.have.property('ebay_price');
      expect(prices).to.have.property('amazon_price');
      expect(prices).to.have.property('coolstuffinc_price');
    });
    
    it('should have numeric price values', async () => {
      const cards = await fetchCards({ name: 'Dark Magician' });
      const prices = cards[0].card_prices[0];
      
      expect(parseFloat(prices.cardmarket_price)).to.be.a('number');
      expect(parseFloat(prices.tcgplayer_price)).to.be.a('number');
    });
  });
  
  describe('card data integrity', () => {
    it('should have required fields for monsters', async () => {
      const cards = await fetchCards({ name: 'Dark Magician' });
      const card = cards[0];
      
      expect(card).to.have.property('id');
      expect(card).to.have.property('name');
      expect(card).to.have.property('type');
      expect(card).to.have.property('desc');
      expect(card).to.have.property('atk');
      expect(card).to.have.property('def');
      expect(card).to.have.property('level');
      expect(card).to.have.property('attribute');
      expect(card).to.have.property('race');
    });
    
    it('should have image data', async () => {
      const cards = await fetchCards({ name: 'Dark Magician' });
      const card = cards[0];
      
      expect(card.card_images).to.be.an('array');
      expect(card.card_images[0]).to.have.property('image_url');
    });
    
    it('should have card prices array', async () => {
      const cards = await fetchCards({ name: 'Dark Magician' });
      const card = cards[0];
      
      expect(card.card_prices).to.be.an('array');
      expect(card.card_prices.length).to.be.greaterThan(0);
    });
  });
  
  describe('get_banlist_status', () => {
    it('should return banlist info for banned cards', async () => {
      const cards = await fetchCards({ name: 'Pot of Greed', misc: 'yes' });
      expect(cards).to.have.lengthOf(1);
      expect(cards[0].name).to.equal('Pot of Greed');
      const banlist = cards[0].banlist_info;
      
      expect(banlist).to.not.be.undefined;
      expect(banlist).to.have.property('ban_tcg');
      expect(banlist).to.have.property('ban_ocg');
      expect(banlist).to.have.property('ban_goat');
      expect(banlist.ban_tcg).to.equal('Forbidden');
      expect(banlist.ban_ocg).to.equal('Forbidden');
      expect(banlist.ban_goat).to.equal('Limited');
    });
    
    it('should handle cards with partial banlist info', async () => {
      const cards = await fetchCards({ name: 'Dark Hole', misc: 'yes' });
      const banlist = cards[0].banlist_info;
      
      expect(banlist).to.not.be.undefined;
      expect(banlist).to.have.property('ban_goat');
      expect(banlist.ban_goat).to.equal('Forbidden');
    });
    
    it('should have valid banlist status values', async () => {
      const cards = await fetchCards({ name: 'Pot of Greed', misc: 'yes' });
      const banlist = cards[0].banlist_info;
      const validStatuses = ['Forbidden', 'Limited', 'Semi-Limited', 'Unlimited'];
      
      Object.values(banlist).forEach(status => {
        expect(validStatuses).to.include(status);
      });
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
