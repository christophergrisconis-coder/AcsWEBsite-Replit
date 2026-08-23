/* GENERATED FROM tokens.json -- DO NOT EDIT. Run scripts/build-tokens.mjs. */
// Portable design tokens (colors as hex). Web consumes the theme via
// src/index.css; mobile (Expo) and any other platform import this object so the
// whole product shares one source of truth.
export const tokens = {
  "color": {
    "light": {
      "background": "#FAFAFA",
      "foreground": "#0D0D0D",
      "border": "#D9D9D9",
      "card": "#FFFFFF",
      "cardForeground": "#0D0D0D",
      "popover": "#FFFFFF",
      "popoverForeground": "#0D0D0D",
      "primary": "#E5E500",
      "primaryForeground": "#0D0D0D",
      "secondary": "#EBEBEB",
      "secondaryForeground": "#262626",
      "muted": "#E6E6E6",
      "mutedForeground": "#666666",
      "accent": "#E5FF00",
      "accentForeground": "#0D0D0D",
      "destructive": "#EF4343",
      "destructiveForeground": "#FFFFFF",
      "input": "#D9D9D9",
      "ring": "#E5E500",
      "chart1": "#E5E500",
      "chart2": "#0099FF",
      "chart3": "#FF4500",
      "chart4": "#9B59B6",
      "chart5": "#00CC88",
      "sidebar": "#FAFAFA",
      "sidebarForeground": "#0D0D0D",
      "sidebarBorder": "#E0E0E0",
      "sidebarPrimary": "#E5E500",
      "sidebarPrimaryForeground": "#0D0D0D",
      "sidebarAccent": "#EBEBEB",
      "sidebarAccentForeground": "#262626",
      "sidebarRing": "#E5E500"
    },
    "dark": {
      "background": "#000000",
      "foreground": "#FFFFFF",
      "border": "#333333",
      "card": "#0D0D0D",
      "cardForeground": "#FFFFFF",
      "popover": "#0D0D0D",
      "popoverForeground": "#FFFFFF",
      "primary": "#FFFF00",
      "primaryForeground": "#000000",
      "secondary": "#1A1A1A",
      "secondaryForeground": "#FFFFFF",
      "muted": "#262626",
      "mutedForeground": "#A6A6A6",
      "accent": "#E5FF00",
      "accentForeground": "#000000",
      "destructive": "#EF4343",
      "destructiveForeground": "#FFFFFF",
      "input": "#333333",
      "ring": "#FFFF00",
      "chart1": "#FFFF00",
      "chart2": "#33AAFF",
      "chart3": "#FF6B35",
      "chart4": "#B97FFF",
      "chart5": "#00FF99",
      "sidebar": "#080808",
      "sidebarForeground": "#FFFFFF",
      "sidebarBorder": "#262626",
      "sidebarPrimary": "#FFFF00",
      "sidebarPrimaryForeground": "#000000",
      "sidebarAccent": "#1A1A1A",
      "sidebarAccentForeground": "#FFFFFF",
      "sidebarRing": "#FFFF00"
    }
  },
  "fontFamily": {
    "sans": [
      "Inter",
      "system-ui",
      "sans-serif"
    ],
    "serif": [
      "Syne",
      "system-ui",
      "sans-serif"
    ],
    "mono": [
      "JetBrains Mono",
      "Menlo",
      "monospace"
    ]
  },
  "radius": "0rem",
  "spacing": "0.25rem"
} as const;

export type Tokens = typeof tokens;
export default tokens;
