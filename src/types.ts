/**
 * Yu-Gi-Oh! Card Database - Type Definitions
 */

export interface Card {
  id: number;
  name: string;
  type: string;
  frameType: string;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  race?: string;
  attribute?: string;
  archetype?: string;
  ygoprodeck_url?: string;
  card_sets?: CardSet[];
  card_images?: CardImage[];
  card_prices?: CardPrice[];
  humanReadableCardType?: string;
  typeline?: string[];
  misc_info?: Array<{
    konami_id?: number;
    md_rarity?: string;
  }>;
  banlist_info?: Record<string, string>;
}

export interface CardSet {
  set_name: string;
  set_code: string;
  set_rarity: string;
  set_rarity_code: string;
  set_price: string;
}

export interface CardImage {
  id: number;
  image_url: string;
  image_url_small: string;
  image_url_cropped: string;
}

export interface CardPrice {
  cardmarket_price: string;
  tcgplayer_price: string;
  ebay_price: string;
  amazon_price: string;
  coolstuffinc_price: string;
}

export interface SearchParams {
  name?: string;
  exactName?: string;
  type?: string;
  attribute?: string;
  race?: string;
  archetype?: string;
  atk?: string;
  def?: string;
  level?: string;
  misc?: string;
  limit?: number;
}

export interface CLIOptions {
  name?: string;
  type?: string;
  attribute?: string;
  race?: string;
  archetype?: string;
  atk?: string;
  def?: string;
  level?: string;
  random?: boolean;
  price?: boolean;
  json?: boolean;
  help?: boolean;
  version?: boolean;
}

export interface APIResponse {
  data: Card[];
  error?: string;
}
