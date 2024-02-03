// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_sql::{Builder, Migration, MigrationKind};

fn main() {
    let migrations = vec![Migration {
        version: 1,
        description: "create_initial_tables",
        sql: "
                CREATE TABLE Supplier (Id INTEGER PRIMARY KEY, Name TEXT NOT NULL);
                CREATE TABLE SupplierOrder (
                    Date DATE,
                    SupplierId INTEGER REFERENCES Supplier(Id),
                    StoreId INTEGER REFERENCES Store(Id),
                    Amount INTEGER NOT NULL,
                    PRIMARY KEY (Date, SupplierId, StoreId)
                );
                CREATE TABLE SupplierRepayment (
                    Date DATE,
                    SupplierId INTEGER REFERENCES Supplier(Id),
                    Amount INTEGER NOT NULL,
                    PRIMARY KEY (Date, SupplierId)
                );

                CREATE TABLE Store (Id INTEGER PRIMARY KEY, Name TEXT NOT NULL);
                CREATE TABLE Employee (
                    Id INTEGER PRIMARY KEY,
                    Name TEXT NOT NULL,
                    SalaryBase INTEGER NOT NULL DEFAULT 0,
                    SalaryDaily INTEGER NOT NULL DEFAULT 0,
                    SalaryPercent REAL NOT NULL DEFAULT 0
                );
                CREATE TABLE Shift (
                    Date DATE,
                    EmployeeId INTEGER REFERENCES Employee(Id),
                    StoreId INTEGER REFERENCES Store(Id) NOT NULL,
                    PRIMARY KEY(Date, EmployeeId)
                );
            ",
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(
            Builder::default()
                .add_migrations("sqlite:database.db", migrations)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
