"""
Puente Serial a API - AgroPredict
==================================
Script alternativo para casos donde el ESP32 NO está conectado a la misma
red WiFi que la PC. En ese escenario, el ESP32 envía los datos por el cable
USB (puerto serial) y este script los lee, los parsea y los reenvía a la
API de AgroPredict que corre localmente.

Modo de uso:
  python serial_bridge.py COM3
  python serial_bridge.py COM3 --baudrate 115200

Nota: Para el modo normal de operación (WiFi Access Point), este script
no es necesario. El ESP32 envía los datos directamente a la API vía HTTP.
"""

import serial
import time
import requests
import re
import argparse
import sys

# Dirección de la API local
URL_API = "http://127.0.0.1:8000/api/v1/telemetry"


def main():
    parser = argparse.ArgumentParser(description="Puente Serial a API para AgroPredict")
    parser.add_argument("puerto",       help="Puerto serial del ESP32 (ej. COM3 o /dev/ttyUSB0)")
    parser.add_argument("--baudrate",   type=int, default=115200, help="Velocidad en baudios (por defecto: 115200)")
    args = parser.parse_args()

    try:
        ser = serial.Serial(args.puerto, args.baudrate, timeout=1)
        print(f"Conectado a {args.puerto} a {args.baudrate} baudios.")
    except Exception as e:
        print(f"Error al abrir el puerto serial: {e}")
        sys.exit(1)

    print("Esperando datos del ESP32 por el puerto serial...")

    # Buffer del paquete de datos
    paquete = {
        "device_id":        "ESP32_AGRO_ZONA_1",
        "temperature_c":    None,
        "humidity_air_pct": None,
        "pressure_pa":      None,
        "soil_m_analog":    None,
        "light_analog":     None,
    }

    # Expresiones regulares para parsear cada línea del monitor serial
    re_temperatura = re.compile(r"Temperatura:\s+(\d+\.?\d*)")
    re_humedad_aire = re.compile(r"Humedad Aire:\s+(\d+\.?\d*)")
    re_presion      = re.compile(r"Presión:\s+(\d+)")
    re_suelo        = re.compile(r"Humedad Suelo:\s+(\d+)")
    re_luz          = re.compile(r"Luz \(LDR\):\s+(\d+)")

    while True:
        try:
            linea = ser.readline().decode("utf-8", errors="ignore").strip()
            if not linea:
                continue

            print(f"> {linea}")

            # Extraer valores de cada línea
            m = re_temperatura.search(linea)
            if m: paquete["temperature_c"] = float(m.group(1))

            m = re_humedad_aire.search(linea)
            if m: paquete["humidity_air_pct"] = float(m.group(1))

            m = re_presion.search(linea)
            if m: paquete["pressure_pa"] = float(m.group(1))

            m = re_suelo.search(linea)
            if m: paquete["soil_m_analog"] = float(m.group(1))

            m = re_luz.search(linea)
            if m: paquete["light_analog"] = float(m.group(1))

            # El separador "----------------------------------" indica el fin de un ciclo de lectura
            if linea == "----------------------------------":
                campos_minimos = ["temperature_c", "humidity_air_pct", "soil_m_analog", "light_analog"]
                if all(paquete[c] is not None for c in campos_minimos):
                    # Si no se detectó presión (BMP180 desconectado), usar valor estándar
                    if paquete["pressure_pa"] is None:
                        paquete["pressure_pa"] = 101325.0

                    try:
                        print(f"Enviando a la API: {paquete}")
                        respuesta = requests.post(URL_API, json=paquete, timeout=2)
                        if respuesta.status_code == 200:
                            prediccion = respuesta.json().get("prediccion", {}).get("estado", "OK")
                            print(f"Prediccion del modelo: {prediccion}")
                        else:
                            print(f"Error de la API: HTTP {respuesta.status_code}")
                    except Exception as e:
                        print(f"Error de red al contactar la API: {e}")

                # Reiniciar el buffer para el siguiente ciclo
                paquete = {
                    "device_id":        "ESP32_AGRO_ZONA_1",
                    "temperature_c":    None,
                    "humidity_air_pct": None,
                    "pressure_pa":      None,
                    "soil_m_analog":    None,
                    "light_analog":     None,
                }

        except KeyboardInterrupt:
            print("\nPuente serial detenido por el usuario.")
            ser.close()
            break
        except Exception as e:
            print(f"Error inesperado: {e}")
            time.sleep(1)


if __name__ == "__main__":
    main()
