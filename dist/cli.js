#!/usr/bin/env node
"use strict";
/**
 * Yu-Gi-Oh! Card Database CLI
 * TypeScript version - Search and explore the Yu-Gi-Oh! card database
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCard = formatCard;
exports.main = main;
exports.parseArgs = parseArgs;
const api = __importStar(require("./api"));
// ANSI color codes
const COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};
/**
 * Format a card for display
 */
function formatCard(card, options = {}) {
    const json = options.json || false;
    if (json) {
        return JSON.stringify(card, null, 2);
    }
    let output = '';
    // Card name (with color)
    output += `${COLORS.bright}${COLORS.cyan}${card.name}${COLORS.reset}\n`;
    output += `${COLORS.dim}${'─'.repeat(40)}${COLORS.reset}\n`;
    // Type
    if (card.type) {
        output += `${COLORS.yellow}Type:${COLORS.reset} ${card.type}\n`;
    }
    // Attribute (for monsters)
    if (card.attribute) {
        output += `${COLORS.green}Attribute:${COLORS.reset} ${card.attribute}\n`;
    }
    // Race/Species (for monsters)
    if (card.race) {
        output += `${COLORS.blue}Race:${COLORS.reset} ${card.race}\n`;
    }
    // Stats (for monsters)
    if (card.atk !== undefined || card.def !== undefined || card.level !== undefined) {
        let stats = [];
        if (card.level !== undefined)
            stats.push(`Level ${card.level}`);
        if (card.atk !== undefined)
            stats.push(`ATK ${card.atk}`);
        if (card.def !== undefined)
            stats.push(`DEF ${card.def}`);
        output += `${COLORS.magenta}Stats:${COLORS.reset} ${stats.join(' | ')}\n`;
    }
    // Description
    if (card.desc) {
        output += `\n${COLORS.white}${card.desc}${COLORS.reset}\n`;
    }
    // Prices
    if (card.card_prices && card.card_prices.length > 0) {
        const prices = card.card_prices[0];
        output += `\n${COLORS.green}Prices:${COLORS.reset}\n`;
        output += `  TCGPlayer: $${prices.tcgplayer_price || 'N/A'}\n`;
        output += `  eBay: $${prices.ebay_price || 'N/A'}\n`;
        output += `  Amazon: $${prices.amazon_price || 'N/A'}\n`;
    }
    // Image URL
    if (card.card_images && card.card_images.length > 0) {
        output += `\n${COLORS.dim}Image:${COLORS.reset} ${card.card_images[0].image_url}${COLORS.reset}\n`;
    }
    return output;
}
/**
 * Parse command line arguments
 */
function parseArgs(args) {
    const options = {};
    let i = 0;
    while (i < args.length) {
        const arg = args[i];
        if (arg === '--help' || arg === '-h') {
            options.help = true;
        }
        else if (arg === '--version' || arg === '-v') {
            options.version = true;
        }
        else if (arg === '--random' || arg === '-r') {
            options.random = true;
        }
        else if (arg === '--price') {
            options.price = true;
        }
        else if (arg === '--json') {
            options.json = true;
        }
        else if (arg === '--type') {
            options.type = args[++i];
        }
        else if (arg === '--attribute') {
            options.attribute = args[++i];
        }
        else if (arg === '--race') {
            options.race = args[++i];
        }
        else if (arg === '--archetype') {
            options.archetype = args[++i];
        }
        else if (arg === '--atk') {
            options.atk = args[++i];
        }
        else if (arg === '--def') {
            options.def = args[++i];
        }
        else if (arg === '--level') {
            options.level = args[++i];
        }
        else if (arg === '--simple') {
            options.json = false;
        }
        else if (arg.startsWith('-')) {
            console.error(`Unknown option: ${arg}`);
            process.exit(1);
        }
        else {
            // First positional arg is the name search
            if (!options.name) {
                options.name = arg;
            }
        }
        i++;
    }
    return options;
}
/**
 * Show help message
 */
function showHelp() {
    console.log(`
${COLORS.bright}Yu-Gi-Oh! Card Database CLI${COLORS.reset}
${COLORS.dim}Search and explore the Yu-Gi-Oh! card database${COLORS.reset}

${COLORS.bright}Usage:${COLORS.reset}
  ygo "card name" [options]
  ygo [options]

${COLORS.bright}Options:${COLORS.reset}
  ${COLORS.cyan}--random, -r${COLORS.reset}        Get a random card
  ${COLORS.cyan}--type <type>${COLORS.reset}       Filter by card type
  ${COLORS.cyan}--attribute <attr>${COLORS.reset}  Filter by attribute
  ${COLORS.cyan}--race <race>${COLORS.reset}      Filter by race
  ${COLORS.cyan}--archetype <arch>${COLORS.reset}  Filter by archetype
  ${COLORS.cyan}--atk <value>${COLORS.reset}       Filter by minimum ATK
  ${COLORS.cyan}--def <value>${COLORS.reset}       Filter by minimum DEF
  ${COLORS.cyan}--level <value>${COLORS.reset}     Filter by level
  ${COLORS.cyan}--price${COLORS.reset}             Show price information
  ${COLORS.cyan}--json${COLORS.reset}              Output as JSON
  ${COLORS.cyan}--help${COLORS.reset}              Show this help
  ${COLORS.cyan}--version${COLORS.reset}           Show version

${COLORS.bright}Examples:${COLORS.reset}
  ygo "dark magician"
  ygo --random
  ygo --type "XYZ Monster"
  ygo --attribute DARK --type "Effect Monster"
  ygo "blue eyes" --price --json

${COLORS.bright}API:${COLORS.reset} https://ygoprodeck.com
`);
}
/**
 * Main CLI function
 */
async function main() {
    const args = process.argv.slice(2);
    const options = parseArgs(args);
    // Show help
    if (options.help) {
        showHelp();
        process.exit(0);
    }
    // Show version
    if (options.version) {
        console.log('ygo-cli v2.0.0 (TypeScript)');
        process.exit(0);
    }
    try {
        let cards = [];
        // Get random card
        if (options.random) {
            const randomCard = await api.getRandomCard();
            cards = [randomCard];
        }
        else {
            // Build search params
            const params = {};
            if (options.name)
                params.name = options.name;
            if (options.type)
                params.type = options.type;
            if (options.attribute)
                params.attribute = options.attribute;
            if (options.race)
                params.race = options.race;
            if (options.archetype)
                params.archetype = options.archetype;
            if (options.atk)
                params.atk = options.atk;
            if (options.def)
                params.def = options.def;
            if (options.level)
                params.level = options.level;
            cards = await api.fetchCards(params);
        }
        if (cards.length === 0) {
            console.log('No cards found.');
            process.exit(0);
        }
        // Show results
        const cardsToShow = options.random ? cards : cards.slice(0, 10);
        for (const card of cardsToShow) {
            console.log('');
            console.log(formatCard(card, options));
        }
        if (cards.length > 10 && !options.random) {
            console.log(`\n${COLORS.dim}... and ${cards.length - 10} more cards${COLORS.reset}`);
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error: ${message}`);
        process.exit(1);
    }
}
// Run CLI if executed directly
if (require.main === module) {
    main().catch(console.error);
}
//# sourceMappingURL=cli.js.map