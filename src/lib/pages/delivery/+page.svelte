<script lang="ts">
    import { getSuppliers, type Supplier } from "@lib/model/supplier";
    import { onMount } from "svelte";
    import DeliveriesGrid from "./DeliveriesGrid.svelte";
    import MonthSelector from "./MonthSelector.svelte";
    import SuppliersList from "./SuppliersList.svelte";
    import { getStores, type Store } from "@lib/model/stores";
    import { getDailyDeliveries, type Delivery } from "@lib/model/delivery";

    let supplier_id: number | undefined = undefined;
    let month: number = new Date().getMonth();
    let year: number = new Date().getFullYear();

    let suppliers: Supplier[] = [];
    let stores: Store[] = [];
    let deliveries: Delivery[] = [];

    onMount(async () => await reloadData());

    async function reloadData() {
        suppliers = await getSuppliers();
        stores = await getStores();
        if (supplier_id) {
            deliveries = await getDailyDeliveries(supplier_id, month, year);
        }
    }

    $: {
        supplier_id, month, year;
        reloadData();
    }
</script>

<div>
    <MonthSelector bind:month bind:year />
    <header>
        {#if supplier_id !== undefined}
            {@const name = suppliers.find(x => x.id == supplier_id)?.name}
            {#if name}
                {name}
            {/if}
        {/if}
    </header>
    <SuppliersList bind:supplier_id bind:suppliers />
    <section>
        {#if supplier_id !== undefined}
            <DeliveriesGrid {supplier_id} {deliveries} {stores} on:changed={reloadData} />
        {:else}
            <h1>Выберите поставщика в списке или создайте нового.</h1>
        {/if}
    </section>
</div>

<style lang="scss">
    div {
        display: grid;
        grid-template-columns: 280px 1fr;
        grid-template-rows: 60px 1fr;
        overflow-y: hidden;
        height: 100%;
        > header {
            display: flex;
            align-items: center;
            justify-content: center;

            background-color: #424242;
            border-bottom: 1px solid #727272;
            color: white;
            font-size: 21px;
        }
        > section {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-y: scroll;
            justify-content: stretch;
            align-items: center;

            > h1 {
                font-size: 24px;
                text-align: center;
                padding: 40px;
                margin: auto;
            }
        }
    }
</style>
