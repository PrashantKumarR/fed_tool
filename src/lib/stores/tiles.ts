import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Tile } from '../types';

const STORAGE_KEY = 'tiles';

function createTilesStore() {
  const initialTiles: Tile[] = browser ? 
    JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') : 
    [];
  
  const { subscribe, set, update } = writable<Tile[]>(initialTiles);

  return {
    subscribe,
    add: (tile: Tile) => {
      update(tiles => {
        const newTiles = [...tiles, tile];
        if (browser) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newTiles));
        }
        return newTiles;
      });
    },
    update: (index: number, tile: Tile) => {
      update(tiles => {
        const newTiles = [...tiles];
        newTiles[index] = tile;
        if (browser) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newTiles));
        }
        return newTiles;
      });
    },
    delete: (index: number) => {
      update(tiles => {
        const newTiles = tiles.filter((_, i) => i !== index);
        if (browser) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newTiles));
        }
        return newTiles;
      });
    },
    export: () => {
      if (!browser) return;
      
      let tiles: Tile[] = [];
      subscribe(t => tiles = t)();
      const blob = new Blob([JSON.stringify(tiles, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tiles.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
}

export const tiles = createTilesStore(); 