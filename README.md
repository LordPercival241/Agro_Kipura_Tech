#  AgroPredict — Sistema de Monitoreo Agrícola con IoT e Inteligencia Artificial

Sistema de monitoreo de plantas en tiempo real. Combina un dispositivo de medición de campo basado en **ESP32** con una **API de predicción** que utiliza un modelo de **Árbol de Decisión** entrenado con datos recolectados directamente en campo para determinar el estado de salud de la planta.

---

##  Descripción del Sistema

El ESP32 actúa como una **estación meteorológica y agronómica** que mide:
- Temperatura y humedad del aire (DHT22)
- Presión atmosférica (BMP180)
- Humedad del suelo (sensor capacitivo analógico)
- Intensidad lumínica (BH1750)
- Temperatura del suelo (DS18B20)

Los datos se envían vía **WiFi (HTTP POST)** cada 5 segundos a una API local en la PC, que corre el modelo de Árbol de Decisión y retorna el **estado de salud** de la planta.

### Estados que detecta el modelo:
| Estado | Descripción |
|---|---|
| **Óptimo** | La planta se encuentra en condiciones ideales. |
| **Estrés Hídrico Severo** | El suelo está demasiado seco, se requiere riego. |
| **Asfixia Radicular (Suelo Saturado)** | Exceso de agua en el suelo, riesgo de asfixia de raíces. |

---

##  Estructura del Proyecto

```
AgroPredict_MVP/
│
├── Backend/                              # Servidor API Python (FastAPI)
│   ├── main.py                           # API principal — recibe datos y predice
│   ├── Entrenamiento.py                  # Script para entrenar el modelo de IA
│   ├── serial_bridge.py                  # Puente serial alternativo (sin WiFi)
│   ├── requirements.txt                  # Dependencias Python
│   └── dataset_tomada_en_campo_con_el_dispositivo_de_medicion.csv
│
├── ESP32_Node/                           # Firmware del dispositivo (PlatformIO)
│   ├── src/
│   │   └── main.cpp                      # Código principal del ESP32
│   └── platformio.ini                    # Configuración de PlatformIO
│
└── frontend-next2/                       # Panel de control web (Next.js)
    └── src/
```

---

##  Instalación y Uso

### 1. Preparar el Backend (Python)

```bash
cd Backend
pip install -r requirements.txt
```

### 2. Entrenar el Modelo de Árbol de Decisión

```bash
cd Backend
python Entrenamiento.py
```
Esto generará el archivo `agropredict_arbol_decision.pkl` con el modelo entrenado.

### 3. Iniciar la API

```bash
cd Backend
uvicorn main:app --host 0.0.0.0 --port 8000
```
> El parámetro `--host 0.0.0.0` es necesario para que el ESP32 pueda contactar la API desde la red WiFi.

### 4. Conectar el ESP32

1. Encender el ESP32. Este creará automáticamente la red WiFi `Agro_Kipura_Tech`.
2. Conectar la PC a esa red (contraseña: `Agrokipuratech`).
3. Verificar que la PC tenga asignada la IP `192.168.4.2` (la primera en conectarse la obtiene automáticamente).
4. El ESP32 comenzará a enviar lecturas cada 5 segundos.

---

##  Modelo de Inteligencia Artificial

- **Algoritmo:** Árbol de Decisión (`DecisionTreeClassifier` de scikit-learn)
- **Exactitud en conjunto de prueba:** 96.00%
- **Validación cruzada (5 pliegues):** 94.97% ± 0.50%
- **Variable más importante:** Lectura analógica del sensor de suelo (`soil_analog`) con 84.37% de importancia.
- **Dataset:** 3,000 muestras recolectadas en campo con el dispositivo de medición.

---

##  Endpoints de la API

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/v1/telemetry` | Recibe datos del ESP32 y retorna la predicción. |
| `GET` | `/api/v1/dashboard` | Retorna el historial y el último estado registrado. |
| `GET` | `/api/v1/exportar` | Descarga el historial completo en formato CSV. |
| `GET` | `/docs` | Documentación interactiva de la API (Swagger UI). |

---

##  Tecnologías Utilizadas

| Componente | Tecnología |
|---|---|
| Firmware IoT | C++ / Arduino (PlatformIO) |
| API Backend | Python, FastAPI, Uvicorn |
| Modelo de IA | scikit-learn (DecisionTreeClassifier) |
| Comunicación | WiFi / HTTP sobre TCP/IP |
| Frontend | Next.js / React |

---

##  Equipo

Proyecto desarrollado para los cursos Introducción a python y Energía Solar.
