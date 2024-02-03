import { DB } from "./database";

export type Store = {
    id: number;
    name: string;
};

export async function getStores(): Promise<Store[]> {
    let db = await DB;
    return await db.select<Store[]>(
        "SELECT Id AS id, [Name] as [name] FROM Store;"
    );
}

export async function newStore(name: string): Promise<number> {
    let db = await DB;
    let result = await db.execute("INSERT INTO Store (Name) VALUES ($1);", [
        name
    ]);
    return result.lastInsertId;
}
