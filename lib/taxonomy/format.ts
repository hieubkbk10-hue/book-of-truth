const SMALL_WORDS = new Set(["and", "or", "the", "a", "an", "of", "to", "in"]);

export const humanizeSlug = (slug: string) => {
  if (!slug) return "";
  return slug.replace(/[-_]/g, " ").trim();
};

export const titleCase = (value: string) => {
  const words = humanizeSlug(value).split(" ").filter(Boolean);
  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index !== 0 && SMALL_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
};
