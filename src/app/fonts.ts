import { Inter } from "next/font/google";

/**
 * The Atlassian Design System typography tokens name "Atlassian Sans", which is
 * only licensed for Atlassian's own products. Atlassian Sans is drawn from
 * Inter, so Inter stands in here. It is a variable font, which the design
 * system's 653 bold weight needs.
 */
export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
