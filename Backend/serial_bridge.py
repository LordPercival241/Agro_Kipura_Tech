import serial
import time
import requests
import re
import argparse
import sys

# URL de la API local
API_URL = "http://127.0.0.1:8000/api/v1/telemetry"

def main():
    parser = argparse.ArgumentParser(description="Puente Serial a API para AgroPredict MVP")
    parser.add_argument("port", help="Puerto Serial (ej. COM3 o /dev/ttyUSB0)")
    parser.add_argument("--baudrate", type=int, default=115200, help="Velocidad en baudios")
    args = parser.parse_args()

    try:
        ser = serial.Serial(args.port, args.baudrate, timeout=1)
        print(f"✅ Conectado a {args.port} a {args.baudrate} baudios.")
    except Exception as e:
        print(f"❌ Error al conectar al puerto serial: {e}")
        sys.exit(1)

    print("Esperando datos de telemetría del ESP32...")
    
    # Payload buffer
    payload = {
        "device_id": "ESP32_AGRO_01",
        "temperature_c": None,
        "humidity_air_pct": None,
        "pressure_pa": None,
        "soil_m_analog": None,
        "light_analog": None
    }
    
    # Expresiones regulares para extraer los datos
    regex_luz = re.compile(r"Luz \(LDR\):\s+(\d+)")
    regex_suelo = re.compile(r"Humedad Suelo:\s+(\d+)")
    regex_hum_aire = re.compile(r"Humedad Aire:\s+(\d+\.?\d*)")
    regex_temp = re.compile(r"Temperatura:\s+(\d+\.?\d*)")
    regex_presion = re.compile(r"Presión:\s+(\d+)")

    while True:
        try:
            line = ser.readline().decode('utf-8', errors='ignore').strip()
            if not line:
                continue
                
            print(f"> {line}")
            
            # Parsear variables
            m_luz = regex_luz.search(line)
            if m_luz: payload["light_analog"] = float(m_luz.group(1))
            
            m_suelo = regex_suelo.search(line)
            if m_suelo: payload["soil_m_analog"] = float(m_suelo.group(1))
                
            m_hum = regex_hum_aire.search(line)
            if m_hum: payload["humidity_air_pct"] = float(m_hum.group(1))
                
            m_temp = regex_temp.search(line)
            if m_temp: payload["temperature_c"] = float(m_temp.group(1))
                
            m_presion = regex_presion.search(line)
            if m_presion: payload["pressure_pa"] = float(m_presion.group(1))
                
            # Verificar si tenemos un bloque completo
            if line == "----------------------------------":
                # Validar payload minimo (puede que presion falte si no hay BMP180)
                if None not in [payload["light_analog"], payload["soil_m_analog"], payload["humidity_air_pct"], payload["temperature_c"]]:
                    # Default de presion si no se encontro
                    if payload["pressure_pa"] is None:
                        payload["pressure_pa"] = 101325.0
                    
                    try:
                        print(f"Enviando API: {payload}")
                        resp = requests.post(API_URL, json=payload, timeout=2)
                        if resp.status_code == 200:
                            print(f"✓ AI Predicción: {resp.json().get('prediction', {}).get('status', 'OK')}")
                        else:
                            print(f"⚠ API Error: HTTP {resp.status_code}")
                    except Exception as req_err:
                        print(f"⚠ Error de red al contactar API: {req_err}")
                
                # Reset payload buffer (mantenemos el device_id)
                payload = {
                    "device_id": "ESP32_AGRO_01",
                    "temperature_c": None,
                    "humidity_air_pct": None,
                    "pressure_pa": None,
                    "soil_m_analog": None,
                    "light_analog": None
                }
                
        except KeyboardInterrupt:
            print("\n❌ Terminando puente serial.")
            ser.close()
            break
        except Exception as e:
            print(f"Error inesperado: {e}")
            time.sleep(1)

if __name__ == "__main__":
    main()
