<script lang="ts">
  import moment from "moment-timezone";

  export let selectedZones: string[] = [];
  export let addZone: (zone: string) => void;

  let search = "";

  const select = (event: any) => {
    const zone = event.target.textContent;
    if (!zone) return;
    search = "";
    addZone(zone);
  };

  let filteredZones: string[];

  $: filteredZones = search
    ? moment.tz
        .names()
        .filter((zone) => !selectedZones.includes(zone))
        .filter((zone) => zone.toLowerCase().includes(search.toLowerCase()))
    : [];
</script>

<div class="search-container">
  <label for="timezone" class="db">Add Time Zone</label>
  <input
    type="text"
    name="timezone"
    placeholder="search"
    bind:value={search}
    autocomplete="off"
  />
  {#key filteredZones}
    {#if filteredZones.length > 0}
      <div class="search-results">
        {#each filteredZones as zone}
          <button class="list-item" on:click={select}>{zone}</button>
        {/each}
      </div>
    {/if}
  {/key}
</div>

<style>
  .search-container {
    position: relative;
  }

  .search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0 0 4px 4px;
    max-height: 24rem;
    overflow-y: auto;
  }

  .list-item {
    padding: 0.5rem 0.25rem;
    cursor: pointer;
    display: block;
    width: 100%;
    background: none;
    border: none;
  }

  .list-item:hover {
    background: #f0f0f0;
  }
</style>
