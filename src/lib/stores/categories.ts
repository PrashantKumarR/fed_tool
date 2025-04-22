import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Category } from '$lib/types';

const STORAGE_KEY = 'categories';

function createCategoriesStore() {
  const initialCategories: Category[] = browser ? JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') : [];

  const { subscribe, set, update } = writable<Category[]>(initialCategories);

  return {
    subscribe,
    add: (category: Category) => {
      update(categories => {
        const newCategories = [...categories, category];
        if (browser) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newCategories));
        }
        return newCategories;
      });
    },
    update: (index: number, category: Category) => {
      update(categories => {
        const newCategories = [...categories];
        newCategories[index] = category;
        if (browser) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newCategories));
        }
        return newCategories;
      });
    },
    delete: (index: number) => {
      update(categories => {
        const newCategories = categories.filter((_, i) => i !== index);
        if (browser) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newCategories));
        }
        return newCategories;
      });
    },
    export: () => {
      if (browser) {
        const data = JSON.stringify(initialCategories, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'categories.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }
  };
}

export const categories = createCategoriesStore(); 