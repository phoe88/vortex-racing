import { Lexend } from "next/font/google";

/**
 * Lexend: a wide, geometric sans with heavy display weights. It is a variable
 * font, so the 400 to 800 weights the design uses load as a single file.
 */
export const fontSans = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});
