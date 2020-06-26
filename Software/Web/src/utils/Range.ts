export function range(startIndex: number, endIndex: number) {
  const array  = [];
  for (let i = startIndex; i < endIndex; i++) {
    array.push(i);
  }
  return array;
}
