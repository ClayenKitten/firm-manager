import type { Field, Getter, Setter } from "./cell";

export type ColDef<T, TVal> = {
    header: string;
    align?: "start" | "center" | "end";
    width?: `${number}px`;
    formatter?: (value: TVal) => string;
    summary?: Summary<TVal>;
} & (
    | { field: Field<T, TVal>, editable?: boolean; }
    | { getter: Getter<T, TVal>; setter?: Setter<T, TVal>; }
);

export class Column<T, TVal> {
    public colDef: ColDef<T, TVal>;

    public getValue(rowData: T): TVal {
        if ("getter" in this.colDef) {
            return this.colDef.getter(rowData);
        } else {
            return rowData[this.colDef.field] as TVal;
        }
    }

    public setValue(data: T, value: TVal) {
        if (!this.editable) return;

        if ("getter" in this.colDef) {
            if (this.editable && this.colDef.setter) {
                this.colDef.setter(data, value);
            }
        } else {
            if (this.editable) {
                (data[this.colDef.field] as TVal) = value;
            }
        }
    }

    public get editable(): boolean {
        return (
            ("editable" in this.colDef && this.colDef.editable) ||
            ("setter" in this.colDef && this.colDef.setter !== undefined)
        );
    }

    public format(value: TVal): string {
        if (this.colDef.formatter) {
            return this.colDef.formatter(value);
        } else {
            if (value === null) return "null";
            else if (value === undefined) return "undefined";
            else return value.toString();
        }
    }

    public getFooterValue(data: T[]): string | undefined {
        let _summary = this.colDef.summary;
        if (_summary === undefined) return undefined;
        let summary = _summary as SummaryInternal<TVal>;

        let col_data = data.map(row => this.getValue(row));

        if (typeof summary == "function") {
            return summary(col_data);
        } else {
            return this.format(this.numberFooterFunc(col_data, summary));
        }
    }

    /** Caution: that function is not type-safe. It expects all data in column to be numbers. */
    private numberFooterFunc(data: TVal[], summary: PresetSummary): TVal {
        let _data = data as number[];
        let result = 0;
        if (summary == "sum") {
            result = _data.reduce((a, b) => a + b, 0);
        } else if (summary == "avg" && _data.length != 0) {
            result = _data.reduce((a, b) => a + b, 0) / _data.length;
        }
        return result as TVal;
    }

    constructor(colDef: ColDef<T, TVal>) {
        this.colDef = colDef;
    }
}

type Summary<TVal> = TVal extends number ? SummaryFunc<TVal> | PresetSummary : SummaryFunc<TVal>;

type SummaryFunc<TVal> = (data: TVal[]) => string;
type PresetSummary = "sum" | "avg";

type SummaryInternal<TVal> = SummaryFunc<TVal> | PresetSummary;
