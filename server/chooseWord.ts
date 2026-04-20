export default function chooseWord(words: string[], length: number, uniqueOnly: boolean): string | null {
  const filtered = words.filter((word) => {
    if (word.length !== length) return false;
    if (uniqueOnly) return new Set(word).size === word.length;
    return true;
  });

  if (filtered.length === 0) return null;

  return filtered[Math.floor(Math.random() * filtered.length)];
}
