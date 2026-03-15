import urllib.request, json
import urllib.parse
import math

def point_line_distance(point, start, end):
    if start == end:
        return math.hypot(point[0] - start[0], point[1] - start[1])
    # Line eq: Ax + By + C = 0
    n = abs((end[1] - start[1])*point[0] - (end[0] - start[0])*point[1] + end[0]*start[1] - end[1]*start[0])
    d = math.hypot(end[1] - start[1], end[0] - start[0])
    return n / d

def douglas_peucker(points, epsilon):
    if len(points) < 3:
        return points

    dmax = 0
    index = 0
    end = len(points) - 1

    for i in range(1, end):
        d = point_line_distance(points[i], points[0], points[end])
        if d > dmax:
            index = i
            dmax = d

    if dmax > epsilon:
        rec_results1 = douglas_peucker(points[:index+1], epsilon)
        rec_results2 = douglas_peucker(points[index:], epsilon)
        return rec_results1[:-1] + rec_results2
    else:
        return [points[0], points[end]]

def geojson_to_svg_regions():
    url = "https://raw.githubusercontent.com/josedaniel-cb/limites-peru-geojson/master/LIM_DEPARTAMENTAL_PERU_MIN.json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req)
    data = json.loads(response.read().decode('utf-8'))
    
    regions = {
        "costa": ["TUMBES", "PIURA", "LAMBAYEQUE", "LA LIBERTAD", "ANCASH", "LIMA", "CALLAO", "ICA", "AREQUIPA", "MOQUEGUA", "TACNA"],
        "sierra": ["CAJAMARCA", "HUANUCO", "PASCO", "JUNIN", "HUANCAVELICA", "AYACUCHO", "APURIMAC", "CUSCO", "PUNO"],
        "selva": ["AMAZONAS", "SAN MARTIN", "LORETO", "UCAYALI", "MADRE DE DIOS"]
    }
    
    # Pre-process: some departments span regions.
    # The Geojson usually maps fine, but we'll accept these as standard definitions for the map.
    
    min_lng, max_lng = 180, -180
    min_lat, max_lat = 90, -90
    
    region_polygons = {"costa": [], "sierra": [], "selva": []}
    
    for feature in data.get('features', []):
        props = feature.get('properties', {})
        name = props.get('NOMBDEP', '').upper()
        
        region_assigned = None
        for r, deps in regions.items():
            if name in deps:
                region_assigned = r
                break
                
        if not region_assigned: continue
            
        geom = feature.get('geometry', {})
        if not geom: continue
        
        polys = []
        if geom['type'] == 'Polygon':
            polys = geom['coordinates']
        elif geom['type'] == 'MultiPolygon':
            for p in geom['coordinates']:
                polys.append(p[0])
                
        for poly in polys:
            region_polygons[region_assigned].append(poly)
            for lon, lat in poly:
                min_lng = min(min_lng, lon)
                max_lng = max(max_lng, lon)
                min_lat = min(min_lat, lat)
                max_lat = max(max_lat, lat)
                
    width = 400
    height = 550
    padding = 20
    
    def project(lon, lat):
        x = padding + (lon - min_lng) / (max_lng - min_lng) * (width - 2*padding)
        y = height - padding - ((lat - min_lat) / (max_lat - min_lat) * (height - 2*padding))
        return x, y
        
    for r in ["costa", "sierra", "selva"]:
        paths = []
        for poly in region_polygons[r]:
            poly_proj = [project(lon, lat) for lon, lat in poly]
            # Substantial simplification (1.0 pixel threshold)
            poly_simp = douglas_peucker(poly_proj, 1.2) 
            path = ""
            for i, (x, y) in enumerate(poly_simp):
                cmd = "M" if i == 0 else "L"
                path += f"{cmd}{x:.1f},{y:.1f} "
            path += "Z"
            paths.append(path)
            
        full_path = " ".join(paths)
        print(f"Region {r}: {len(full_path)} bytes")
        with open(f"path_{r}.txt", "w") as f:
            f.write(full_path)

if __name__ == "__main__":
    geojson_to_svg_regions()
