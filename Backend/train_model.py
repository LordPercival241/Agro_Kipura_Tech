import pandas as pd
import numpy as np
import math
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

print("Generando Dataset Agronómico Sintético para MVP...")

# Configuracion de la simulacion
NUM_MUESTRAS = 10000
np.random.seed(42)

# ----- GENERACION DE DATOS SINTETICOS EXPERTOS -----

# Variables generadas aleatoriamente pero con rangos realistas (alineadas a hardware real ESP32)
temperatura = np.random.uniform(10.0, 45.0, NUM_MUESTRAS)
humedad_relativa = np.random.uniform(20.0, 99.0, NUM_MUESTRAS)
# Nivel de humedad del suelo Analógico (0-4095): > 3000 es Seco, < 1500 es Muy Húmedo
soil_m_analog = np.random.uniform(100.0, 4000.0, NUM_MUESTRAS)
# LDR Analógico (0-4095): < 1000 Mucha Luz (Resistencia baja al pegar sol), > 3500 Poca Luz
light_analog = np.random.uniform(100.0, 4000.0, NUM_MUESTRAS)
# Presión atmosférica en Pascales BMP180
pressure_pa = np.random.uniform(98000.0, 102000.0, NUM_MUESTRAS)

# Feature Engineering
def cal_vpd(t, rh):
    svp = 0.6108 * np.exp((17.27 * t) / (t + 237.3))
    avp = svp * (rh / 100.0)
    return svp - avp

vpd = cal_vpd(temperatura, humedad_relativa)
# Simulamos "Horas_VPD_Bajo" y "Grados_Dia_Acumulados" como contexto del modelo
horas_alta_humedad = np.where((humedad_relativa > 85) & (vpd < 0.4), np.random.uniform(5, 48, NUM_MUESTRAS), np.random.uniform(0, 4, NUM_MUESTRAS))
grados_dia = np.where(temperatura > 25, np.random.uniform(100, 500, NUM_MUESTRAS), np.random.uniform(10, 90, NUM_MUESTRAS))

df = pd.DataFrame({
    'temp_c': temperatura,
    'rh_pct': humedad_relativa,
    'pressure_pa': pressure_pa,
    'soil_m_analog': soil_m_analog,
    'light_analog': light_analog,
    'vpd_kpa': vpd,
    'horas_alta_humedad': horas_alta_humedad, # Factor epidemiologico B
    'grados_dia': grados_dia # Factor fenologia de plagas C
})

# Asignacion de Etiquetas Base (Estado Sanitario)
labels = []
for i in range(NUM_MUESTRAS):
    s = df.iloc[i]
    # Jerarquia de Riesgos Adaptada a Valores Analógicos
    if s['soil_m_analog'] > 3000.0 and s['vpd_kpa'] > 1.5: # Valores analógicos altos indican menos humedad capacitiva
        labels.append("Estrés Hídrico Severo")
    elif s['soil_m_analog'] > 2500.0:
        labels.append("Estrés Hídrico Leve")
    elif s['soil_m_analog'] < 1000.0 and s['rh_pct'] > 85:
         labels.append("Asfixia Radicular (Suelo Saturado)")
    elif s['horas_alta_humedad'] > 12.0 and s['temp_c'] > 15 and s['temp_c'] < 25:
        labels.append("Alerta Fúngica (Botrytis/Mildiu)")
    elif s['grados_dia'] > 400 and s['temp_c'] > 28 and s['rh_pct'] < 50:
        labels.append("Alerta Plagas (Araña Roja/Trips)")
    elif s['temp_c'] > 35.0:
        labels.append("Estrés Térmico (Golpe Calor)")
    elif s['temp_c'] < 12.0:
        labels.append("Estrés Térmico (Helada Inminente)")
    else:
        labels.append("Óptimo")

df['status_label'] = labels

print("\nBalance de Etiquetas Generadas:")
print(df['status_label'].value_counts())

# ----- ENTRENAMIENTO DEL MODELO -----
print("\nEntrenando Modelo HistGradientBoostingClassifier (Equivalente LightGBM)...")

X = df[['temp_c', 'rh_pct', 'pressure_pa', 'soil_m_analog', 'light_analog', 'vpd_kpa', 'horas_alta_humedad', 'grados_dia']]
y = df['status_label']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = HistGradientBoostingClassifier(max_iter=100, learning_rate=0.1, max_leaf_nodes=31, random_state=42)
model.fit(X_train, y_train)

# ----- VALIDACION -----
print("\nValidando Modelo:")
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# ----- EXPORTACION -----
EXPORT_PATH = 'agropredict_model.pkl'
joblib.dump(model, EXPORT_PATH)
print(f"Modelo exportado correctamente a {EXPORT_PATH}")
