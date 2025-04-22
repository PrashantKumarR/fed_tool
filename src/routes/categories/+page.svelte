<script lang="ts">
  import { categories } from '$lib/stores/categories';
  import CategoryEditor from '$lib/components/CategoryEditor.svelte';
  import type { Category } from '$lib/types';

  let editingIndex: number | null = null;
  let editingCategory: Category | null = null;
  let showNewCategoryForm = false;

  function handleSave(category: Category) {
    if (editingIndex !== null) {
      categories.update(editingIndex, category);
      editingIndex = null;
      editingCategory = null;
    } else {
      categories.add(category);
      showNewCategoryForm = false;
    }
  }

  function handleCancel() {
    editingIndex = null;
    editingCategory = null;
    showNewCategoryForm = false;
  }

  function editCategory(index: number, category: Category) {
    editingIndex = index;
    editingCategory = { ...category };
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

  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold">Categories</h1>
    <div class="space-x-4">
      <button
        on:click={() => categories.export()}
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Export JSON
      </button>
      <button
        on:click={() => showNewCategoryForm = true}
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Category
      </button>
    </div>
  </div>

  {#if showNewCategoryForm}
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Add New Category</h2>
      <CategoryEditor
        category={{
          type: 'icon_grid',
          displayName: '',
          tiles: []
        }}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  {/if}

  {#if editingCategory}
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Edit Category</h2>
      <CategoryEditor
        category={editingCategory}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  {/if}

  <div class="space-y-6">
    {#each $categories as category, index}
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">{category.displayName}</h3>
          <div class="space-x-2">
            <button
              on:click={() => editCategory(index, category)}
              class="text-indigo-600 hover:text-indigo-900"
            >
              Edit
            </button>
            <button
              on:click={() => categories.delete(index)}
              class="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="text-sm text-gray-500">Type:</span>
            <span class="ml-2">{category.type}</span>
          </div>
          <div>
            <span class="text-sm text-gray-500">Grid Nudge Name:</span>
            <span class="ml-2">{category.gridNudgeName || 'None'}</span>
          </div>
          <div>
            <span class="text-sm text-gray-500">Tiles:</span>
            <span class="ml-2">{category.tiles.length}</span>
          </div>
          {#if category.tiles.length > 2}
            <div>
              <span class="text-sm text-gray-500">Home Screen Tile Count:</span>
              <span class="ml-2">{category.homeScreenTileCount}</span>
            </div>
          {/if}
        </div>

        {#if category.aboveCategoryPresent && category.aboveCategoryDetails}
          <div class="mt-4">
            <h4 class="text-md font-semibold mb-2">Above Category</h4>
            <CategoryEditor
              category={category.aboveCategoryDetails}
              onSave={(category) => {
                const updated = { ...$categories[index] };
                updated.aboveCategoryDetails = category;
                categories.update(index, updated);
              }}
              onCancel={() => {
                const updated = { ...$categories[index] };
                updated.aboveCategoryPresent = false;
                categories.update(index, updated);
              }}
              level={1}
            />
          </div>
        {/if}

        {#if category.belowCategoryPresent && category.belowCategoryDetails}
          <div class="mt-4">
            <h4 class="text-md font-semibold mb-2">Below Category</h4>
            <CategoryEditor
              category={category.belowCategoryDetails}
              onSave={(category) => {
                const updated = { ...$categories[index] };
                updated.belowCategoryDetails = category;
                categories.update(index, updated);
              }}
              onCancel={() => {
                const updated = { ...$categories[index] };
                updated.belowCategoryPresent = false;
                categories.update(index, updated);
              }}
              level={1}
            />
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div> 