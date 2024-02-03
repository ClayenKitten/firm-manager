<script lang="ts">
    import DataGrid from "@lib/components/datagrid/DataGrid.svelte";
    import type { GridDef } from "@lib/components/datagrid/gridDef";
    import type { ColDef } from "@lib/components/datagrid/column";
    import {
        type Delivery,
        setDeliveryOrder,
        setDeliveryRepayment

    } from "@lib/model/delivery";
    import type { Store } from "@lib/model/stores";
    import { createEventDispatcher } from "svelte";

    export let supplier_id: number;
    export let stores: Store[];
    export let deliveries: Delivery[];

    const moneyColumn: Partial<ColDef<Delivery, number>> = {
        formatter: val => (val ? `${val.toFixed(2)} ₽` : ""),
        align: "end"
    };

    let dispatch = createEventDispatcher<{ changed: void }>();

    let gridDef: GridDef<Delivery> = {
        colDefs: [
            {
                field: "date",
                header: "Дата",
                formatter: date => date.toLocaleDateString("ru-ru"),
                width: "100px",
                align: "center",
                summary: () => "Итог"
            } satisfies ColDef<Delivery, Date>,
            ...Array.from(stores, store => {
                return {
                    ...moneyColumn,
                    header: `${store.name}`,
                    getter: data => {
                        let val = data.debts.find(
                            it => it.store_id == store.id
                        );
                        return val ? val.amount : 0;
                    },
                    setter: async (data, new_value) => {
                        await setDeliveryOrder(
                            data.date,
                            supplier_id,
                            store.id,
                            new_value
                        );
                        dispatch("changed");
                    },
                    summary: "sum"
                } satisfies ColDef<Delivery, number>;
            }),
            {
                ...moneyColumn,
                getter: data =>
                    data.debts
                        .map(debt => debt.amount)
                        .reduce((a, b) => a + b, 0),
                header: "За день",
                summary: "sum"
            },
            {
                ...moneyColumn,
                field: "payed",
                header: "Выплата",
                getter: data => data.payed,
                setter: async (data, new_value) => {
                    await setDeliveryRepayment(data.date, supplier_id, new_value)
                    dispatch("changed");
                },
                summary: "sum"
            } satisfies ColDef<Delivery, number>,
            {
                field: "remaining",
                header: "Остаток долга",
                formatter: val => (val ? `${val.toFixed(2)} ₽` : "0.00 ₽"),
                align: "end"
            } satisfies ColDef<Delivery, number>
        ],
        summary: true
    };
</script>

<div>
    <DataGrid data={deliveries} {gridDef} />
</div>

<style lang="scss">
    div {
        width: 100%;
        margin: 0 auto;
        min-width: 700px;
        overflow-x: scroll;
    }
</style>
