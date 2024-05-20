<script>
  import { backgroundColor, fontSize, fontFamily } from '../../lib/settingsStore';
  import { writable } from 'svelte/store';

  let selectedBgColor = writable('#ffffff');
  let selectedFontSize = writable('16px');
  let selectedFontFamily = writable('Arial, sans-serif');

  backgroundColor.subscribe(value => selectedBgColor.set(value));
  fontSize.subscribe(value => selectedFontSize.set(value));
  fontFamily.subscribe(value => selectedFontFamily.set(value));

  function applySettings() {
    backgroundColor.set($selectedBgColor);
    fontSize.set($selectedFontSize);
    fontFamily.set($selectedFontFamily);
  }
</script>

<style>
  .settings-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2em;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    margin: 0 auto;
  }

  .settings-container h1 {
    font-size: 2em;
    margin-bottom: 1em;
    color: #333;
  }

  .settings-container label {
    margin-top: 1em;
    margin-bottom: 0.5em;
    font-size: 1em;
    color: #555;
  }

  .settings-container input,
  .settings-container select {
    padding: 0.5em;
    font-size: 1em;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
    margin-bottom: 1em;
  }

  .settings-container button {
    padding: 0.5em 1em;
    background-color: #ff1111;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s, transform 0.1s;
  }

  .settings-container button:hover {
    background-color: #aa5555;
    transform: scale(1.05);
  }

  .settings-container button:focus {
    outline: none;
    background-color: #aa5555;
  }
</style>

<div class="settings-container">
  <h1>Settings</h1>
  <label for="bgColor">Background Color</label>
  <input type="color" id="bgColor" bind:value={$selectedBgColor} />

  <label for="fontSize">Font Size</label>
  <input type="number" id="fontSize" min="10" max="36" bind:value={$selectedFontSize} />

  <label for="fontFamily">Font Family</label>
  <select id="fontFamily" bind:value={$selectedFontFamily}>
    <option value="Arial, sans-serif">Arial</option>
    <option value="Georgia, serif">Georgia</option>
    <option value="Tahoma, sans-serif">Tahoma</option>
    <option value="Verdana, sans-serif">Verdana</option>
  </select>

  <button on:click={applySettings}>Apply Settings</button>
</div>
