import urllib.request, json

def geojson_to_svg(geojson_url):
    req = urllib.request.Request(geojson_url, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req)
    data = json.loads(response.read().decode('utf-8'))
    
    # Peru polygon coordinates
    polygons = []
    if 'features' in data:
        geometry = data['features'][0]['geometry']
        if geometry['type'] == 'Polygon':
            polygons = geometry['coordinates']
        elif geometry['type'] == 'MultiPolygon':
            for poly in geometry['coordinates']:
                polygons.append(poly[0])

    # Find bounds
    min_lng, max_lng = 180, -180
    min_lat, max_lat = 90, -90
    
    for poly in polygons:
        for lon, lat in poly:
            min_lng = min(min_lng, lon)
            max_lng = max(max_lng, lon)
            min_lat = min(min_lat, lat)
            max_lat = max(max_lat, lat)
            
    width = 500
    height = 600
    
    def project(lon, lat):
        # simple equitable projection scaled to box
        x = (lon - min_lng) / (max_lng - min_lng) * width
        y = height - ((lat - min_lat) / (max_lat - min_lat) * height)
        return x, y
        
    paths = []
    for poly in polygons:
        path = ""
        for i, (lon, lat) in enumerate(poly):
            x, y = project(lon, lat)
            cmd = "M" if i == 0 else "L"
            path += f"{cmd}{x:.1f},{y:.1f} "
        path += "Z"
        paths.append(path)
        
    print(paths[0])
    
geojson_to_svg('https://raw.githubusercontent.com/johan/world.geo.json/master/countries/PER.geo.json')
