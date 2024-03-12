<script>
  let searchTerm = '';
  let results = [];
  
  // Dummy data for demonstration
  let items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

  function searchItems(query) {
    if (query.length > 0) {
      results = items.filter(item => item.toLowerCase().includes(query.toLowerCase()));
    } else {
      results = [];
    }
  }
</script>

<div class="search-container">
  <input
    type="text"
    placeholder="Search..."
    bind:value={searchTerm}
    on:input={() => searchItems(searchTerm)}
  />

  {#if results.length > 0}
    <div class="dropdown">
      {#each results as item}
        <div class="dropdown-item">{item}</div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .search-container {
    position: relative;
    width: 300px;
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    border: 1px solid #ddd;
    z-index: 10;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }

  .dropdown-item {
    padding: 10px;
    cursor: pointer;
  }

  .dropdown-item:hover {
    background-color: #f0f0f0;
  }

  input[type="text"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    box-sizing: border-box;
  }
</style>
