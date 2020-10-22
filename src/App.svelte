<script lang="ts">
  import moment from "moment-timezone";
  import _ from "lodash";

  let zones: string[] = [];
  let start_of_day = 9;
  let end_of_day = 17;

  const select = (event: any) => {
    const zone = event.target.value;
    if (!zone) return;
    zones = [...zones, zone];
  };

  $: getColor = (time: moment.Moment) => {
    const hour = time.hours();
    if (hour < start_of_day - 3) return "red";
    if (hour < start_of_day) return "orange";
    if (hour <= end_of_day) return "green";
    if (hour <= end_of_day + 3) return "orange";
    return "red";
  };

  const getHoursForZone = (zone: string) => {
    const zero = moment().startOf("d").tz(zone);
    return _.times(24, (i) => zero.clone().add(i, "h"));
  };

  // MODIFY ZONES FUNCTION
  const remove = (zone: string) => {
    zones = zones.filter((z) => z !== zone);
  };
  const swap = (index: number, target: number) => {
    if (target < 0 || target >= zones.length) return;

    const b = zones[target];
    zones[target] = zones[index];
    zones[index] = b;
  };
  const reset = () => {
    zones = [moment.tz.guess()];
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

  <!-- svelte-ignore a11y-no-onchange -->
  <div class="dib">
    <label for="start" class="db">Start</label>
    <select name="start" bind:value={start_of_day}>
      {#each _.times(24) as hour}
        <option value={hour}>{moment().hours(hour).format('h a')}</option>
      {/each}
    </select>
  </div>
  <div class="dib">
    <label for="end" class="db">End</label>
    <!-- svelte-ignore a11y-no-onchange -->
    <select name="end" class="db" bind:value={end_of_day}>
      {#each _.times(24) as hour}
        <option value={hour}>{moment().hours(hour).format('h a')}</option>
      {/each}
    </select>
  </div>
</section>

<section aria-label="Compare">
  <div class="flex flex-row bt">
    {#each zones as zone, index}
      <div class="flex flex-column w4 br">
        <div class="pa2 bb">
          <p class="truncate tc mb0 mt0" title={zone}>{zone}</p>
          <p class="tc mt0">({moment.tz(zone).format('Z')})</p>
          <button
            class="pointer"
            on:click={() => swap(index, index - 1)}>{'<'}</button>
          <button
            class="pointer"
            on:click={() => swap(index, index + 1)}>{'>'}</button>
          <button class="pointer" on:click={() => remove(zone)}>X</button>
        </div>
        {#each getHoursForZone(zone) as hour}
          <div class="bb tc pa1" style={`background-color:${getColor(hour)}`}>
            {hour.format('h a')}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</section>
