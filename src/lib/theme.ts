/**
 * Atlassian Design System theming helpers.
 *
 * Themes are switched with data attributes on <html>, exactly as
 * `@atlaskit/tokens` defines them: `data-theme` lists the loaded themes and
 * `data-color-mode` picks light or dark.
 */
export type ColorMode = "light" | "dark";

export const DEFAULT_COLOR_MODE: ColorMode = "dark";
export const COLOR_MODE_STORAGE_KEY = "color-mode";
export const COLOR_MODE_ATTRIBUTE = "data-color-mode";

/**
 * Attributes for <html>. `data-theme` activates the token themes shipped in
 * `atlassian-tokens.css`; this is the same value `getThemeHtmlAttrs()` from
 * `@atlaskit/tokens` produces for its default themes.
 */
export const themeHtmlAttrs = {
  "data-theme": "dark:dark light:light motion:motion shape:shape spacing:spacing typography:typography",
  [COLOR_MODE_ATTRIBUTE]: DEFAULT_COLOR_MODE,
} as const;

/** Surface colours of each mode, for browser chrome (`theme-color`) and the web manifest. */
export const SURFACE_COLOR: Record<ColorMode, string> = { light: "#FFFFFF", dark: "#1F1F21" };

/**
 * Props that render a subtree in the dark theme regardless of the page's colour
 * mode. Used for content laid over photography, where text must stay light.
 */
export const darkSubtree = {
  "data-subtree-theme": "",
  "data-color-mode": "dark",
  "data-theme": "dark:dark",
} as const;

/** Runs before first paint: applies the visitor's saved colour mode so there is no flash. */
export const colorModeScript = `(function(){try{var m=localStorage.getItem(${JSON.stringify(COLOR_MODE_STORAGE_KEY)});if(m==="light"||m==="dark")document.documentElement.setAttribute(${JSON.stringify(COLOR_MODE_ATTRIBUTE)},m)}catch(e){}})()`;

/**
 * Dark-theme token values for images rendered outside the browser (Open Graph
 * cards and the app icon), where CSS variables are not available. These mirror
 * `@atlaskit/tokens` atlassian-dark.
 */
export const STATIC_DARK = {
  surface: SURFACE_COLOR.dark,
  text: "#CECFD2",
  textSubtle: "#A9ABAF",
  lozengeBackground: "#164555", // color.background.accent.teal.subtler
  lozengeText: "#C6EDFB", // color.text.accent.teal.bolder
  logoPrimary: "#E2483D", // color.icon.accent.red
  logoSecondary: "#EED12B", // color.icon.accent.yellow
} as const;
