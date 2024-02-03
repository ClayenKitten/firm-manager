<script lang="ts" generics="T">
    import type { Column } from "./column";

    export let data: T[];
    export let columns: Column<T, any>[];
</script>

<tfoot>
    <tr>
        {#each columns as col}
            {@const value = col.getFooterValue(data)}
            <td
                style:width={col.colDef.width}
                class:align-center={col.colDef.align == "center"}
                class:align-end={col.colDef.align == "end"}
            >
                {#if value}
                    {value}
                {/if}
            </td>
        {/each}
    </tr>
</tfoot>

<style lang="scss">
    td {
        background-color: #dddddd;
        border: 1px solid black;
        padding: 8px;
        font-size: 16px;
        &.align-center {
            text-align: center;
        }

        &.align-end {
            text-align: end;
        }
    }
</style>
