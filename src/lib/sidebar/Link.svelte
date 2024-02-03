<script lang="ts">
    import { createEventDispatcher, getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import { slide } from "svelte/transition";

    export let text: string;
    export let icon: string;
    export let current: boolean = false;

    let dispatch = createEventDispatcher<{ click: void }>();
    let collapsed = getContext<Writable<boolean>>("collapsed");
</script>

<button
    on:click={() => dispatch("click")}
    class:collapsed={$collapsed}
    class:current
>
    <img src={icon} alt="" />
    {#if !$collapsed}
        <span transition:slide={{ duration: 500, axis: "x" }}>
            {text}
        </span>
    {/if}
</button>

<style lang="scss">
    button {
        display: flex;
        justify-content: start;
        align-items: center;
        color: white;
        background-color: transparent;
        border: 0;
        height: 48px;

        &:hover {
            background-color: #4f6372;
        }
        &.current {
            background-color: #647c8f;
        }

        transition:
            padding 0.5s,
            gap 0.5s;

        &.collapsed {
            padding: 0 12px;
            gap: 0px;
        }

        &:not(.collapsed) {
            padding: 0 20px;
            gap: 8px;
        }

        > img {
            width: 24px;
            height: 24px;
            filter: invert(1);
        }
    }

    span {
        text-overflow: clip;
        white-space: nowrap;
    }
</style>
