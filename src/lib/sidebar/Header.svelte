<script lang="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import { fade } from "svelte/transition";
    import icon from "@assets/icons/list.svg";

    let collapsed = getContext<Writable<boolean>>("collapsed");
</script>

<header>
    <button class:collapsed={$collapsed} on:click={() => ($collapsed = !$collapsed)}>
        <img src={icon} alt="" />
    </button>
    {#if !$collapsed}
        <h1 out:fade={{ delay: 500, duration: 0 }}>Меню</h1>
    {/if}
</header>

<style lang="scss">
    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row-reverse;
        align-self: stretch;
        height: 48px;
        > h1 {
            flex: 1 0 0;
            font-size: 18px;
            margin-left: 12px;
            text-overflow: clip;
            white-space: nowrap;
        }
        > button {
            width: 48px;
        }
    }

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        background-color: transparent;
        border: 0;
        flex: 0 0 48px;
        height: 48px;

        &:hover {
            background-color: #4f6372;
        }

        > img {
            width: 24px;
            height: 24px;
            filter: invert(1);
        }
    }
</style>
