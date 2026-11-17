/**
 * Brand colours as plain values, for images rendered outside the browser (Open
 * Graph cards, the app icon, the web manifest) where CSS variables are not
 * available. These mirror the tokens in `src/app/globals.css`.
 */
export const BRAND = {
  navy: "#00162B",
  white: "#FFFFFF",
  textSubtle: "rgba(255, 255, 255, 0.6)",
  red: "#DB0A40",
  yellow: "#FFC400",
} as const;
