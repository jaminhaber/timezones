export const arrayOf = (length: number): number[] => {
  return Array.from({ length }).map((_, i) => i);
};
