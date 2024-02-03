import { DB } from "./database";

export type Supplier = {
    id: number;
    name: string;
    summary_debt: number;
};

export async function getSuppliers(): Promise<Supplier[]> {
    let db = await DB;
    return await db.select<Supplier[]>(
        `SELECT 
            Id AS id,
            [Name] as [name],
            (SELECT
                ifnull((SELECT sum(Amount) as Amount FROM SupplierOrder WHERE SupplierId = id), 0) -
                ifnull((SELECT sum(Amount) as Amount FROM SupplierRepayment WHERE SupplierId = id), 0)
            ) AS summary_debt
        FROM Supplier;`
    );
}

export async function newSupplier(name: string): Promise<number> {
    let db = await DB;
    let result = await db.execute("INSERT INTO Supplier (Name) VALUES ($1);", [
        name
    ]);
    return result.lastInsertId;
}

export async function updateSupplier(id: number, name: string) {
    let db = await DB;
    await db.execute("UPDATE Supplier SET [name] = $1 WHERE Id = $2;", [
        name,
        id
    ]);
}
