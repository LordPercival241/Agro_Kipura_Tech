import re

path = "M463.7,574.8 L453.2,591.6 L433.0,600.0 L393.7,581.2 L390.3,567.7 L312.5,534.8 L242.2,498.9 L211.9,478.7 L195.7,451.6 L202.1,442.1 L168.9,399.1 L130.2,338.5 L93.1,273.2 L77.1,258.3 L64.7,234.1 L34.3,212.7 L6.3,199.4 L19.0,184.8 L0.0,153.5 L12.2,130.5 L43.5,109.8 L48.1,123.5 L36.9,131.3 L38.0,143.3 L54.2,140.7 L70.1,144.2 L86.5,160.8 L108.7,147.3 L116.1,125.2 L140.2,96.6 L187.3,83.7 L230.1,49.3 L242.3,28.0 L236.9,3.1 L247.3,0.0 L273.4,15.5 L285.9,31.0 L304.1,39.5 L327.2,73.9 L356.4,78.0 L378.0,69.3 L392.2,75.0 L415.7,72.2 L445.8,87.5 L420.5,120.9 L432.2,121.7 L451.8,139.1 L416.5,137.6 L411.2,142.5 L379.0,148.8 L334.2,171.1 L331.3,186.5 L321.3,197.9 L325.2,215.6 L301.5,225.1 L301.6,238.9 L291.2,244.9 L307.5,274.5 L329.3,294.4 L321.1,308.5 L347.1,310.4 L361.9,327.9 L396.5,328.8 L428.7,309.4 L426.1,359.3 L444.0,363.0 L466.1,357.4 L500.0,410.2 L491.6,421.3 L489.6,444.3 L488.9,472.3 L473.5,488.6 L480.6,500.8 L471.6,511.8 L488.4,539.4 Z"

# We split this outer path into left, top, top-right, bottom-right.
# Costa should be the left coast and a bit inland.
# Selva is the right edge.
# Sierra is between.
# To make it beautiful, we'll draw smooth interior curves.

costa_points = []
selva_points = []
sierra_points = []

# Instead of complex math, we'll just use a much more simplified and stylized 
# map that is undeniably the shape of Peru. 

# A beautiful stylized Peru made of 3 shapes:
# Left coast line (West) -> Top (Ecuador/Colombia) -> Right (Brazil/Bolivia) -> Bottom (Chile)

# Here's a stylized but geographically accurate set of coordinates for Peru
style_peru = '''
Costa: M10,130 Q30,120 45,110 L240,0 L210,120 Q180,250 130,340 L160,400 Q150,530 200,600 L130,550 L80,450 L5,200 Z
'''

# Wait, it's easier to modify the path directly in react to use a known beautiful Peru SVG.
# The user wants "este cuadro debe de tener la forma del mapa del perú" -> The whole bounding box should look like Peru, or simply use the actual shape of Peru.
