import json

file_path = 'prisma/marquis-products.json'

with open(file_path, 'r', encoding='utf-8') as f:
    products = json.load(f)

count = 0
for p in products:
    if 'shellColors' in p and "Ash" in p['shellColors']:
        p['shellColors'].remove("Ash")
        count += 1

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=4)

print(f"Removed 'Ash' from shellColors in {count} products.")
