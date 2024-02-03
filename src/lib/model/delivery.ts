import { dateToLocalISO } from "@lib/util";
import { DB } from "./database";

export type Delivery = {
    date: Date;
    payed: number;
    debts: { store_id: number; amount: number }[];
    remaining: number;
};

export async function getDailyDeliveries(
    supplier_id: number,
    month: number,
    year: number
): Promise<Delivery[]> {
    let db = await DB;

    let _month = (month + 1).toFixed(0).padStart(2, "0");
    let _year = year.toFixed(0).padStart(2, "0");

    type Order = { store_id: number; amount: number; date: string };

    let orders = await db.select<Order[]>(
        `SELECT [Date] as date, StoreId as store_id, Amount as amount
            FROM SupplierOrder WHERE
                SupplierId = $1 AND
                strftime("%m", Date) = $2 AND
                strftime("%Y", Date) = $3
        `,
        [supplier_id, _month, _year]
    );

    let repays = await db.select<{ date: string; amount: number }[]>(
        `SELECT [Date] as [date], Amount as amount FROM SupplierRepayment
        WHERE SupplierId = $1 AND
        strftime("%m", Date) = $2 AND
        strftime("%Y", Date) = $3;`,
        [supplier_id, _month, _year]
    );

    let daysInMonth = new Date(year, month + 1, 0).getDate();

    let deliveries = [];
    for (let i = 0; i < daysInMonth; i++) {
        let date = new Date(year, month, i + 1);
        let date_str = dateToLocalISO(date);
        let payed = repays.find(x => x.date == date_str);
        deliveries.push({
            date,
            payed: payed ? payed.amount : 0,
            debts: orders
                .filter(x => x.date == date_str)
                .map(x => ({ store_id: x.store_id, amount: x.amount })),
            remaining: await getRemaining(supplier_id, date)
        });
    }
    return deliveries;
}

/** Gets remaining value to pay to supplier at the date. */
async function getRemaining(supplier_id: number, date: Date): Promise<number> {
    let db = await DB;

    let _date = dateToLocalISO(date);
    return (
        await db.select<[{ amount: number }]>(
            `SELECT (
                ifnull((SELECT sum(Amount) as Amount FROM SupplierOrder WHERE SupplierId = $1 AND Date <= $2), 0) -
	            ifnull((SELECT sum(Amount) as Amount FROM SupplierRepayment WHERE SupplierId = $1 AND Date <= $2), 0)
            ) AS amount;`,
            [supplier_id, _date]
        )
    )[0].amount;
}

export async function setDeliveryOrder(
    date: Date,
    supplier_id: number,
    store_id: number,
    amount: number
) {
    let db = await DB;
    db.execute(
        `INSERT INTO SupplierOrder([Date], SupplierId, StoreId, Amount) VALUES($1, $2, $3, $4) ON CONFLICT DO UPDATE SET Amount=$4;`,
        [dateToLocalISO(date), supplier_id, store_id, amount]
    );
}

export async function setDeliveryRepayment(
    date: Date,
    supplier_id: number,
    amount: number
) {
    let db = await DB;
    db.execute(
        `INSERT INTO SupplierRepayment([Date], SupplierId, Amount) VALUES($1, $2, $3) ON CONFLICT DO UPDATE SET Amount=$3;`,
        [dateToLocalISO(date), supplier_id, amount]
    );
}
