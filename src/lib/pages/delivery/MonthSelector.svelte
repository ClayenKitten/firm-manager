<script lang="ts">
    import { monthNames } from "./util";

    export let month: number;
    export let year: number;

    const current_month = new Date().getMonth();
    const current_year = new Date().getFullYear();

    $: is_last_month = month >= current_month && year >= current_year;

    const addMonth = () => {
        if (is_last_month) return;
        if (month == 11) {
            month = 0;
            year += 1;
        } else {
            month += 1;
        }
    };
    const subMonth = () => {
        if (month == 0) {
            month = 11;
            year -= 1;
        } else {
            month -= 1;
        }
    };
</script>

<menu class="dateSelector">
    <button on:click={subMonth}>◀</button>
    <h1>{monthNames[month]} {year}</h1>
    <button on:click={addMonth} disabled={is_last_month}>▶</button>
</menu>

<style lang="scss">
    menu {
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        align-items: center;
        gap: 8px;
        height: 60px;
        background-color: #424242;
        > h1 {
            color: white;
            text-align: center;
        }
        > button {
            display: flex;
            width: 32px;
            height: 32px;
            border-radius: 100%;
            border: 2px solid #616161;
            align-items: center;
            justify-content: center;
            color: white;
            background-color: #535353;
            font-size: 12px;
            cursor: pointer;
            &:hover {
                background-color: #616161;
            }
            &:disabled {
                cursor: not-allowed;
                background-color: #838383;
                border: 2px solid #838383;
            }
            &:first-of-type {
                padding: 0 2px 2px 0;
            }
            &:last-of-type {
                padding: 0 0 2px 2px;
            }
        }
    }
</style>
