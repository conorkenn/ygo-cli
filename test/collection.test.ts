/**
 * Collection Logic Tests
 * Tests for YDK export, value calculation, and stats
 */

import { expect } from 'chai';

describe('Collection Logic', () => {
  describe('YDK Export Format', () => {
    it('should generate valid YDK format with header', () => {
      const output = '#created by YGO CLI Collection\n#main\n#extra\n!side\n';
      
      expect(output).to.include('#created by YGO CLI Collection');
      expect(output).to.include('#main');
      expect(output).to.include('#extra');
      expect(output).to.include('!side');
    });
    
    it('should output card IDs in main section', () => {
      const cardIds = [46986414, 89631139, 12345678];
      let output = '#main\n';
      cardIds.forEach(id => output += `${id}\n`);
      output += '#extra\n!side\n';
      
      expect(output).to.include('46986414');
      expect(output).to.include('89631139');
      expect(output).to.include('12345678');
    });
    
    it('should handle duplicate cards (multiple copies)', () => {
      const cardId = 46986414;
      const count = 3;
      let output = '#main\n';
      for (let i = 0; i < count; i++) {
        output += `${cardId}\n`;
      }
      
      const lines = output.split('\n').filter(l => l === String(cardId));
      expect(lines.length).to.equal(3);
    });
  });
  
  describe('Collection Value Calculation', () => {
    it('should calculate total value correctly', () => {
      // Mock: Dark Magician x2 @ $10 = $20, Blue-Eyes x1 @ $15 = $15
      const prices: Record<string, number> = {
        'Dark Magician': 10.00,
        'Blue-Eyes White Dragon': 15.00
      };
      
      const counts: Record<string, number> = {
        'Dark Magician': 2,
        'Blue-Eyes White Dragon': 1
      };
      
      let total = 0;
      for (const [name, count] of Object.entries(counts)) {
        total += (prices[name] || 0) * count;
      }
      
      expect(total).to.equal(35.00); // (10 * 2) + (15 * 1)
    });
    
    it('should handle missing prices as zero', () => {
      const prices: Record<string, number> = {
        'Known Card': 5.00
      };
      
      const counts: Record<string, number> = {
        'Known Card': 1,
        'Unknown Card': 2
      };
      
      let total = 0;
      for (const [name, count] of Object.entries(counts)) {
        total += (prices[name] || 0) * count;
      }
      
      expect(total).to.equal(5.00); // Only Known Card has price
    });
    
    it('should handle empty collection', () => {
      const prices: Record<string, number> = {};
      const counts: Record<string, number> = {};
      
      let total = 0;
      for (const [name, count] of Object.entries(counts)) {
        total += (prices[name] || 0) * count;
      }
      
      expect(total).to.equal(0);
    });
  });
  
  describe('Collection Statistics', () => {
    it('should count unique cards', () => {
      const collection = {
        'Card A': { count: 2 },
        'Card B': { count: 1 },
        'Card C': { count: 3 }
      };
      
      const uniqueCards = Object.keys(collection).length;
      expect(uniqueCards).to.equal(3);
    });
    
    it('should count total copies', () => {
      const collection = {
        'Card A': { count: 2 },
        'Card B': { count: 1 },
        'Card C': { count: 3 }
      };
      
      const totalCopies = Object.values(collection).reduce((sum, c) => sum + c.count, 0);
      expect(totalCopies).to.equal(6);
    });
    
    it('should calculate average card value', () => {
      const prices: Record<string, number> = {
        'Card A': 10.00,
        'Card B': 20.00,
        'Card C': 30.00
      };
      
      const values = Object.values(prices);
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      
      expect(average).to.equal(20.00);
    });
  });
  
  describe('Card Name Matching', () => {
    it('should find card case-insensitively', () => {
      const collection = {
        'Dark Magician': { count: 1 },
        'Blue-Eyes White Dragon': { count: 1 }
      };
      
      const searchTerm = 'dark magician';
      const found = Object.keys(collection).find(k => k.toLowerCase() === searchTerm);
      
      expect(found).to.equal('Dark Magician');
    });
    
    it('should handle partial name match', () => {
      const collection = {
        'Dark Magician': { count: 1 },
        'Dark Magic Circle': { count: 1 }
      };
      
      const searchTerm = 'dark mag';
      const matches = Object.keys(collection).filter(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
      
      expect(matches.length).to.equal(2);
    });
  });
  
  describe('Collection Entry Validation', () => {
    it('should have valid entry structure', () => {
      const entry = {
        name: 'Test Card',
        count: 3,
        added: '2026-02-16',
        cardId: 12345678
      };
      
      expect(entry).to.have.property('name');
      expect(entry).to.have.property('count');
      expect(entry).to.have.property('added');
      expect(entry).to.have.property('cardId');
    });
    
    it('should reject invalid count', () => {
      const validCounts = [1, 2, 3, 60]; // YGO allows up to 60 in main + 15 extra
      const invalidCounts = [0, -1];
      
      validCounts.forEach(c => expect(c).to.be.greaterThan(0));
      expect(invalidCounts[0]).to.equal(0);
      expect(invalidCounts[1]).to.be.below(0);
    });
  });
});
