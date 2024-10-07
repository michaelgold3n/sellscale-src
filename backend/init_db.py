import sqlite3

DB_NAME = "portfolio.db"

conn = sqlite3.connect(DB_NAME)
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT NOT NULL,
    name TEXT,
    quantity INTEGER NOT NULL,
    average_price REAL NOT NULL
)
''')

# Pre-populate with stocks
pre_populated_stocks = [
    ('NVDA', 'NVIDIA Corporation', 10, 400.00),
    ('AAPL', 'Apple Inc.', 15, 150.00),
    ('META', 'Meta Platforms, Inc.', 8, 300.00),
    ('GOOGL', 'Alphabet Inc.', 5, 120.00)
]

for symbol, name, quantity, average_price in pre_populated_stocks:
    cursor.execute('''
        INSERT OR REPLACE INTO portfolio (symbol, name, quantity, average_price)
        VALUES (?, ?, ?, ?)
    ''', (symbol, name, quantity, average_price))

conn.commit()
conn.close()

print("Database initialized successfully with pre-populated stocks.")