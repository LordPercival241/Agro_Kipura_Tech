import re

def get_centroid(path_str):
    # Extract points from M x,y L x,y ...
    points = re.findall(r'([-+]?\d*\.\d+|\d+),([-+]?\d*\.\d+|\d+)', path_str)
    points = [(float(x), float(y)) for x, y in points]
    if not points:
        return (0, 0)
    
    # Calculate geometric centroid
    avg_x = sum(p[0] for p in points) / len(points)
    avg_y = sum(p[1] for p in points) / len(points)
    
    # Find multiple points for Selva and Sierra since they are large
    # For Costa, maybe 3 points along the strip
    return (avg_x, avg_y)

def get_multiple_points(path_str, n=3):
    points = re.findall(r'([-+]?\d*\.\d+|\d+),([-+]?\d*\.\d+|\d+)', path_str)
    points = [(float(x), float(y)) for x, y in points]
    if len(points) < n:
        return points
    
    # Return n points evenly distributed
    step = len(points) // n
    return [points[i * step] for i in range(n)]

paths = {}
for r in ["costa", "sierra", "selva"]:
    with open(f"path_{r}.txt") as f:
        paths[r] = f.read()

print("Costa nodes:")
for p in get_multiple_points(paths["costa"], 3):
    print(f"{{ cx: {p[0]:.0f}, cy: {p[1]:.0f}, region: 'costa' }},")

print("Sierra nodes:")
for p in get_multiple_points(paths["sierra"], 4):
    print(f"{{ cx: {p[0]:.0f}, cy: {p[1]:.0f}, region: 'sierra' }},")

print("Selva nodes:")
for p in get_multiple_points(paths["selva"], 3):
    print(f"{{ cx: {p[0]:.0f}, cy: {p[1]:.0f}, region: 'selva' }},")
