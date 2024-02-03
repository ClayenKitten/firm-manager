<script lang="ts" generics="T, TVal">
    import type { Column } from "./column";

    import { createEventDispatcher } from "svelte";

    export let data: T;
    export let column: Column<T, TVal>;
    $: value = column.getValue(data);

    let input: HTMLInputElement;

    function focus(el: HTMLInputElement) {
        el.focus();
        setTimeout(() => el.select(), 1);
    }

    function unfocus() {
        if (kind == "text") {
            column.setValue(data, input.value as TVal);
        } else if (kind == "number") {
            if (Number.isNaN(input.valueAsNumber)) {
                column.setValue(data, 0 as TVal);
            } else {
                column.setValue(data, input.valueAsNumber as TVal);
            }
        } else if (kind == "checkbox") {
            column.setValue(data, input.checked as TVal);
        }
        data = data;
        dispatch("editEnded");
    }

    let dispatch = createEventDispatcher<{ editEnded: void }>();

    let kind: "text" | "number" | "checkbox";
    $: if (input) {
        if (typeof value == "string") {
            kind = "text";
            input.type = kind;
            input.value = value;
        } else if (typeof value == "number") {
            kind = "number";
            input.type = kind;
            input.valueAsNumber = value;
            input.step = "0.01";
            input.min = "0";
        } else if (typeof value == "boolean") {
            kind = "checkbox";
            input.type = kind;
            input.checked = value;
        }
    }
</script>

<div>
    <input
        bind:this={input}
        use:focus
        on:focusout={unfocus}
        on:keydown={e => {
            if (e.key == "Enter") unfocus();
        }}
    />
</div>

<style lang="scss">
    div {
        width: 100%;
        height: 100%;
        background-color: red;
        input {
            display: block;
            min-width: 0;
            width: 100%;
            height: 100%;
            font-size: inherit;
            padding: 4px;
        }
    }
</style>
