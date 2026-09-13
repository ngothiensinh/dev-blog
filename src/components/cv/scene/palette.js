// Scene palette (mirrors the CSS tokens in src/app/profile/profile.css).
export const C = {
  void: 0x0b0e14,
  steel: 0x1c2331,
  line: 0x3a4a63,
  cyan: 0x6fd3ff,
  violet: 0xa08cff,
  teal: 0x5ee0c4,
  amber: 0xff9f5a,
  ink: 0xe6ebf2,
  muted: 0x8a95a8,
  dark: 0x10151f,
};

export const HEX = {
  void: '#0b0e14',
  steel: '#1c2331',
  line: '#3a4a63',
  cyan: '#6fd3ff',
  violet: '#a08cff',
  teal: '#5ee0c4',
  amber: '#ff9f5a',
  ink: '#e6ebf2',
  muted: '#8a95a8',
  screen: '#0e131c',
  screenBar: '#1a2231',
  grid: '#1a2231',
  code: '#dfe6f0',
  comment: '#5d6b84',
  removed: '#ff7a7a',
};

export const toneHex = (tone) => HEX[tone] ?? HEX.cyan;
export const clamp01 = (v) => Math.max(0, Math.min(1, v));
