<script lang="ts">
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import Header from "@lib/sidebar/Header.svelte";
    import Link from "@lib/sidebar/Link.svelte";
    import Spacer from "@lib/sidebar/Spacer.svelte";

    import DeliveryPage from "./pages/delivery/+page.svelte";

    import "../app.scss";

    import deliveryIcon from "@assets/icons/delivery.svg";
    import salaryIcon from "@assets/icons/salary.svg";

    let collapsed = writable(true);
    $: setContext("collapsed", collapsed);

    let page: "delivery" | "salary" = "delivery";
</script>

<div id="wrapper" class:sidebar_collapsed={$collapsed}>
    <nav>
        <Header />
        <Link
            text="Закупка"
            icon={deliveryIcon}
            on:click={() => (page = "delivery")}
            current={page == "delivery"}
        />
        <Link
            text="Зарплаты"
            icon={salaryIcon}
            on:click={() => (page = "salary")}
            current={page == "salary"}
        />
        <!-- <Link text="Учёт" icon="/icons/accounting.svg" /> -->
        <Spacer />
        <!-- <Link text="Сотрудники" icon="/icons/employee.svg" /> -->
        <!-- <Link text="Точки продаж" icon="/icons/shop.svg" /> -->
        <!-- <Link text="Настройки" icon="/icons/gear.svg" /> -->
    </nav>
    <main>
        {#if page === "delivery"}
            <DeliveryPage />
        {:else if page === "salary"}
            WIP
        {/if}
    </main>
</div>

<style lang="scss">
    #wrapper {
        display: flex;
        height: 100vh;

        &.sidebar_collapsed {
            --sidebar-width: 48px;
        }
        &:not(.sidebar_collapsed) {
            --sidebar-width: 200px;
        }

        nav {
            flex: 0 0 min(100vw, var(--sidebar-width));
            transition: flex 0.5s;

            display: flex;
            align-items: stretch;
            flex-direction: column;

            color: white;
            background-color: #455561;
            overflow: hidden;
        }

        main {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-y: hidden;
        }
    }
</style>
