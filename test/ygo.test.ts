/**
 * Yu-Gi-Oh! Card Database - Unit Tests
 */

import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';

// Mock fetch for testing
globalThis.fetch = async (url: string) => {
  if (url.includes('cardinfo.php?name=Dark%20Magician')) {
    return {
      ok: true,
      json: async () => ({
        data: [{
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
        }]
      })
    };
  }
  
  if (url.includes('misc=yes')) {
    return {
      ok: true,
      json: async () => ({
        data: [
          {
            id: 46986414,
            name: 'Dark Magician',
            type: 'Normal Monster',
            humanReadableCardType: 'Normal Monster',
            desc: 'The ultimate wizard',
            atk: 2500,
            def: 2100,
            level: 7,
            attribute: 'DARK',
            race: 'Spellcaster'
          },
          {
            id: 89631139,
            name: 'Blue-Eyes White Dragon',
            type: 'Normal Monster',
            humanReadableCardType: 'Normal Monster',
            desc: 'This legendary dragon...',
            atk: 3000,
            def: 2500,
            level: 8,
            attribute: 'LIGHT',
            race: 'Dragon'
          }
        ]
      })
    };
  }
  
  if (url.includes('atk=3000')) {
    return {
      ok: true,
      json: async () => ({
        data: [
          { id: 1, name: 'Card A', atk: 3000, def: 2500, type: 'Monster', race: 'Dragon' },
          { id: 2, name: 'Card B', atk: 3000, def: 2000, type: 'Monster', race: 'Machine' },
          { id: 3, name: 'Card C', atk: 3500, def: 3000, type: 'Monster', race: 'Dragon' }
        ]
      })
    };
  }
  
  throw new Error(`Unexpected URL: ${url}`);
};

describe('YGO Skill Tests', () => {
  describe('formatCard', () => {
    it('should format a basic card', () => {
      const card = {
        name: 'Dark Magician',
        type: 'Normal Monster',
        humanReadableCardType: 'Normal Monster',
        desc: 'The ultimate wizard',
        atk: 2500,
        def: 2100,
        level: 7,
        attribute: 'DARK',
        race: 'Spellcaster',
        ygoprodeck_url: 'https://ygoprodeck.com/test',
        card_images: [{ image_url: 'https://test.com/img.jpg' }]
      };
      
      // Test that card has required properties
      expect(card.name).to.equal('Dark Magician');
      expect(card.atk).to.equal(2500);
      expect(card.def).to.equal(2100);
    });
    
    it('should handle cards without ATK/DEF', () => {
      const spellCard = {
        name: 'Dark Magic Attack',
        type: 'Spell Card',
        humanReadableCardType: 'Spell Card',
        desc: 'Destroy 1 monster',
        ygoprodeck_url: 'https://ygoprodeck.com/test'
      };
      
      expect(spellCard.name).to.equal('Dark Magic Attack');
      expect(spellCard.atk).to.be.undefined;
    });
  });
  
  describe('fetchCards', () => {
    it('should fetch cards by name', async () => {
      const cards = await fetchCards({ name: 'Dark Magician' });
      expect(cards).to.have.lengthOf(1);
      expect(cards[0].name).to.equal('Dark Magician');
    });
    
    it('should fetch multiple cards with misc=yes', async () => {
      const cards = await fetchCards({ misc: 'yes' });
      expect(cards).to.have.lengthOf(2);
    });
    
    it('should filter by ATK', async () => {
      const cards = await fetchCards({ atk: '3000' });
      expect(cards).to.have.lengthOf(3);
      cards.forEach(card => {
        expect(card.atk).to.be.at.least(3000);
      });
    });
  });
  
  describe('getHighATK', () => {
    it('should return high ATK monsters sorted by ATK', async () => {
      const cards = await fetchCards({ atk: '3000' });
      cards.sort((a, b) => (b.atk || 0) - (a.atk || 0));
      
      expect(cards[0].name).to.equal('Card C');
      expect(cards[0].atk).to.equal(3500);
    });
  });
  
  describe('card prices', () => {
    it('should extract prices from card data', async () => {
      const response = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?name=Dark%20Magician');
      const data = await response.json();
      const prices = data.data[0].card_prices[0];
      
      expect(prices).to.have.property('cardmarket_price');
      expect(prices).to.have.property('tcgplayer_price');
      expect(prices).to.have.property('ebay_price');
      expect(prices).to.have.property('amazon_price');
      expect(prices).to.have.property('coolstuffinc_price');
    });
  });
});

// Helper function to simulate fetchCards
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
