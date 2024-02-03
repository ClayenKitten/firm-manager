import type { ColDef } from "./column";

export type GridDef<T> = {
    colDefs: ColDef<T, any>[],
    summary?: boolean,
}
