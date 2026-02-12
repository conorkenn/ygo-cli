# Yu-Gi-Oh! Card Database CLI

A command-line tool to search and explore the Yu-Gi-Oh! card database.

## Features

- 🔍 Search cards by name
- 🎲 Get random cards
- 🃏 Filter by type, attribute, race, archetype
- 💰 Check card prices across vendors
- 📊 View card stats (ATK, DEF, Level, etc.)
- 🖼️ Display card images in terminal (with fallback)

## Installation

```bash
git clone https://github.com/conorkenn/ygo-cli.git
cd ygo-cli
npm install
npm link
```

## Usage

### Search by name
```bash
ygo "dark magician"
ygo "blue eyes"
ygo "exodia"
```

### Get random card
```bash
ygo --random
ygo -r
```

### Filter by type
```bash
ygo --type "Effect Monster"
ygo --type "Spell Card"
ygo --type "XYZ Monster"
```

### Filter by attribute
```bash
ygo --attribute "DARK"
ygo --attribute "LIGHT"
ygo --attribute "WATER"
```

### Filter by race (monster type)
```bash
ygo --race "Dragon"
ygo --race "Spellcaster"
ygo --race "Machine"
```

### Filter by archetype
```bash
ygo --archetype "HERO"
ygo --archetype "Dark Magician"
ygo --archetype "Blue-Eyes"
```

### Price lookup
```bash
ygo --price "dark magician"
```

### Combine filters
```bash
ygo "magician" --type "Effect Monster" --attribute "DARK"
ygo --type "XYZ Monster" --race "Dragon"
```

### Output formats
```bash
ygo "dark magician" --json    # JSON output
ygo "dark magician" --simple  # Simple text (default)
```

## Options

| Option | Description |
|--------|-------------|
| `--random, -r` | Get a random card |
| `--type` | Filter by card type |
| `--attribute` | Filter by monster attribute |
| `--race` | Filter by monster race/species |
| `--archetype` | Filter by archetype |
| `--atk` | Filter by minimum ATK |
| `--def` | Filter by minimum DEF |
| `--level` | Filter by level (1-12) |
| `--price` | Show price information |
| `--json` | Output as JSON |
| `--simple` | Simple text output |
| `--help` | Show help |
| `--version` | Show version |

## Examples

```bash
# Random card
ygo -r

# Dark magic cards
ygo --attribute DARK --type "Spell Card"

# Dragon XYZ monsters
ygo --type "XYZ Monster" --race Dragon

# High ATK monsters
ygo --atk 3000

# Price check
ygo "blue eyes white dragon" --price
```

## API

This tool uses the [YGOPRODECK API](https://ygoprodeck.com/api-guide/).

## License

MIT
