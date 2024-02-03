<script lang="ts" generics="T">
    import Footer from "./Footer.svelte";
import Row from "./Row.svelte";
import { Column } from "./column";
    import type { GridDef } from "./gridDef";

    export let data: T[];
    export let gridDef: GridDef<T>;

    $: columns = gridDef.colDefs.map(colDef => new Column(colDef));
</script>

<table>
    <thead>
        {#each gridDef.colDefs as colDef}
            <th>{colDef.header}</th>
        {/each}
    </thead>
    <tbody>
        {#each data as entry}
            <Row bind:data={entry} {columns} />
        {/each}
    </tbody>
    {#if gridDef.summary}
        <Footer {data} {columns} />
    {/if}
</table>

<style lang="scss">
    table {
        width: 100%;
        height: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }
    th {
        border: 1px solid black;
        padding: 8px;
        font-size: 16px;
    }
    thead {
        position: sticky;
        // inset-block-start: 0;
        // background-color: white;
        // background-clip: padding-box;
        left: 0;
        right: 0;
    }
</style>
