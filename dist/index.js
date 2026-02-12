"use strict";
/**
 * Yu-Gi-Oh! Card Database CLI & Module
 *
 * This package provides:
 * - CLI tool for searching Yu-Gi-Oh! cards
 * - Reusable module for building other tools (like OpenClaw skills)
 *
 * Usage as CLI:
 *   ygo "dark magician"
 *   ygo --random
 *   ygo --type "XYZ Monster"
 *
 * Usage as module:
 *   import { api, types } from 'ygo-cli';
 *   const cards = await api.fetchCards({ name: 'dark magician' });
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.parseArgs = exports.formatCard = void 0;
__exportStar(require("./api"), exports);
__exportStar(require("./types"), exports);
var cli_1 = require("./cli");
Object.defineProperty(exports, "formatCard", { enumerable: true, get: function () { return cli_1.formatCard; } });
Object.defineProperty(exports, "parseArgs", { enumerable: true, get: function () { return cli_1.parseArgs; } });
Object.defineProperty(exports, "main", { enumerable: true, get: function () { return cli_1.main; } });
//# sourceMappingURL=index.js.map