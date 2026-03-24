import sqlite3
import json

db_path = 'prisma/dev.db'
json_path = 'prisma/marquis-products.json'

def sync():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Verify table structure
    cursor.execute("PRAGMA table_info(Product)")
    columns = [row[1] for row in cursor.fetchall()]
    print(f"Columns in Product table: {columns}")

    with open(json_path, 'r', encoding='utf-8') as f:
        products = json.load(f)

    print(f"Syncing {len(products)} products...")

    for p in products:
        shell_json = json.dumps(p['shellColors'])
        cabinet_json = json.dumps(p['cabinetColors'])
        
        # SQL Update
        sql = """
        UPDATE Product 
        SET shellColors = ?, 
            cabinetColors = ?, 
            seatsMin = ?, 
            seatsMax = ?,
            marketingSummary = ?
        WHERE slug = ?
        """
        cursor.execute(sql, (
            shell_json, 
            cabinet_json, 
            p.get('seatsMin'), 
            p.get('seatsMax'), 
            p.get('marketingSummary'),
            p['slug']
        ))

    conn.commit()
    print("Database sync complete.")
    conn.close()

if __name__ == "__main__":
    sync()
