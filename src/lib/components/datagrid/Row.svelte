<script lang="ts" generics="T">
    import Editor from "./Editor.svelte";
    import type { Column } from "./column";

    export let data: T;
    export let columns: Column<T, any>[];

    let edited_col: number | undefined = undefined;
    const startEditing = (n: number) => {
        if (columns[n].editable) edited_col = n;
    };
</script>

<tr>
    {#each columns as col, i}
        <td
            style:width={col.colDef.width}
            class:align-center={col.colDef.align == "center"}
            class:align-end={col.colDef.align == "end"}
            class:edited={edited_col === i}
            on:dblclick={() => startEditing(i)}
        >
            {#if edited_col === undefined || i !== edited_col}
                {col.format(col.getValue(data))}
            {:else if columns[i].editable}
                <Editor
                    column={columns[i]}
                    bind:data
                    on:editEnded={() => (edited_col = undefined)}
                />
            {/if}
        </td>
    {/each}
</tr>

<style lang="scss">
    td {
        border: 1px solid black;
        font-size: 16px;
        height: min-content;
        &:not(.edited) {
            padding: 8px;
        }

        &.align-center {
            text-align: center;
        }

        &.align-end {
            text-align: end;
        }
    }
</style>
