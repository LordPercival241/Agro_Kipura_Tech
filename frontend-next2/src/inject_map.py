import re

# Read the paths
with open("path_costa.txt") as f: costa_path = f.read().strip()
with open("path_sierra.txt") as f: sierra_path = f.read().strip()
with open("path_selva.txt") as f: selva_path = f.read().strip()

# Read MapSection
map_file = "src/components/MapSection.tsx"
with open(map_file, "r", encoding="utf-8") as f:
    content = f.read()

# Replace Costa
content = re.sub(
    r'({\/\* COSTA — western strip \*\/}\s*<path className={`map-region \${activeRegion === "costa" \? "active" : ""}`}\s*d=")[^"]+(")',
    rf'\g<1>{costa_path}\g<2>',
    content
)

# Replace Sierra
content = re.sub(
    r'({\/\* SIERRA — central backbone \*\/}\s*<path className={`map-region \${activeRegion === "sierra" \? "active" : ""}`}\s*d=")[^"]+(")',
    rf'\g<1>{sierra_path}\g<2>',
    content
)

# Replace Selva
content = re.sub(
    r'({\/\* SELVA — eastern side \*\/}\s*<path className={`map-region \${activeRegion === "selva" \? "active" : ""}`}\s*d=")[^"]+(")',
    rf'\g<1>{selva_path}\g<2>',
    content
)

# Update dots to match the new 400x550 coordinate system (padding=20)
# We need to find the array of dots and replace it
new_dots = '''{[
              { cx: 75, cy: 190, region: "costa" },
              { cx: 105, cy: 260, region: "costa" },
              { cx: 130, cy: 350, region: "costa" },
              { cx: 160, cy: 180, region: "sierra" },
              { cx: 190, cy: 300, region: "sierra" },
              { cx: 210, cy: 400, region: "sierra" },
              { cx: 260, cy: 480, region: "sierra" },
              { cx: 240, cy: 140, region: "selva" },
              { cx: 290, cy: 220, region: "selva" },
              { cx: 290, cy: 320, region: "selva" },
            ]'''

content = re.sub(
    r'{\[\s*\{\s*cx: \d+.*?\]\.map\(\(dot, i\)',
    new_dots + '.map((dot, i)',
    content,
    flags=re.DOTALL
)

# Update connection lines
new_lines = '''{[
              { x1: 75, y1: 190, x2: 160, y2: 180 },
              { x1: 160, y1: 180, x2: 240, y2: 140 },
              { x1: 105, y1: 260, x2: 190, y2: 300 },
              { x1: 190, y1: 300, x2: 290, y2: 220 },
              { x1: 130, y1: 350, x2: 210, y2: 400 },
              { x1: 210, y1: 400, x2: 290, y2: 320 },
              { x1: 210, y1: 400, x2: 260, y2: 480 },
            ]'''
content = re.sub(
    r'{\[\s*\{\s*x1: \d+.*?\]\.map\(\(line, i\)',
    new_lines + '.map((line, i)',
    content,
    flags=re.DOTALL
)

# Update text labels
content = re.sub(
    r'<text x="\d+" y="\d+".*?>COSTA<\/text>',
    r'<text x="60" y="240" className="map-label" fill="rgba(59, 130, 246, 0.9)" fontSize="13" fontWeight="800" fontFamily="Inter, sans-serif" transform="rotate(-65 60,240)">COSTA</text>',
    content
)
content = re.sub(
    r'<text x="\d+" y="\d+".*?>SIERRA<\/text>',
    r'<text x="145" y="320" className="map-label" fill="rgba(45, 139, 78, 0.9)" fontSize="14" fontWeight="800" fontFamily="Inter, sans-serif" transform="rotate(-55 145,320)">SIERRA</text>',
    content
)
content = re.sub(
    r'<text x="\d+" y="\d+".*?>SELVA<\/text>',
    r'<text x="250" y="260" className="map-label" fill="rgba(5, 150, 105, 0.9)" fontSize="16" fontWeight="800" fontFamily="Inter, sans-serif">SELVA</text>',
    content
)

with open(map_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Map updated successfully!")
