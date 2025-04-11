<script lang="ts">
  import { tiles } from '$lib/stores/tiles';
  import type { Tile, TileType, TileShape } from '$lib/types';
  import { NUDGE_RULES, TILE_TYPES, TILE_SHAPES } from '$lib/types';

  let editingIndex: number | null = null;
  let formData: Tile = {
    type: 'icon_grid',
    displayName: '',
    gridNudgeName: NUDGE_RULES[0],
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
    tileEnum: 10,
    showOnlyInUat: true
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
      displayName: '',
      gridNudgeName: NUDGE_RULES[0],
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
      tileEnum: 10,
      showOnlyInUat: true
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

<div class="min-h-screen bg-gray-100 py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">FedMobile Tool</h1>
      <p class="text-xl text-gray-600 mb-12">Manage your mobile app tiles and configurations</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Tiles Management Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <h3 class="text-lg font-medium text-gray-900">Tile Management</h3>
              <p class="mt-1 text-sm text-gray-500">Create and manage app tiles</p>
            </div>
          </div>
          <div class="mt-6">
            <a
              href="/tiles"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Manage Tiles
            </a>
          </div>
        </div>
        <div class="bg-gray-50 px-6 py-4">
          <div class="text-sm">
            <span class="font-medium text-gray-900">{$tiles.length}</span>
            <span class="text-gray-500"> tiles configured</span>
          </div>
        </div>
      </div>

      <!-- Coming Soon Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-gray-500 rounded-md p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <h3 class="text-lg font-medium text-gray-900">Coming Soon</h3>
              <p class="mt-1 text-sm text-gray-500">More features coming soon</p>
            </div>
          </div>
          <div class="mt-6">
            <button
              disabled
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
        <div class="bg-gray-50 px-6 py-4">
          <div class="text-sm text-gray-500">Stay tuned for updates</div>
        </div>
      </div>
    </div>
  </div>
</div> 