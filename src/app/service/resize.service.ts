export function getWinSize(): number {
  const measures = [];
  measures.push(window.innerWidth);
  measures.push(window.innerHeight);
  measures.push(screen.availWidth);
  measures.push(screen.availHeight);
  measures.sort((a: any, b: any) => a - b);
  return measures[0];
}

export function largeScreen(): boolean {
  return getWinSize() > 600;
}
