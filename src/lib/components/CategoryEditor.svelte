<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Category, Tile } from '$lib/types';
  import { TILE_TYPES, TILE_SHAPES, NUDGE_RULES } from '$lib/constants';
  import { tiles } from '$lib/stores/tiles';

  export let category: Category;
  export let onSave: (category: Category) => void;
  export let onCancel: () => void;
  export let level = 0;

  let formData: Category = { ...category };
  let editingTile: Tile | null = null;
  let editingTileIndex: number | null = null;

  const dispatch = createEventDispatcher();

  function handleSubmit() {
    if (!formData.type || !formData.displayName || formData.tiles.length === 0) {
      return;
    }
    if (formData.tiles.length > 2 && !formData.homeScreenTileCount) {
      return;
    }
    onSave(formData);
  }

  function resetForm() {
    formData = {
      type: 'icon_grid',
      displayName: '',
      gridNudgeName: '',
      categoryIconUrl: 'image/grid/logos/',
      background: 'fill',
      aboveCategoryPresent: false,
      belowCategoryPresent: false,
      tiles: [],
      homeScreenTileCount: undefined
    };
  }

  function addTile() {
    formData.tiles = [...formData.tiles, {
      type: 'icon_grid',
      displayName: '',
      gridNudgeName: null,
      imageUrl: '',
      deeplink: '',
      minAndroidVersion: null,
      maxAndroidVersion: null,
      minIosVersion: null,
      maxIosVersion: null,
      showHelpText: false,
      helpText: null,
      shape: null,
      showOffer: false,
      showOnlyInUat: true,
      adUnitIds: []
    }];
  }

  function editTile(index: number, tile: Tile) {
    editingTileIndex = index;
    editingTile = { ...tile };
  }

  function saveTile() {
    if (!editingTile || editingTileIndex === null) return;
    
    tiles.update(editingTileIndex, editingTile);
    editingTile = null;
    editingTileIndex = null;
  }

  function deleteTile(index: number) {
    formData.tiles = formData.tiles.filter((_, i) => i !== index);
  }

  function validateImageUrl(url: string): boolean {
    return url.startsWith('image/grid/logos/');
  }

  function handleCancel() {
    dispatch('cancel');
  }
</script>

<div class="border rounded-lg p-4 mb-4" style="margin-left: {level * 20}px">
  <h3 class="text-lg font-semibold mb-4">Category Details</h3>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Type</label>
        <select
          bind:value={formData.type}
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {#each TILE_TYPES as type}
            <option value={type}>{type}</option>
          {/each}
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Display Name</label>
        <input
          type="text"
          bind:value={formData.displayName}
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Grid Nudge Name</label>
        <select
          bind:value={formData.gridNudgeName}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">None</option>
          {#each NUDGE_RULES as rule}
            <option value={rule}>{rule}</option>
          {/each}
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Category Icon URL</label>
        <input
          type="text"
          bind:value={formData.categoryIconUrl}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {#if formData.categoryIconUrl && !validateImageUrl(formData.categoryIconUrl)}
          <p class="text-red-500 text-sm mt-1">Image URL must start with 'image/grid/logos/'</p>
        {/if}
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Background</label>
        <input
          type="text"
          bind:value={formData.background}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {#if formData.tiles.length > 2}
        <div>
          <label class="block text-sm font-medium text-gray-700">Home Screen Tile Count</label>
          <input
            type="number"
            bind:value={formData.homeScreenTileCount}
            required
            min="1"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      {/if}
    </div>

    <div class="space-y-4 mt-4">
      <div class="flex items-center">
        <input
          type="checkbox"
          bind:checked={formData.aboveCategoryPresent}
          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label class="ml-2 block text-sm text-gray-900">Above Category Present</label>
      </div>

      {#if formData.aboveCategoryPresent}
        <svelte:self
          category={formData.aboveCategoryDetails || {
            type: 'icon_grid',
            displayName: '',
            tiles: []
          }}
          onSave={(category: Category) => formData.aboveCategoryDetails = category}
          onCancel={() => formData.aboveCategoryPresent = false}
          level={level + 1}
        />
      {/if}

      <div class="flex items-center">
        <input
          type="checkbox"
          bind:checked={formData.belowCategoryPresent}
          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label class="ml-2 block text-sm text-gray-900">Below Category Present</label>
      </div>

      {#if formData.belowCategoryPresent}
        <svelte:self
          category={formData.belowCategoryDetails || {
            type: 'icon_grid',
            displayName: '',
            tiles: []
          }}
          onSave={(category: Category) => formData.belowCategoryDetails = category}
          onCancel={() => formData.belowCategoryPresent = false}
          level={level + 1}
        />
      {/if}
    </div>

    <div class="mt-6">
      <h4 class="text-md font-semibold mb-2">Tiles</h4>
      <div class="space-y-4">
        {#each formData.tiles as tile, index}
          <div class="border rounded p-4">
            <div class="flex justify-between items-center mb-2">
              <h5 class="font-medium">Tile {index + 1}</h5>
              <div class="space-x-2">
                <button
                  type="button"
                  on:click={() => editTile(index, tile)}
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </button>
                <button
                  type="button"
                  on:click={() => deleteTile(index)}
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <span class="text-sm text-gray-500">Type:</span>
                <span class="ml-2">{tile.type}</span>
              </div>
              <div>
                <span class="text-sm text-gray-500">Display Name:</span>
                <span class="ml-2">{tile.displayName}</span>
              </div>
            </div>
          </div>
        {/each}
        <button
          type="button"
          on:click={addTile}
          class="text-indigo-600 hover:text-indigo-900"
        >
          Add Tile
        </button>
      </div>
    </div>

    <div class="flex justify-end space-x-4 mt-6">
      <button
        type="button"
        on:click={onCancel}
        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={!formData.type || !formData.displayName || formData.tiles.length === 0 || 
                 (formData.tiles.length > 2 && !formData.homeScreenTileCount)}
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        Save
      </button>
    </div>
  </form>

  {#if editingTile}
    <div class="edit-tile-form">
      <h3>Edit Tile</h3>
      <form on:submit|preventDefault={saveTile}>
        <div class="form-group">
          <label for="title">Title</label>
          <input
            type="text"
            id="title"
            bind:value={editingTile.title}
            required
          />
        </div>

        <div class="form-group">
          <label for="type">Type</label>
          <select id="type" bind:value={editingTile.type} required>
            <option value="banner">Banner</option>
            <option value="category">Category</option>
          </select>
        </div>

        <div class="form-group">
          <label for="shape">Shape</label>
          <select id="shape" bind:value={editingTile.shape}>
            <option value={null}>None</option>
            <option value="square">Square</option>
            <option value="rectangle">Rectangle</option>
          </select>
        </div>

        <div class="form-group">
          <label for="gridNudgeName">Grid Nudge</label>
          <select id="gridNudgeName" bind:value={editingTile.gridNudgeName}>
            <option value={null}>None</option>
            {#each NUDGE_RULES as rule}
              <option value={rule}>{rule}</option>
            {/each}
          </select>
        </div>

        {#if editingTile.type === 'banner'}
          <div class="form-group">
            <label for="templateId">Template ID</label>
            <input
              type="text"
              id="templateId"
              bind:value={editingTile.templateId}
            />
          </div>

          <div class="form-group">
            <label for="projectNumber">Project Number</label>
            <input
              type="text"
              id="projectNumber"
              bind:value={editingTile.projectNumber}
            />
          </div>

          <div class="form-group">
            <label>Ad Unit IDs</label>
            {#each editingTile.adUnitIds as adUnitId, index}
              <div class="ad-unit-row">
                <input
                  type="text"
                  bind:value={editingTile.adUnitIds[index]}
                  required
                />
                <button
                  type="button"
                  on:click={() => editingTile.adUnitIds.splice(index, 1)}
                >
                  Remove
                </button>
              </div>
            {/each}
            <button
              type="button"
              on:click={() => editingTile.adUnitIds.push('')}
            >
              Add Ad Unit ID
            </button>
          </div>

          <div class="form-group">
            <label>
              <input
                type="checkbox"
                bind:checked={editingTile.largeBanner}
              />
              Large Banner
            </label>
          </div>
        {/if}

        <div class="form-actions">
          <button type="submit">Save</button>
          <button type="button" on:click={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  {/if}
</div>

<style>
  .edit-tile-form {
    padding: 1rem;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input,
  select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .ad-unit-row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background: #007bff;
    color: white;
    cursor: pointer;
  }

  button:hover {
    background: #0056b3;
  }
</style> 