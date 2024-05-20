<script>
  import { onMount } from 'svelte';
  import { ref, get } from "firebase/database";
  import { db, auth } from "../lib/firebase/firebase.config";
  import Searchbar from "../components/Searchbar.svelte";

  let username = auth.currentUser.email.split("@")[0];
  let users = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

  onMount(async () => {
    const usersRef = ref(db, 'accounts'); // Assuming you have an 'accounts' node with usernames

    try {
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        users = Object.keys(snapshot.val());
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  });
  
  let searchTerm = '';
  let results = [];
  
  function searchItems(query) {
    if (query.length > 0) {
      results = users.filter(item => item.toLowerCase().includes(query.toLowerCase()));
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
        {#if item != username}
          <a href="/User?p={item}"><div class="dropdown-item">{item}</div></a>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  .search-container {
    position: relative;
    width: 300px;
    margin: 1em auto;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    color: #333;
  }

  input[type="text"] {
    width: 100%;
    padding: 0.75em;
    border: 1px solid #ddd;
    box-sizing: border-box;
    border-radius: 8px 8px 0 0;
    font-size: 1em;
    transition: border-color 0.3s ease;
  }

  input[type="text"]:focus {
    outline: none;
    border-color: #007bff;
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    border: 1px solid #ddd;
    border-top: none;
    z-index: 10;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-radius: 0 0 8px 8px;
    overflow: hidden;
  }

  .dropdown-item {
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .dropdown-item:hover {
    background-color: #f0f0f0;
  }

  a {
    text-decoration: none;
    color: inherit;
    display: block;
  }

  a:hover .dropdown-item {
    background-color: #e0e0e0;
  }
</style>
