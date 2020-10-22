<script lang="ts">
  import moment from "moment-timezone";
  import _ from "lodash";

  export let base: string;
  export let index: number;
  export let start: number;
  export let end: number;
  export let zone: string;

  export let swap: (idx: number, target: number) => void;
  export let remove: (idx: number) => void;

  $: getColor = (time: moment.Moment) => {
    const hour = time.hours();
    if (hour < start - 3) return "red";
    if (hour < start) return "orange";
    if (hour <= end) return "green";
    if (hour <= end + 3) return "orange";
    return "red";
  };

  const zero = moment().tz(base).startOf("d").tz(zone);
  $: hours = _.times(24, (i) => zero.clone().add(i, "h"));
</script>

<style>
  .red-bg {
    background-color: #d54062;
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

<div class="flex flex-column br zone-column">
  <div class="pa2 bb">
    <p class="truncate tc mb0 mt0" title={zone}>{zone}</p>
    <p class="tc mt0">(GMT {moment.tz(zone).format('Z')})</p>
    <div class="flex justify-between">
      <div>
        <button
          title="Move left"
          class="pointer"
          on:click={() => swap(index, index - 1)}>{'<'}</button>
        <button
          title="Move right"
          class="pointer"
          on:click={() => swap(index, index + 1)}>{'>'}</button>
      </div>
      <button
        title="delete"
        class="pointer"
        on:click={() => remove(index)}>X</button>
    </div>
    <div class="mt3">
      <div class="dib">
        <select name="start" bind:value={start}>
          {#each _.times(24) as hour}
            <option value={hour}>{moment().hours(hour).format('h a')}</option>
          {/each}
        </select>
      </div>
      <p class="ma0 dib">to</p>
      <div class="dib">
        <!-- svelte-ignore a11y-no-onchange -->
        <select name="end" class="db" bind:value={end}>
          {#each _.times(24) as hour}
            <option value={hour}>{moment().hours(hour).format('h a')}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>
  {#each hours as hour}
    <div class={`bb tc pa1 ${getColor(hour)}-bg`}>{hour.format('h a')}</div>
  {/each}
</div>
