/**
 * YGO CLI API Server
 * REST API for the Yu-Gi-Oh! card collection
 */

import express from 'express';
import cors from 'cors';
import * as collection from './collection';
import * as api from './api';
import { Card } from './types';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ====================
// COLLECTION ENDPOINTS
// ====================

// Get full collection
app.get('/api/collection', async (req, res) => {
  try {
    const coll = collection.loadCollection();
    const entries = Object.values(coll);
    
    // Get prices for each card
    const cards = await Promise.all(
      entries.map(async (entry) => {
        const cardData = await api.fetchCards({ name: entry.name });
        const price = cardData[0]?.card_prices?.[0]?.tcgplayer_price || '0.00';
        return {
          ...entry,
          price: parseFloat(price)
        };
      })
    );
    
    const totalValue = cards.reduce((sum, c) => sum + (c.price * c.count), 0);
    
    res.json({
      collection: cards,
      totalCards: entries.length,
      totalCopies: cards.reduce((sum, c) => sum + c.count, 0),
      totalValue: totalValue.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Add card to collection
app.post('/api/collection/add', async (req, res) => {
  try {
    const { cardName, count } = req.body;
    
    if (!cardName) {
      res.status(400).json({ error: 'cardName is required' });
      return;
    }
    
    const result = await collection.addToCollection(cardName, count || 1);
    res.json({ success: true, message: `Added ${result} to collection` });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Remove card from collection
app.post('/api/collection/remove', async (req, res) => {
  try {
    const { cardName, count } = req.body;
    
    if (!cardName) {
      res.status(400).json({ error: 'cardName is required' });
      return;
    }
    
    const result = collection.removeFromCollection(cardName, count || 1);
    res.json({ success: true, message: result });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get collection value
app.get('/api/collection/value', async (req, res) => {
  try {
    const result = await collection.getCollectionValue();
    res.json({ value: result });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Export collection as YDK
app.get('/api/collection/export', (req, res) => {
  try {
    const ydk = collection.exportCollection();
    res.type('text/plain').send(ydk);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Clear collection
app.delete('/api/collection', (req, res) => {
  try {
    collection.clearCollection();
    res.json({ success: true, message: 'Collection cleared' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// ====================
// CARD SEARCH ENDPOINTS
// ====================

// Search cards
app.get('/api/cards', async (req, res) => {
  try {
    const { name, type, attribute, race, archetype, atk, limit } = req.query;
    
    const params: any = {};
    if (name) params.name = name;
    if (type) params.type = type;
    if (attribute) params.attribute = attribute;
    if (race) params.race = race;
    if (archetype) params.archetype = archetype;
    if (atk) params.atk = atk;
    if (limit) params.limit = parseInt(limit as string);
    
    const cards = await api.fetchCards(params);
    res.json({ cards: cards.slice(0, 20), count: cards.length });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get single card
app.get('/api/cards/:name', async (req, res) => {
  try {
    const cards = await api.fetchCards({ name: req.params.name });
    
    if (cards.length === 0) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }
    
    res.json({ card: cards[0] });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get random card
app.get('/api/cards/random', async (req, res) => {
  try {
    const card = await api.getRandomCard();
    res.json({ card });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get card prices
app.get('/api/cards/:name/prices', async (req, res) => {
  try {
    const cards = await api.fetchCards({ name: req.params.name });
    
    if (cards.length === 0) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }
    
    res.json({ prices: cards[0].card_prices });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get banlist status
app.get('/api/cards/:name/banlist', async (req, res) => {
  try {
    const cards = await api.fetchCards({ name: req.params.name, misc: 'yes' });
    
    if (cards.length === 0) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }
    
    res.json({ banlist: cards[0].banlist_info });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get card artwork
app.get('/api/cards/:name/artwork', async (req, res) => {
  try {
    const cards = await api.fetchCards({ name: req.params.name });
    
    if (cards.length === 0) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }
    
    res.json({ artwork: cards[0].card_images });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// ====================
// SET BROWSE ENDPOINTS
// ====================

// Get cards by set
app.get('/api/sets/:setName/cards', async (req, res) => {
  try {
    const setName = req.params.setName;
    
    // Fetch cards from the set
    const url = `${api.YGO_API_BASE}/cardinfo.php?cardset=${encodeURIComponent(setName)}&num=100&offset=0`;
    const response = await fetch(url);
    
    if (!response.ok) {
      res.status(404).json({ error: 'Set not found' });
      return;
    }
    
    const jsonData: unknown = await response.json();
    const cards = (jsonData as { data?: any[] }).data || [];
    
    res.json({ 
      set: setName, 
      cards: cards.map(c => ({
        id: c.id,
        name: c.name,
        type: c.type,
        rarity: c.misc_info?.[0]?.rarities?.[0] || 'Unknown',
        price: c.card_prices?.[0]?.tcgplayer_price || '0.00'
      })),
      count: cards.length 
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Search sets (list all available sets from YGO API)
app.get('/api/sets', async (req, res) => {
  try {
    const response = await fetch(`${api.YGO_API_BASE}/cardsets.php`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch sets');
    }
    
    const jsonData: unknown = await response.json();
    // The API returns a direct array, not wrapped in {data: [...]}
    const sets: Array<{ set_name: string; set_code: string; tcg_date: string }> = Array.isArray(jsonData) ? jsonData : [];
    
    // Transform and sort by date (newest first)
    const allSets = sets
      .filter(s => s.set_name && s.set_code)
      .map(s => ({
        name: s.set_name,
        code: s.set_code,
        year: s.tcg_date ? s.tcg_date.slice(0, 4) : 'Unknown'
      }))
      .sort((a, b) => b.year.localeCompare(a.year));
    
    res.json({ sets: allSets });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// ====================
// START SERVER
// ====================

app.listen(PORT, () => {
  console.log(`
🎴 YGO CLI API Server running on http://localhost:${PORT}

Endpoints:
  GET  /health                  - Health check
  GET  /api/collection          - Get full collection
  POST /api/collection/add      - Add card (body: { cardName, count })
  POST /api/collection/remove  - Remove card (body: { cardName, count })
  GET  /api/collection/value    - Get collection value
  GET  /api/collection/export  - Export as YDK
  DELETE /api/collection       - Clear collection
  
  GET  /api/cards               - Search cards
  GET  /api/cards/:name        - Get card details
  GET  /api/cards/random       - Get random card
  GET  /api/cards/:name/prices - Get card prices
  GET  /api/cards/:name/banlist - Get banlist status
  `);
});
