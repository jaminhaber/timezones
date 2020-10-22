<script lang="ts">
  import moment from "moment-timezone";
  import _ from "lodash";

  let zones: string[] = [];

  const select = (event: any) => {
    const zone = event.target.value;
    if (!zone) return;
    zones = [...zones, zone];
  };

  const getColor = (hour: number) => {
    if (hour < 6) return "red";
    if (hour < 9) return "orange";
    if (hour < 18) return "green";
    if (hour < 21) return "orange";
    return "red";
  };

  const getHoursForZone = (zone: string) => {
    const zero = moment().startOf("d").tz(zone);
    return _.times(24, (i) => (zero.hours() + i) % 24);
  };

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

<button class="reset" on:click={reset}>Reset</button>

<!-- svelte-ignore a11y-no-onchange -->
<select on:change={select}>
  {#each moment.tz.names() as zone}
    <option value={zone}>{zone}</option>
  {/each}
</select>

<div class="flex flex-row">
  {#each zones as zone, index}
    <div class="flex flex-column w4 br">
      <div class="pa2 bb">
        <p class="truncate tc">{zone}</p>
        <p class="tc">({moment.tz(zone).format('Z')})</p>
        <button class="pointer" on:click={() => remove(zone)}>X</button>
        <button
          class="pointer"
          on:click={() => swap(index, index - 1)}>{'<'}</button>
        <button
          class="pointer"
          on:click={() => swap(index, index + 1)}>{'>'}</button>
      </div>
      {#each getHoursForZone(zone) as hour}
        <div class="bb tc pa1" style={`background-color:${getColor(hour)}`}>
          {moment().hours(hour).format('h az')}
        </div>
      {/each}
    </div>
  {/each}
</div>
