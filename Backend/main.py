"""
API Principal de AgroPredict
============================
Servidor FastAPI que recibe telemetría del dispositivo ESP32 vía WiFi,
ejecuta la inferencia con el modelo de Árbol de Decisión entrenado y
devuelve el estado de salud de la planta en tiempo real.

Endpoints disponibles:
  POST /api/v1/telemetria  → Recibe datos del ESP32 y retorna predicción.
  GET  /api/v1/dashboard   → Retorna el historial y el último estado.
  GET  /api/v1/exportar    → Descarga el historial completo en CSV.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import math
import os
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

# ─────────────────────────────────────────────────────────────
# INICIALIZACIÓN DE LA APLICACIÓN
# ─────────────────────────────────────────────────────────────
app = FastAPI(
    title="AgroPredict API",
    version="1.0.0",
    description="API de predicción del estado de plantas agrícolas mediante sensores IoT y un modelo de Árbol de Decisión."
)

# Habilitar CORS para que el frontend pueda consultar la API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────
# MODELO DE DATOS ENTRANTE DESDE EL ESP32
# ─────────────────────────────────────────────────────────────
class TelemetriaEntrada(BaseModel):
    device_id: str
    temperature_c: float
    humidity_air_pct: float
    pressure_pa: float
    soil_m_analog: float
    light_analog: float
    soil_temp_c: Optional[float] = None  # Sensor DS18B20 (opcional si no está conectado)

# ─────────────────────────────────────────────────────────────
# VARIABLES GLOBALES
# ─────────────────────────────────────────────────────────────
historial_telemetria = []   # Historial en memoria (últimas 100 lecturas)
ARCHIVO_CSV = "telemetry_log.csv"

# ─────────────────────────────────────────────────────────────
# CARGA DEL MODELO DE ÁRBOL DE DECISIÓN
# ─────────────────────────────────────────────────────────────
RUTA_MODELO = "agropredict_arbol_decision.pkl"
modelo_ml = None

if os.path.exists(RUTA_MODELO):
    print("Cargando Modelo Predictivo: Árbol de Decisión...")
    modelo_ml = joblib.load(RUTA_MODELO)
    print("✅ Modelo cargado correctamente.")
else:
    print("⚠️  ATENCIÓN: Modelo no encontrado. Ejecuta 'Entrenamiento.py' para generarlo.")

# ─────────────────────────────────────────────────────────────
# FUNCIONES AUXILIARES
# ─────────────────────────────────────────────────────────────
def calcular_vpd(temp_c: float, hum_pct: float) -> float:
    """
    Calcula el Déficit de Presión de Vapor (VPD) en kPa.
    Fórmula de Tetens/Buck: VPD = SVP - AVP
    """
    svp = 0.6108 * math.exp((17.27 * temp_c) / (temp_c + 237.3))
    avp = svp * (hum_pct / 100.0)
    return svp - avp

def calcular_punto_rocio(temp_c: float, hum_pct: float) -> float:
    """
    Calcula el punto de rocío (°C) mediante la fórmula de Magnus.
    Útil para detectar riesgo de condensación y enfermedades fúngicas.
    """
    a, b = 17.27, 237.3
    alpha = ((a * temp_c) / (b + temp_c)) + math.log(max(hum_pct, 0.01) / 100.0)
    return (b * alpha) / (a - alpha)

def guardar_en_csv(registro: dict):
    """Guarda cada lectura recibida en un archivo CSV para persistencia histórica."""
    try:
        archivo_existe = os.path.isfile(ARCHIVO_CSV)
        fila = {
            "timestamp":    registro["timestamp"],
            "device_id":    registro["device_id"],
            "temp_c":       registro["raw"]["temperature_c"],
            "hum_air_pct":  registro["raw"]["humidity_air_pct"],
            "press_pa":     registro["raw"]["pressure_pa"],
            "soil_analog":  registro["raw"]["soil_m_analog"],
            "light_analog": registro["raw"]["light_analog"],
            "temp_suelo":   registro["raw"].get("soil_temp_c"),
            "vpd_kpa":      registro["features"]["vpd_kpa"],
            "punto_rocio_c":registro["features"]["dew_point_c"],
            "estado_ml":    registro["ml"]["status"],
            "nivel_riesgo": registro["ml"]["risk"],
        }
        df = pd.DataFrame([fila])
        df.to_csv(ARCHIVO_CSV, mode='a', index=False, header=not archivo_existe, encoding='utf-8')
    except Exception as e:
        print(f"Error al guardar en CSV: {e}")

# ─────────────────────────────────────────────────────────────
# ENDPOINTS DE LA API
# ─────────────────────────────────────────────────────────────

@app.post("/api/v1/telemetry")
async def recibir_telemetria(datos: TelemetriaEntrada):
    """
    Recibe los datos del ESP32, ejecuta la predicción del Árbol de Decisión
    y retorna el estado de salud de la planta.
    """
    # 1. Calcular métricas agronómicas derivadas
    vpd_kpa  = calcular_vpd(datos.temperature_c, datos.humidity_air_pct)
    rocio_c  = calcular_punto_rocio(datos.temperature_c, datos.humidity_air_pct)

    # 2. Inferencia con el modelo de Árbol de Decisión
    estado      = "Óptimo"
    alerta      = "Sin alertas activas."
    nivel_riesgo = "Bajo"
    color_hex   = "#10B981"  # Verde esmeralda

    if modelo_ml is not None:
        try:
            # Las 6 variables deben estar en el mismo orden que durante el entrenamiento
            entrada = pd.DataFrame([{
                "temp_c":       datos.temperature_c,
                "hum_air_pct":  datos.humidity_air_pct,
                "press_pa":     datos.pressure_pa,
                "soil_analog":  datos.soil_m_analog,
                "light_analog": datos.light_analog,
                "temp_suelo":   datos.soil_temp_c if datos.soil_temp_c is not None else 23.0,
            }])
            estado = modelo_ml.predict(entrada)[0]
        except Exception as e:
            print(f"Error durante la predicción del modelo: {e}")

    # 3. Definir alerta y nivel de riesgo según el estado predicho
    if "Hídrico" in estado:
        alerta      = "Modificación de riego requerida según la lectura del sensor capacitivo."
        nivel_riesgo = "Alto" if "Severo" in estado else "Medio"
        color_hex   = "#EF4444" if "Severo" in estado else "#F59E0B"
    elif "Asfixia" in estado:
        alerta      = "Exceso de agua en el suelo u obstrucción en el sistema de drenaje."
        nivel_riesgo = "Alto"
        color_hex   = "#3B82F6"

    # 4. Construir y guardar el registro completo
    # Nota: las claves 'features' y 'ml' se mantienen para compatibilidad con el frontend.
    registro = {
        "timestamp":  datetime.now().isoformat(),
        "device_id":  datos.device_id,
        "raw":        datos.model_dump(),
        "features": {
            "vpd_kpa":       round(vpd_kpa, 3),
            "dew_point_c":   round(rocio_c, 2),
        },
        "ml": {
            "status": estado,
            "alert":  alerta,
            "risk":   nivel_riesgo,
            "color":  color_hex,
        },
    }

    historial_telemetria.append(registro)
    if len(historial_telemetria) > 100:
        historial_telemetria.pop(0)

    guardar_en_csv(registro)

    print(f"[{registro['timestamp']}] Dispositivo={datos.device_id} | "
          f"Suelo Analog={datos.soil_m_analog} | VPD={round(vpd_kpa, 2)} kPa | "
          f"Estado: {estado}")

    return {"mensaje": "Telemetría recibida correctamente.", "prediccion": registro["ml"]}


@app.get("/api/v1/dashboard")
async def obtener_dashboard():
    """
    Retorna el historial de lecturas y el último estado registrado.
    Consultado periódicamente por el frontend para actualizar el panel en tiempo real.
    """
    if not historial_telemetria:
        return {"ready": False, "message": "Aún no se han recibido datos del dispositivo."}

    return {
        "ready":   True,
        "latest":  historial_telemetria[-1],
        "history": historial_telemetria,
    }


@app.get("/api/v1/exportar")
async def exportar_csv():
    """Descarga el historial completo de telemetría en formato CSV."""
    if not os.path.exists(ARCHIVO_CSV):
        raise HTTPException(status_code=404, detail="No hay registros históricos disponibles aún.")

    nombre_archivo = f"agropredict_historial_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    return FileResponse(path=ARCHIVO_CSV, filename=nombre_archivo, media_type="text/csv")


@app.get("/")
async def raiz():
    """Endpoint raíz para verificar que la API está en línea."""
    return {"mensaje": "AgroPredict API activa. Accede a /docs para ver la documentación interactiva."}
