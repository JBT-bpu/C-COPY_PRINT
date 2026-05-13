import { Rubik, Fraunces } from "next/font/google";

// Variable font — enables smooth font-weight animation (300–900).
// Omitting `weight` loads the full variable font file.
export const rubik = Rubik({
  subsets: ["latin", "hebrew"],
  display: "swap",
  variable: "--font-rubik",
});

// Fraunces is only ever used italic in this site (`font-display italic`).
// Loading roman + 4 weights was wasteful; we keep just the two italic
// weights that pair with the extrabold headlines.
export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["italic"],
  display: "swap",
  variable: "--font-fraunces",
});
