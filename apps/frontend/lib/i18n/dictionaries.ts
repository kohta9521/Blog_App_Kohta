import "server-only";
import type { Locale } from "./config";
import type { Dictionary } from "./types";

const dictionaries = {
  ja: () => import("./dictionaries/ja.json").then((module) => module.default as Dictionary),
  en: () => import("./dictionaries/en.json").then((module) => module.default as Dictionary),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();

