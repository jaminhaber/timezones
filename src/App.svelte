<script lang="ts">
  import moment from "moment-timezone";
  import Column from "./Column.svelte";
  import TimezoneSearch from "./Search.svelte";

  const urlParams = new URLSearchParams(window.location.search);

  type Column = {
    zone: string;
    start: number;
    end: number;
  };

  const zoneStrings = urlParams.get("zones");

  $: zones = zoneStrings
    ? zoneStrings.split(",").map<Column>((encoded) => {
        const [zone, start, end] = encoded.split(":");
        return { zone, start: +start, end: +end };
      })
    : [{ zone: moment.tz.guess(), start: 9, end: 17 }];

  const updateQp = (columns: Column[]) => {
    const url = new URL(window.location.href);
    const zoneString = columns
      .map(({ zone, start, end }) => `${zone}:${start}:${end}`)
      .join(",");
    if (zoneString) {
      window.location.replace(`${url.origin}?zones=${zoneString}`);
    } else {
      window.location.replace(url.origin);
    }
  };

  const addZone = (zone: string) => {
    updateQp([...zones, { zone, start: 9, end: 17 }]);
  };

  const remove = (index: number) => {
    updateQp(zones.filter((_, i) => i !== index));
  };

  const swap = (index: number, target: number) => {
    const zoneCopy = [...zones];
    if (target < 0 || target >= zoneCopy.length) return;

    const b = zoneCopy[target];
    zoneCopy[target] = zoneCopy[index];
    zoneCopy[index] = b;
    updateQp(zones);
  };

  const reset = () => {
    updateQp([]);
  };

  const onTimeChanged = (idx: number, start: number, end: number) => {
    if (zones[idx].start === start && zones[idx].end === end) return;
    updateQp(zones.map((z, i) => (i === idx ? { ...z, start, end } : z)));
  };

  // onMount: reset();
</script>

<section aria-label="Controls" class="pt2 pb3 ph2">
  <button class="reset" on:click={reset}>Reset</button>

  <div class="dib ml3">
    <TimezoneSearch selectedZones={zones.map((z) => z.zone)} {addZone} />
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
        base={zones[0].zone}
        timeChanged={onTimeChanged}
      />
    {/each}
  </div>
</section>
