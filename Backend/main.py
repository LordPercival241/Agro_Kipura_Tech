from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import math
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI(title="AgroPredict MVP API", version="1.0.0")

# Permitir CORS para que el Frontend local (HTML) pueda consultar la API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permitir todos los origenes en desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de datos entrante desde el ESP32
class TelemetryData(BaseModel):
    device_id: str
    temperature_c: float
    humidity_air_pct: float
    pressure_pa: float
    soil_m_analog: float
    light_analog: float

# Base de datos en memoria para el MVP (historial de lecturas)
telemetry_history = []

# Tracker de Estado Global para ML
last_reading_time = None
humedad_prolongada_horas = 0.0
grados_dia_acumulados = 0.0
T_BASE = 10.0 # Temperatura base fisiologica usual

# --- MOTOR DE FEATURE ENGINEERING AGRONOMICO ---

def calculate_vpd(temp_c: float, rh_pct: float) -> float:
    """
    Calcula el Déficit de Presión de Vapor (VPD) en kPa.
    VPD = Presion de Vapor de Saturacion (SVP) - Presion de Vapor Actual (AVP)
    """
    # Ecuacion de Tetens/Buck para SVP
    svp = 0.6108 * math.exp((17.27 * temp_c) / (temp_c + 237.3))
    avp = svp * (rh_pct / 100.0)
    vpd = svp - avp
    return vpd

def calculate_dew_point(temp_c: float, rh_pct: float) -> float:
    """
    Calcula el punto de rocío (Dew Point) mediante formula de Magnus.
    Util para saber si habra condensacion (agua libre en hojas = hongos).
    """
    a = 17.27
    b = 237.3
    alpha = ((a * temp_c) / (b + temp_c)) + math.log(max(rh_pct, 0.01) / 100.0)
    dew_point = (b * alpha) / (a - alpha)
    return dew_point

# --- ENDPOINTS ---
import os
import joblib
import pandas as pd

MODEL_PATH = "agropredict_model.pkl"
ml_model = None
if os.path.exists(MODEL_PATH):
    print("Cargando Modelo Predictivo LightGBM...")
    ml_model = joblib.load(MODEL_PATH)
else:
    print("ATENCION: Modelo no encontrado. Módulo experto activo.")

@app.post("/api/v1/telemetry")
async def receive_telemetry(data: TelemetryData):
    # 1. Feature Engineering en tiempo real
    vpd_kpa = calculate_vpd(data.temperature_c, data.humidity_air_pct)
    dew_c = calculate_dew_point(data.temperature_c, data.humidity_air_pct)
    
    # 2. Actualizacion de Trackers de Estado (Stateful features)
    global last_reading_time, humedad_prolongada_horas, grados_dia_acumulados
    
    now = datetime.now()
    delta_hours = 0.0
    
    if last_reading_time is not None:
        delta_hours = (now - last_reading_time).total_seconds() / 3600.0
    
    last_reading_time = now
    
    # Acumular Grados-Dia (se asume que la temperatura fue constante en el DeltaT)
    if data.temperature_c > T_BASE:
        # Sumamos la porcion del dia
        grados_dia_acumulados += (data.temperature_c - T_BASE) * (delta_hours / 24.0)
        
    # Acumular horas de humedad alta (Riesgo Fungi)
    if data.humidity_air_pct > 85.0 and vpd_kpa < 0.4:
        humedad_prolongada_horas += delta_hours
    else:
        humedad_prolongada_horas = 0.0 # Se interrumpe la cadena de alta humedad
        
    # 3. Sistema Predictivo y Evaluacion Experta
    status = "Óptimo"
    alert = "Ninguna"
    risk_level = "Bajo"
    color_code = "#10B981" # Emerald Green
    
    # INFERENCIA DEL MODELO SI EXISTE
    if ml_model is not None:
        try:
            # Replicar las 8 features exactas en el mismo orden que espera el modelo
            features = pd.DataFrame([{
                'temp_c': data.temperature_c,
                'rh_pct': data.humidity_air_pct,
                'pressure_pa': data.pressure_pa,
                'soil_m_analog': data.soil_m_analog,
                'light_analog': data.light_analog,
                'vpd_kpa': vpd_kpa,
                'horas_alta_humedad': humedad_prolongada_horas,
                'grados_dia': grados_dia_acumulados
            }])
            status = ml_model.predict(features)[0]
        except Exception as e:
            print(f"Error en predicción: {e}")
            
    # Mapeo estético post-prediccion
    if "Hídrico" in status:
        alert = "Modificación de riego requerida detectada según lectura capacitiva."
        risk_level = "Alto" if "Severo" in status else "Medio"
        color_code = "#EF4444" if "Severo" in status else "#F59E0B"
    elif "Asfixia" in status:
        alert = "Alerta: Exceso de agua en el suelo u obstrucción de drenaje."
        risk_level = "Alto"
        color_code = "#3b82f6" 
    elif "Fúngica" in status:
        alert = "Alerta: Condiciones prolongadas aptas para condensación y hongos patógenos."
        risk_level = "Alto"
        color_code = "#F59E0B" 
    elif "Plagas" in status:
        alert = "Alerta: Acumulación de Grados-día superó umbral. Riesgo de brote de plagas (Araña Roja/Trips)."
        risk_level = "Alto"
        color_code = "#EF4444" 
    elif "Térmico" in status:
        alert = "Estrés fisiológico crítico. Condición térmica letal."
        risk_level = "Alto"
        color_code = "#EF4444" 

    # 3. Guardar en registro histórico
    record = {
        "timestamp": datetime.now().isoformat(),
        "device_id": data.device_id,
        "raw": data.model_dump(),
        "features": {
            "vpd_kpa": round(vpd_kpa, 2),
            "dew_point_c": round(dew_c, 2)
        },
        "ml": {
            "status": status,
            "alert": alert,
            "risk": risk_level,
            "color": color_code
        }
    }
    
    # Mantenemos las ultimas 100 lecturas en memoria
    telemetry_history.append(record)
    if len(telemetry_history) > 100:
        telemetry_history.pop(0)
        
    print(f"[{record['timestamp']}] ESP32={data.device_id} | Suelo Analog={data.soil_m_analog} | VPD={round(vpd_kpa,2)} | Estado:{status}")
    
    return {"message": "Telemetria recibida correctamente", "prediction": record["ml"]}


@app.get("/api/v1/dashboard")
async def get_dashboard_data():
    """
    Endpoint para el portal Frontend. Devuelve el historial y el ultimo estado.
    """
    if not telemetry_history:
        return {"ready": False, "message": "No hay datos de sensores aun."}
    
    return {
        "ready": True,
        "latest": telemetry_history[-1],
        "history": telemetry_history
    }

@app.get("/")
async def root():
    return {"message": "AgroPredict API is running. The frontend is Next.js and runs separately (e.g. on port 3000)."}

# Nota: El Frontend de Next.js se ejecuta de manera independiente con 'npm run dev'
# app.mount("/", StaticFiles(directory=os.path.join("..", "Frontend")), name="frontend")
