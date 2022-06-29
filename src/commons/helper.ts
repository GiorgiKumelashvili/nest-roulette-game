export function randomRouletteGen() {
  const start = 0;
  const end = 36;

  return Math.floor(Math.random() * (end - start + 1) + start);
}
