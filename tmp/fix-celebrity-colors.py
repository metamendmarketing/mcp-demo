import json

file_path = 'prisma/marquis-products.json'

with open(file_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

celebrity_shells = ["Glacier", "Midnight Canyon", "Sterling Silver", "Tuscan Sun"]
celebrity_cabinets = ["Ash", "Pecan", "Black Weathershield (Optional)"]

count = 0
for p in products:
    if p.get('seriesName') == 'Celebrity Series':
        p['shellColors'] = celebrity_shells
        p['cabinetColors'] = celebrity_cabinets
        count += 1

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=4)

print(f"Updated {count} Celebrity models.")
