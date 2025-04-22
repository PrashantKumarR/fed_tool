<script lang="ts">
  import { tiles } from '$lib/stores/tiles';
  import type { Tile, TileType, TileShape } from '$lib/types';
  import { NUDGE_RULES, TILE_SHAPES } from '$lib/types';
  import { TILE_TYPES } from '$lib/constants';

  let editingIndex: number | null = null;
  let formData: Tile = {
    type: 'icon_grid',
    title: '',
    displayName: '',
    gridNudgeName: '',
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
    templateId: '',
    projectNumber: '',
    adUnitIds: [],
    largeBanner: false
  };

  function handleSubmit() {
    if (editingIndex !== null) {
      tiles.update(editingIndex, formData);
      editingIndex = null;
    } else {
      tiles.add(formData);
    }
    resetForm();
  }

  function resetForm() {
    formData = {
      type: 'icon_grid',
      title: '',
      displayName: '',
      gridNudgeName: '',
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
      templateId: '',
      projectNumber: '',
      adUnitIds: [],
      largeBanner: false
    };
  }

  function editTile(index: number, tile: Tile) {
    editingIndex = index;
    formData = { ...tile };
  }

  function validateImageUrl(url: string): boolean {
    return url.startsWith('image/grid/logos/');
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6">
    <a href="/" class="text-indigo-600 hover:text-indigo-900 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
      Back to Home
    </a>
  </div>

  <h1 class="text-3xl font-bold mb-8">Tile Management</h1>

  <!-- Form Section -->
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 class="text-xl font-semibold mb-4">{editingIndex !== null ? 'Edit Tile' : 'Add New Tile'}</h2>
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Type</label>
          <select
            bind:value={formData.type}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {#each TILE_TYPES as type}
              <option value={type}>{type}</option>
            {/each}
          </select>
        </div>

        {#if formData.type === 'banner'}
          <div>
            <label class="block text-sm font-medium text-gray-700">Template ID</label>
            <input
              type="text"
              bind:value={formData.templateId}
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Project Number</label>
            <input
              type="text"
              bind:value={formData.projectNumber}
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Ad Unit IDs</label>
            <div class="mt-1 space-y-2">
              {#each formData.adUnitIds as id, index}
                <div class="flex items-center gap-2">
                  <input
                    type="text"
                    bind:value={formData.adUnitIds[index]}
                    class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    on:click={() => formData.adUnitIds = formData.adUnitIds.filter((_, i) => i !== index)}
                    class="text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </div>
              {/each}
              <button
                type="button"
                on:click={() => formData.adUnitIds = [...formData.adUnitIds, '']}
                class="text-indigo-600 hover:text-indigo-900"
              >
                Add Ad Unit ID
              </button>
            </div>
          </div>

          <div class="col-span-2">
            <div class="flex items-center">
              <input
                type="checkbox"
                bind:checked={formData.largeBanner}
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">Large Banner</label>
            </div>
          </div>
        {:else}
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
            <label class="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              bind:value={formData.imageUrl}
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {#if formData.imageUrl && !validateImageUrl(formData.imageUrl)}
              <p class="text-red-500 text-sm mt-1">Image URL must start with 'image/grid/logos/'</p>
            {/if}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Deeplink</label>
            <input
              type="text"
              bind:value={formData.deeplink}
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Shape</label>
            <select
              bind:value={formData.shape}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value={null}>None</option>
              {#each TILE_SHAPES as shape}
                <option value={shape}>{shape}</option>
              {/each}
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Grid Nudge Name</label>
            <select
              bind:value={formData.gridNudgeName}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value={null}>None</option>
              {#each NUDGE_RULES as rule}
                <option value={rule}>{rule}</option>
              {/each}
            </select>
          </div>
        {/if}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {#if formData.type !== 'banner'}
          <div>
            <label class="block text-sm font-medium text-gray-700">Android Version Constraints</label>
            <div class="grid grid-cols-2 gap-2">
              <input
                type="text"
                bind:value={formData.minAndroidVersion}
                placeholder="Min Version"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <input
                type="text"
                bind:value={formData.maxAndroidVersion}
                placeholder="Max Version"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">iOS Version Constraints</label>
            <div class="grid grid-cols-2 gap-2">
              <input
                type="text"
                bind:value={formData.minIosVersion}
                placeholder="Min Version"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <input
                type="text"
                bind:value={formData.maxIosVersion}
                placeholder="Max Version"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        {/if}
      </div>

      <div class="space-y-4 mt-4">
        {#if formData.type !== 'banner'}
          <div class="flex items-center">
            <input
              type="checkbox"
              bind:checked={formData.showHelpText}
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900">Show Help Text</label>
          </div>

          {#if formData.showHelpText}
            <div>
              <label class="block text-sm font-medium text-gray-700">Help Text</label>
              <input
                type="text"
                bind:value={formData.helpText}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          {/if}

          <div class="flex items-center">
            <input
              type="checkbox"
              bind:checked={formData.showOffer}
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900">Show Offer</label>
          </div>
        {/if}

        <div class="flex items-center">
          <input
            type="checkbox"
            bind:checked={formData.showOnlyInUat}
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label class="ml-2 block text-sm text-gray-900">Show Only in UAT</label>
        </div>
      </div>

      <div class="flex justify-end space-x-4 mt-6">
        {#if editingIndex !== null}
          <button
            type="button"
            on:click={() => {
              editingIndex = null;
              resetForm();
            }}
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        {/if}
        <button
          type="submit"
          disabled={formData.type !== 'banner' && !validateImageUrl(formData.imageUrl) || 
                   (formData.type === 'banner' && (!formData.templateId || !formData.projectNumber || formData.adUnitIds.length === 0))}
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {editingIndex !== null ? 'Update Tile' : 'Add Tile'}
        </button>
      </div>
    </form>
  </div>

  <!-- Tiles List Section -->
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Tiles</h2>
      <button
        on:click={() => tiles.export()}
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Export JSON
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Display Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grid Nudge</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each $tiles as tile, index}
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tile.type}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tile.displayName}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tile.gridNudgeName}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  on:click={() => editTile(index, tile)}
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                <button
                  on:click={() => tiles.delete(index)}
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div> 