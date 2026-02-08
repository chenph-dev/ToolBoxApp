# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ToolBox is a mobile utility app built with Ionic 8 + Vue 3 (Composition API) + TypeScript + Vite. It targets both web and Android (via Capacitor 8). App ID: `com.toolbox.app`.

## Commands

```bash
pnpm dev                # Dev server at http://localhost:5173
pnpm build              # Type-check (vue-tsc) then build
pnpm lint               # ESLint
pnpm test:unit          # Vitest (jsdom, globals enabled)
pnpm test:e2e           # Cypress (requires dev server running)
pnpm android:build      # Build web + sync to Capacitor Android
pnpm android:open       # Open Android Studio
```

## Architecture

### Navigation Pattern

The app uses a **flat route + category homepage** model:

- `/` → `HomePage.vue` — Tool grid grouped by category (Daily Tools / Dev Tools)
- `/tools/*` → Individual tool pages, each with `IonBackButton` back to `/`

**Tool registry** (`src/data/tools.ts`) centralizes all tool metadata (id, name, description, icon, route, category). To add a new tool: add a registry entry, a route in `router/index.ts`, and a page component.

**Tools:**
- `/tools/calculator` → Calculator
- `/tools/unit-converter` → Unit Converter (length/weight/temperature)
- `/tools/qrcode-generator` → QR Code Generator
- `/tools/json-formatter` → JSON Formatter
- `/tools/password-generator` → Password Generator
- `/tools/color-picker` → Color Picker (HEX/RGB/HSL)
- `/tools/base64-codec` → Base64 Encode/Decode
- `/tools/url-codec` → URL Encode/Decode
- `/tools/timestamp-converter` → Unix Timestamp Converter

### Business Logic Separation

All computation logic is extracted into pure functions in `src/utils/`, separate from Vue components:

- `utils/calculator.ts` — Calculator state machine (`calculate()` is a pure function taking state + operation, returning new state)
- `utils/converters.ts` — Unit conversion (length/weight/temperature) using base-unit normalization
- `utils/json-formatter.ts` — JSON formatting
- `utils/clipboard.ts` — Clipboard write with fallback
- `utils/base64-codec.ts` — Base64 encode/decode with Unicode support
- `utils/url-codec.ts` — URL encode/decode (component and full URI)
- `utils/timestamp-converter.ts` — Unix timestamp / date conversion
- `utils/password-generator.ts` — Cryptographically random password generation + strength evaluation
- `utils/color-converter.ts` — HEX/RGB/HSL color conversion

Types for all tools are centralized in `src/types/index.ts` (enums for operations/units, interfaces for state).

### Component Pattern

Components use `<script setup lang="ts">` with Composition API. Ionic components are imported individually per file (not globally registered). The calculator demonstrates the component extraction pattern:
- `components/calculator/CalculatorDisplay.vue` — Display + history rendering
- `components/calculator/CalculatorButton.vue` — Button with type-based styling (number/operator/function/equals/zero)

### Styling

- Dark mode follows system preference via `@ionic/vue/css/palettes/dark.system.css`
- Components use scoped styles with `@media (prefers-color-scheme: light)` overrides
- Theme variables in `src/theme/variables.css` (currently minimal)
- Path alias `@/` → `src/` configured in both `vite.config.ts` and `tsconfig.json`

### Key Dependencies

- `qrcode.vue` (v3) — QR code rendering as SVG/canvas
- `@vitejs/plugin-legacy` — Browser compatibility via legacy builds
- `@capacitor/android` — Native Android shell
