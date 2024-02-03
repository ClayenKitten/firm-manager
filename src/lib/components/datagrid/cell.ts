import type { KeysWithValsOfType } from "./util";

export type Field<T, TVal> = KeysWithValsOfType<T, TVal>;

/** Function that turns data entry into specific value. */
export type Getter<T, TVal> = (rowData: T ) => TVal;

/** Function that attempts to set value from user input. */
export type Setter<T, TVal> = (data: T, field: TVal) => void;
