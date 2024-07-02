<script lang="ts">
  import moment from "moment-timezone";
  import { arrayOf } from "./util";

  export let base: string;
  export let index: number;
  export let start: number;
  export let end: number;
  export let zone: string;

  export let swap: (idx: number, target: number) => void;
  export let remove: (idx: number) => void;
  export let timeChanged: (idx: number, start: number, end: number) => void;

  $: getColor = (time: moment.Moment) => {
    const hour = time.hours();
    if (hour < start - 3) return "red";
    if (hour < start) return "orange";
    if (hour <= end) return "green";
    if (hour <= end + 3) return "orange";
    return "red";
  };

  $: zero = moment().tz(base).startOf("d").tz(zone);

  $: hours = arrayOf(24).map((_, i) => zero.clone().add(i, "h"));

  $: timeChanged(index, start, end);
</script>

<div class="flex flex-column br zone-column">
  <div class="pa2 bb">
    <p class="truncate tc mb0 mt0" title={zone}>{zone}</p>
    <p class="tc mt0 f6">(GMT {moment.tz(zone).format("Z")})</p>
    <div class="flex justify-between">
      <div>
        <button
          title="Move left"
          class="pointer"
          on:click={() => swap(index, index - 1)}>&larr;</button
        >
        <button
          title="Move right"
          class="pointer"
          on:click={() => swap(index, index + 1)}>&rarr;</button
        >
      </div>
      <button title="delete" class="pointer" on:click={() => remove(index)}
        >&cross;</button
      >
    </div>
    <div class="mt3">
      <p class="ma0 mb2 dib f6">Working hours:</p>
      <div class="dib">
        <select name="start" bind:value={start}>
          {#each arrayOf(24) as hour}
            <option value={hour}>{moment().hours(hour).format("h a")}</option>
          {/each}
        </select>
      </div>
      <p class="ma0 dib">to</p>
      <div class="dib">
        <!-- svelte-ignore a11y-no-onchange -->
        <select name="end" class="db" bind:value={end}>
          {#each arrayOf(24) as hour}
            <option value={hour}>{moment().hours(hour).format("h a")}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>
  {#each hours as hour}
    <div
      class={`bb tc pa1 flex justify-center items-center ${getColor(hour)}-bg`}
    >
      <div>
        {hour.format("h a")}
      </div>
    </div>
  {/each}
</div>

<style>
  .red-bg {
    background-color: #e23c63;
  }
  .orange-bg {
    background-color: #ffa36c;
  }
  .yellow-bg {
    background-color: #ebdc87;
  }
  .green-bg {
    background-color: #799351;
  }

  .zone-column {
    width: 11rem;
  }
</style>
