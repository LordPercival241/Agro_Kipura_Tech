"""
Script de Entrenamiento - Árbol de Decisión para AgroPredict
=============================================================
Entrena un modelo de Árbol de Decisión (DecisionTreeClassifier) para
clasificar el estado de salud de una planta a partir de las lecturas
crudas del dispositivo de medición de campo.

Estados que clasifica el modelo:
  1. Estrés Hídrico Severo         → Suelo demasiado seco, falta de riego.
  2. Asfixia Radicular (Saturado)  → Suelo anegado, exceso de agua.
  3. Óptimo                        → Condiciones ideales para la planta.

Variables de entrada (6 sensores):
  - temp_c        : Temperatura ambiente en °C (DHT22)
  - hum_air_pct   : Humedad relativa del aire en % (DHT22)
  - press_pa      : Presión atmosférica en Pa (BMP180)
  - soil_analog   : Lectura analógica del sensor capacitivo de suelo
  - light_analog  : Lectura analógica del sensor de luz (BH1750 simulado)
  - temp_suelo    : Temperatura del suelo en °C (DS18B20)

Archivo exportado: 'agropredict_arbol_decision.pkl'
"""

import os
import pandas as pd
import joblib
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# ─────────────────────────────────────────────────────────────
# 1. CARGA DEL DATASET
# ─────────────────────────────────────────────────────────────
DIRECTORIO_SCRIPT = os.path.dirname(os.path.abspath(__file__))
RUTA_CSV = os.path.join(DIRECTORIO_SCRIPT, "dataset_tomada_en_campo_con_el_dispositivo_de_medicion.csv")

print("=" * 65)
print("  ENTRENAMIENTO - ARBOL DE DECISION - AGROPREDICT")
print("=" * 65)

df = pd.read_csv(RUTA_CSV)
print(f"\nDataset cargado: {df.shape[0]} filas, {df.shape[1]} columnas")
print(f"Columnas: {list(df.columns)}")

# ─────────────────────────────────────────────────────────────
# 2. EXPLORACIÓN Y VALIDACIÓN DEL DATASET
# ─────────────────────────────────────────────────────────────
print("\nDistribucion de estados (variable objetivo):")
conteo = df["estado"].value_counts()
for estado, n in conteo.items():
    print(f"  - {estado}: {n} muestras ({n / len(df) * 100:.1f}%)")

valores_nulos = df.isnull().sum().sum()
print(f"\nValores nulos totales: {valores_nulos}")
if valores_nulos > 0:
    print("  Eliminando filas con valores nulos...")
    df = df.dropna()
    print(f"  Dataset limpio: {df.shape[0]} filas")

# ─────────────────────────────────────────────────────────────
# 3. DEFINICIÓN DE VARIABLES DE ENTRADA Y OBJETIVO
# ─────────────────────────────────────────────────────────────
VARIABLES_ENTRADA = ["temp_c", "hum_air_pct", "press_pa", "soil_analog", "light_analog", "temp_suelo"]

X = df[VARIABLES_ENTRADA]
y = df["estado"]

print(f"\nVariables de entrada ({len(VARIABLES_ENTRADA)}):")
for variable in VARIABLES_ENTRADA:
    print(f"  - {variable}: min={X[variable].min():.1f}, max={X[variable].max():.1f}, media={X[variable].mean():.1f}")

# ─────────────────────────────────────────────────────────────
# 4. DIVISIÓN EN CONJUNTO DE ENTRENAMIENTO Y PRUEBA
# ─────────────────────────────────────────────────────────────
X_entren, X_prueba, y_entren, y_prueba = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y  # Mantener proporción de clases en ambos conjuntos
)

print(f"\nDivision del dataset:")
print(f"  - Entrenamiento: {X_entren.shape[0]} muestras (80%)")
print(f"  - Prueba:        {X_prueba.shape[0]} muestras (20%)")

# ─────────────────────────────────────────────────────────────
# 5. ENTRENAMIENTO DEL ÁRBOL DE DECISIÓN
# ─────────────────────────────────────────────────────────────
print("\nEntrenando Arbol de Decision...")

modelo = DecisionTreeClassifier(
    criterion="gini",       # Criterio de impureza para las divisiones
    max_depth=10,           # Profundidad máxima para evitar sobreajuste
    min_samples_split=5,    # Mínimo de muestras para dividir un nodo
    min_samples_leaf=3,     # Mínimo de muestras permitidas en una hoja
    class_weight="balanced",# Compensar clases desbalanceadas automáticamente
    random_state=42
)

modelo.fit(X_entren, y_entren)
print("  Modelo entrenado exitosamente.")

# ─────────────────────────────────────────────────────────────
# 6. EVALUACIÓN DEL MODELO
# ─────────────────────────────────────────────────────────────
y_predicho = modelo.predict(X_prueba)
exactitud  = accuracy_score(y_prueba, y_predicho)

print(f"\nResultados de Evaluacion:")
print(f"  Exactitud global: {exactitud * 100:.2f}%")

print(f"\nReporte por clase:")
print("-" * 65)
print(classification_report(y_prueba, y_predicho))

print("Matriz de Confusion:")
print("-" * 65)
etiquetas      = sorted(y.unique())
matriz         = confusion_matrix(y_prueba, y_predicho, labels=etiquetas)
largo_max      = max(len(e) for e in etiquetas)
encabezado     = " " * (largo_max + 4) + "  ".join([f"{e[:12]:>12}" for e in etiquetas])
print(f"  {encabezado}")
for i, etiqueta in enumerate(etiquetas):
    fila = "  ".join([f"{v:>12}" for v in matriz[i]])
    print(f"  {etiqueta:>{largo_max}}  {fila}")

# ─────────────────────────────────────────────────────────────
# 7. VALIDACIÓN CRUZADA (5 PLIEGUES)
# ─────────────────────────────────────────────────────────────
print(f"\nValidacion Cruzada (5 pliegues):")
puntajes_cv = cross_val_score(modelo, X, y, cv=5, scoring="accuracy")
print(f"  Puntajes: {[f'{s:.4f}' for s in puntajes_cv]}")
print(f"  Media:    {puntajes_cv.mean():.4f} +/- {puntajes_cv.std():.4f}")

# ─────────────────────────────────────────────────────────────
# 8. IMPORTANCIA DE LAS VARIABLES
# ─────────────────────────────────────────────────────────────
print(f"\nImportancia de cada variable de entrada:")
importancias = modelo.feature_importances_
for var, imp in sorted(zip(VARIABLES_ENTRADA, importancias), key=lambda x: x[1], reverse=True):
    barra = "█" * int(imp * 40)
    print(f"  {var:>15}: {imp:.4f}  {barra}")

# ─────────────────────────────────────────────────────────────
# 9. INFORMACIÓN DE LA ESTRUCTURA DEL ÁRBOL
# ─────────────────────────────────────────────────────────────
print(f"\nEstructura del Arbol entrenado:")
print(f"  Profundidad real: {modelo.get_depth()}")
print(f"  Numero de hojas:  {modelo.get_n_leaves()}")
print(f"  Clases del modelo: {list(modelo.classes_)}")

# ─────────────────────────────────────────────────────────────
# 10. EXPORTAR MODELO Y METADATOS
# ─────────────────────────────────────────────────────────────
RUTA_MODELO    = os.path.join(DIRECTORIO_SCRIPT, "agropredict_arbol_decision.pkl")
RUTA_METADATOS = os.path.join(DIRECTORIO_SCRIPT, "modelo_metadata.pkl")

joblib.dump(modelo, RUTA_MODELO)
print(f"\nModelo guardado en: {RUTA_MODELO}")

metadatos = {
    "modelo":                 "DecisionTreeClassifier",
    "variables_entrada":      VARIABLES_ENTRADA,
    "clases":                 list(modelo.classes_),
    "exactitud":              exactitud,
    "cv_media":               puntajes_cv.mean(),
    "cv_desviacion":          puntajes_cv.std(),
    "profundidad":            modelo.get_depth(),
    "numero_hojas":           modelo.get_n_leaves(),
    "muestras_entrenamiento": X_entren.shape[0],
    "muestras_prueba":        X_prueba.shape[0],
}
joblib.dump(metadatos, RUTA_METADATOS)
print(f"Metadatos guardados en: {RUTA_METADATOS}")

# ─────────────────────────────────────────────────────────────
# 11. PRUEBA RÁPIDA DE PREDICCIÓN CON EJEMPLOS
# ─────────────────────────────────────────────────────────────
print(f"\nPrueba rapida con 3 muestras de ejemplo:")

ejemplos = [
    {"nombre": "Suelo seco (Estres Hidrico)",     "datos": [24.5, 67.0, 99740, 1950, 12500, 23.5]},
    {"nombre": "Suelo saturado (Asfixia)",         "datos": [24.0, 66.0, 99775,  200,  6500, 24.0]},
    {"nombre": "Condicion Optima",                 "datos": [23.5, 67.0, 99770,  400,  6200, 24.5]},
]

for ejemplo in ejemplos:
    df_ejemplo = pd.DataFrame([ejemplo["datos"]], columns=VARIABLES_ENTRADA)
    prediccion = modelo.predict(df_ejemplo)[0]
    print(f"  {ejemplo['nombre']:>35} -> Prediccion: {prediccion}")

print(f"\n{'=' * 65}")
print("  ENTRENAMIENTO COMPLETADO EXITOSAMENTE")
print(f"{'=' * 65}")
