import { Rubik, Heebo } from "next/font/google";

// Variable font — enables smooth font-weight animation (300–900).
// Omitting `weight` loads the full variable font file.
export const rubik = Rubik({
  subsets: ["latin", "hebrew"],
  display: "swap",
  variable: "--font-rubik",
});

// Heebo Thin — light Hebrew sans used for green accent words in
// headlines ("עסק שנראה טוב", "שיא קופי", "מדריכים"). Loaded at weight 200
// for a thin, elegant contrast against the extrabold body headlines.
// Native Hebrew design (pairs with Rubik).
export const heebo = Heebo({
  subsets: ["latin", "hebrew"],
  weight: ["200", "300"],
  display: "swap",
  variable: "--font-heebo",
});
