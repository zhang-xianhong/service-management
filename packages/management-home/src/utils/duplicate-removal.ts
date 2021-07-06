interface ArrState {
  id: string;
  name: string;
}
const map = new Map();
export function duplicate(arr: ArrState[]) {
  for (const item of arr) {
    map.set(item.name, item.id);
    if (!map.has(item.name)) {
      map.set(item.id, item.name);
    }
  }
  return Array.from(map);
}
