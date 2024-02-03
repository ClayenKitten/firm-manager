import Database from "tauri-plugin-sql-api";

export const DB = Database.load("sqlite:database.db");
