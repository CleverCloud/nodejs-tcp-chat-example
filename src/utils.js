export function getRandomAlias () {
  return Math.random().toString(36).substr(-8);
}
