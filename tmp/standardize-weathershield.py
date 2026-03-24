import json

file_path = 'prisma/marquis-products.json'

with open(file_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

old_name = "Black Weathershield"
new_name = "Black Weathershield (Optional)"

count = 0
for p in products:
    updated = False
    if 'cabinetColors' in p:
        new_cabinets = []
        for c in p['cabinetColors']:
            if c == old_name:
                new_cabinets.append(new_name)
                updated = True
            else:
                new_cabinets.append(c)
        p['cabinetColors'] = new_cabinets
    if updated:
        count += 1

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=4)

print(f"Standardized {count} models with the full name.")
