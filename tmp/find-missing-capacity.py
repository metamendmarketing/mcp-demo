import sqlite3

db_path = 'prisma/dev.db'

def check():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT modelName, slug, seatsMin, seatsMax FROM Product WHERE seatsMax IS NULL OR seatsMin IS NULL")
    rows = cursor.fetchall()
    
    if not rows:
        print("No products found with missing capacity data.")
    else:
        print(f"Found {len(rows)} products with missing capacity:")
        for row in rows:
            print(f"- {row[0]} ({row[1]}): {row[2]}-{row[3]}")
            
    conn.close()

if __name__ == "__main__":
    check()
