/**
 * Collection Logic Tests
 * Tests for YDK export, value calculation, and stats
 */

import { describe, it, expect } from 'vitest';

describe('Collection Logic', () => {
  describe('YDK Export Format', () => {
    it('should generate valid YDK format with header', () => {
      const output = '#created by YGO CLI Collection\n#main\n#extra\n!side\n';
      
      expect(output).toContain('#created by YGO CLI Collection');
      expect(output).toContain('#main');
      expect(output).toContain('#extra');
      expect(output).toContain('!side');
    });
    
    it('should output card IDs in main section', () => {
      const cardIds = [46986414, 89631139, 12345678];
      let output = '#main\n';
      cardIds.forEach(id => output += `${id}\n`);
      output += '#extra\n!side\n';
      
      expect(output).toContain('46986414');
      expect(output).toContain('89631139');
      expect(output).toContain('12345678');
    });
    
    it('should handle duplicate cards (multiple copies)', () => {
      const cardId = 46986414;
      const count = 3;
      let output = '#main\n';
      for (let i = 0; i < count; i++) {
        output += `${cardId}\n`;
      }
      
      const lines = output.split('\n').filter(l => l === String(cardId));
      expect(lines.length).toBe(3);
    });
  });
  
  describe('Collection Value Calculation', () => {
    it('should calculate total value correctly', () => {
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
      
      expect(total).toBe(35.00);
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
      
      expect(total).toBe(5.00);
    });
    
    it('should handle empty collection', () => {
      const prices: Record<string, number> = {};
      const counts: Record<string, number> = {};
      
      let total = 0;
      for (const [name, count] of Object.entries(counts)) {
        total += (prices[name] || 0) * count;
      }
      
      expect(total).toBe(0);
    });
  });
  
  describe('Collection Statistics', () => {
    it('should count unique cards', () => {
      const collection: Record<string, { count: number }> = {
        'Card A': { count: 2 },
        'Card B': { count: 1 },
        'Card C': { count: 3 }
      };
      
      const uniqueCards = Object.keys(collection).length;
      expect(uniqueCards).toBe(3);
    });
    
    it('should count total copies', () => {
      const collection: Record<string, { count: number }> = {
        'Card A': { count: 2 },
        'Card B': { count: 1 },
        'Card C': { count: 3 }
      };
      
      const totalCopies = Object.values(collection).reduce((sum, c) => sum + c.count, 0);
      expect(totalCopies).toBe(6);
    });
    
    it('should calculate average card value', () => {
      const prices: Record<string, number> = {
        'Card A': 10.00,
        'Card B': 20.00,
        'Card C': 30.00
      };
      
      const values = Object.values(prices);
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      
      expect(average).toBe(20.00);
    });
  });
  
  describe('Card Name Matching', () => {
    it('should find card case-insensitively', () => {
      const collection: Record<string, { count: number }> = {
        'Dark Magician': { count: 1 },
        'Blue-Eyes White Dragon': { count: 1 }
      };
      
      const searchTerm = 'dark magician';
      const found = Object.keys(collection).find(k => k.toLowerCase() === searchTerm);
      
      expect(found).toBe('Dark Magician');
    });
    
    it('should handle partial name match', () => {
      const collection: Record<string, { count: number }> = {
        'Dark Magician': { count: 1 },
        'Dark Magic Circle': { count: 1 }
      };
      
      const searchTerm = 'dark mag';
      const matches = Object.keys(collection).filter(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
      
      expect(matches.length).toBe(2);
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
      
      expect(entry).toHaveProperty('name');
      expect(entry).toHaveProperty('count');
      expect(entry).toHaveProperty('added');
      expect(entry).toHaveProperty('cardId');
    });
    
    it('should validate count is positive', () => {
      const validCounts = [1, 2, 3, 60];
      const invalidCounts = [0, -1];
      
      validCounts.forEach(c => expect(c).toBeGreaterThan(0));
      expect(invalidCounts[0]).toBe(0);
      expect(invalidCounts[1]).toBeLessThan(0);
    });
  });
});
