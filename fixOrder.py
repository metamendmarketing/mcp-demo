import re

with open('c:/dev2/src/components/wizard/Wizard.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Match the three blocks exactly using non-greedy dotall
# They are in the order: zipCode, sunExposure, placement
pattern = r"(  \{\s+id: 'zipCode',.*?layout: 'map',\s+options: \[\]\s+\},\s+)(  \{\s+id: 'sunExposure',.*?\s+\]\s+\},\s+)(  \{\s+id: 'placement',.*?\s+\]\s+\},)"
match = re.search(pattern, code, re.DOTALL)

if match:
    zip_block = match.group(1)
    sun_block = match.group(2)
    placement_block = match.group(3)
    
    # Modify sun_block text
    sun_block = re.sub(r'What is the primary backyard orientation\?', 'How much sun does this exact spot receive?', sun_block)
    sun_block = re.sub(r'A hot tub facing full Southern exposure will experience significant solar gain, reducing heating costs but accelerating UV degradation on standard covers\. In this scenario, we will specifically mandate a premium Weathershield™ or ProLast™ cover', 'A hot tub sitting in direct sunlight all day will experience significant solar gain, reducing heating costs but accelerating UV degradation on standard vinyl covers. In a high-sun scenario, we will specifically mandate a premium Weathershield™ or ProLast™ fabric cover', sun_block)
    
    sun_block = re.sub(r"value: 'morning', label: 'Morning Sun', tip: \"Gentle Eastern exposure.\"", "value: 'morning', label: 'Morning Sun Only', tip: \"Gentle warmth; cooler in the evenings.\"", sun_block)
    sun_block = re.sub(r"value: 'afternoon', label: 'Afternoon Sun', tip: \"Intense Western exposure.\"", "value: 'afternoon', label: 'Afternoon / Late Sun', tip: \"Intense heat during the peak of the day.\"", sun_block)
    sun_block = re.sub(r"value: 'direct', label: 'Full Day Direct', tip: \"Maximum Southern exposure.\"", "value: 'direct', label: 'Direct Sun All Day', tip: \"Maximum solar gain; minimal shade.\"", sun_block)
    
    # Change shaded icon from Cloud to TreePine, and text
    sun_block = re.sub(r"value: 'shaded', label: 'Predominantly Shaded', tip: \"Under trees or awnings.\", icon: <Cloud", "value: 'shaded', label: 'Heavy Shade / Covered', tip: \"Under a roof, pergola, or dense trees.\", icon: <TreePine", sun_block)
    
    zip_block = re.sub(r'Where will your oasis be located\?', 'What is your Zip Code?', zip_block)
    zip_block = re.sub(r'Your climate and elevation', 'Your precise climate and elevation', zip_block)

    # Reassemble: placement -> sun -> zip
    new_combined = placement_block + sun_block + zip_block
    
    code = code[:match.start()] + new_combined + code[match.end():]
    
    with open('c:/dev2/src/components/wizard/Wizard.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Replaced successfully")
else:
    print("Pattern not found")
