<script lang="ts">
  import moment from "moment-timezone";
  import _ from "lodash";
  import Column from "./Column.svelte";

  type Column = {
    zone: string;
    start: number;
    end: number;
  };

  let zones: Column[] = [];

  const select = (event: any) => {
    const zone = event.target.value;
    if (!zone) return;
    zones = [...zones, { zone, start: 9, end: 17 }];
  };

  const remove = (index: number) => {
    zones = zones.filter((_, i) => i !== index);
  };

  const swap = (index: number, target: number) => {
    if (target < 0 || target >= zones.length) return;

    const b = zones[target];
    zones[target] = zones[index];
    zones[index] = b;
  };
  const reset = () => {
    zones = [{ zone: moment.tz.guess(), start: 9, end: 17 }];
  };

  onMount: reset();
</script>

<section aria-label="Controls" class="pt2 pb3 ph2">
  <button class="reset" on:click={reset}>Reset</button>

  <div class="dib ml3">
    <label for="timezone" class="db">Add Time Zone</label>
    <!-- svelte-ignore a11y-no-onchange -->
    <select name="timezone" class="db" on:change={select}>
      {#each moment.tz.names() as zone}
        <option value={zone}>{zone}</option>
      {/each}
    </select>
  </div>
</section>

<section aria-label="Compare">
  <div class="flex flex-row bt">
    {#each zones as { zone, start, end }, index}
      <Column
        {zone}
        {start}
        {end}
        {swap}
        {remove}
        {index}
        base={zones[0].zone} />
    {/each}
  </div>
</section>
