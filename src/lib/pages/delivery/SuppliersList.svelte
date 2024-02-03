<script lang="ts">
    import { newSupplier, updateSupplier, type Supplier, getSuppliers } from "@lib/model/supplier";
    import editIcon from "@assets/icons/gear.svg";

    export let suppliers: Supplier[];
    export let supplier_id: number | undefined;

    const createNew = async () => {
        let name = prompt("Название нового поставщика.");
        if (name) {
            supplier_id = await newSupplier(name);
            suppliers = await getSuppliers();
        }
    };
    const rename = async (supplier: Supplier) => {
        let name = prompt("Новое название поставщика.", supplier.name);
        if (name) {
            await updateSupplier(supplier.id, name);
            suppliers = await getSuppliers();
        }
    };
</script>

<menu class="sidebar">
    <ul>
        {#each suppliers as supplier}
            <li>
                <button class="supplier" on:click={() => supplier_id = supplier.id}>
                    <span class="name">{supplier.name}</span>
                    <span class="debt">{`${supplier.summary_debt.toFixed(2)} ₽`}</span>
                </button>
                <button class="edit" on:click={() => rename(supplier)}>
                    <img src={editIcon} alt="edit" />
                </button>
            </li>
        {/each}
    </ul>
    <button on:click={createNew}>Новый</button>
</menu>

<style lang="scss">
    .sidebar {
        display: flex;
        flex-direction: column;
        background-color: #707070;

        > ul {
            display: flex;
            flex-direction: column;
            > li {
                display: flex;
                height: 40px;

                > .supplier {
                    flex: 1;
                    display: flex;
                    gap: 8px;
                    padding: 8px;
                    color: white;
                    text-decoration: none;
                    overflow-x: hidden;

                    > span {
                        display: flex;
                        white-space: nowrap;
                        &.name {
                            flex: 1;
                            min-width: 0;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        &.debt {
                            flex: 0 1 content;
                        }
                    }
                }

                > .edit {
                    aspect-ratio: 1;
                    align-self: stretch;
                    > img {
                        filter: invert(1);
                        width: 24px;
                        height: 24px;
                    }
                }

                > button {
                    background-color: #424242;
                    border-top: 1px solid #727272;
                    &:hover {
                        background-color: #323232;
                    }
                }
            }
        }

        > button {
            color: white;
            margin-top: auto;
            height: 50px;
            border-top: 1px solid #727272;
            background-color: #424242;
            &:hover {
                background-color: #323232;
            }
        }
    }

    button {
        border: 0;
        border-radius: 0;
        cursor: pointer;
    }
</style>
