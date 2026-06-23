#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP085.h>
#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <BH1750.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// --- Configuración PIN 34: Humedad de Suelo v1.2 (Analógico) ---
const int SUELO_HUM_PIN = 34;
const int VALOR_SECO = 3200;    // ¡Ajusta este valor con tu sensor al aire!
const int VALOR_HUMEDO = 1300;  // ¡Ajusta este valor con tu sensor en agua!
const int NUM_MUESTRAS = 15;    // Muestras para el filtro de promedio

// --- Configuración PIN 23: DHT22 (Digital) ---
#define DHTPIN 23     
#define DHTTYPE DHT22   
DHT dht(DHTPIN, DHTTYPE);

// --- Configuración PIN 4: DS18B20 Temp Suelo (OneWire) ---
const int DS18B20_PIN = 4;
OneWire oneWire(DS18B20_PIN);
DallasTemperature ds18b20(&oneWire);

// --- Configuración I2C (Pines 21 y 22): BMP180 y BH1750 ---
Adafruit_BMP085 bmp180;
BH1750 lightMeter;

// --- Red WiFi (Modo Access Point) ---
const char* ssid = "Agro_Kipura_Tech";             
const char* password = "Agrokipuratech"; // Minimo 8 caracteres    

// La laptop se conectara a esta red y forzaremos que sea 192.168.4.2 siempre.
// El ESP32 por defecto es 192.168.4.1
const char* api_url = "http://192.168.4.2:8000/api/v1/telemetry"; 
const String device_id = "ESP32_AGRO_ZONA_1";

// --- Configuracion AP Estatica ---
IPAddress local_ip(192,168,4,1);
IPAddress gateway(192,168,4,1);
IPAddress subnet(255,255,255,0);

unsigned long lastMsg = 0;
const long interval = 5000; // 5 segundos para MVP
bool bmpConectado = false;
bool bh1750Conectado = false;

void setupWiFi() {
    delay(10);
    Serial.println();
    Serial.print("Iniciando MODO ACCESS POINT: ");
    Serial.println(ssid);

    // Forzar IP Estatica para que NUNCA cambie al cambiar de ubicacion
    WiFi.softAPConfig(local_ip, gateway, subnet);
    // Configurar el ESP32 como un Router Wi-Fi
    WiFi.softAP(ssid, password);

    Serial.println("");
    Serial.println("Red Wi-Fi Creada Exitosamente!");
    Serial.print("Direccion IP del ESP32 (Servidor): ");
    Serial.println(WiFi.softAPIP());
    Serial.println("ESPERANDO QUE LA LAPTOP SE CONECTE...");
}

void sendDataToServer(float temp, float hum, float pres, float soil_analog, float light_analog, float soil_temp) {
    HTTPClient http;
    http.begin(api_url);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<384> doc;
    doc["device_id"] = device_id;
    doc["temperature_c"] = temp;
    doc["humidity_air_pct"] = hum;
    doc["pressure_pa"] = pres;
    doc["soil_m_analog"] = soil_analog;
    doc["light_analog"] = light_analog;
    if (soil_temp != DEVICE_DISCONNECTED_C) {
        doc["soil_temp_c"] = soil_temp;
    }

    String requestBody;
    serializeJson(doc, requestBody);

    Serial.println("-> Enviando datos a Backend...");
    int httpResponseCode = http.POST(requestBody);

    if(httpResponseCode > 0) {
        String response = http.getString();
        Serial.print("<- Respuesta del Servidor (HTTP ");
        Serial.print(httpResponseCode);
        Serial.println("): ");
        Serial.println(response); 
    } else {
        Serial.print("[ERROR] Fallo enviar HTTP POST a la laptop. Codigo: ");
        Serial.println(httpResponseCode);
    }
    http.end();
}

void setup() {
    Serial.begin(115200);
    delay(1500);
    
    Serial.println(F("\n=================================================="));
    Serial.println(F("    INICIANDO MASTER SCRIPT - 5 SENSORES ESP32     "));
    Serial.println(F("==================================================\n"));

    // 1. Configurar Resolucion Analogica para el ESP32 (12 bits: 0 - 4095)
    analogReadResolution(12);

    // 2. Inicializar Bus I2C
    Wire.begin();
    
    // 3. Inicializar BMP180
    if (bmp180.begin()) {
        Serial.println(F("✔️ BMP180 (Presión/Altitud) OK"));
        bmpConectado = true;
    } else {
        Serial.println(F("❌ BMP180 NO detectado. Revisa los cables I2C."));
        bmpConectado = false;
    }

    // 4. Inicializar BH1750
    if (lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE)) {
        Serial.println(F("✔️ BH1750 (Luz) OK"));
        bh1750Conectado = true;
    } else {
        Serial.println(F("❌ BH1750 NO detectado. Revisa los cables I2C."));
        bh1750Conectado = false;
    }

    // 5. Inicializar DHT22
    dht.begin();
    Serial.println(F("✔️ DHT22 (Ambiente) Inicializado"));

    // 6. Inicializar DS18B20
    ds18b20.begin();
    Serial.print(F("✔️ DS18B20 (Suelo Temp) Inicializado. Sensores en línea: "));
    Serial.println(ds18b20.getDeviceCount());

    Serial.println(F("\n----------------------------------"));
    
    // Iniciar WiFi Access Point
    setupWiFi();
}

void loop() {
    unsigned long now = millis();
    if (now - lastMsg > interval) {
        lastMsg = now;

        // 1. Lecturas de Humedad de Suelo Capacitivo v1.2 (Promedio de NUM_MUESTRAS)
        long sumaRaw = 0;
        for (int i = 0; i < NUM_MUESTRAS; i++) {
            sumaRaw += analogRead(SUELO_HUM_PIN);
            delay(10);
        }
        int valorRawPromedio = sumaRaw / NUM_MUESTRAS;
        int porcHumedadSuelo = map(valorRawPromedio, VALOR_SECO, VALOR_HUMEDO, 0, 100);
        porcHumedadSuelo = constrain(porcHumedadSuelo, 0, 100);

        // 2. Lecturas del Aire / Ambiente (DHT22 y BMP180)
        float dhtHum = dht.readHumidity();
        float dhtTemp = dht.readTemperature();
        
        float bmpTemp = 0.0;
        float presion = 101325.0; // Presión estándar por defecto
        
        if (bmpConectado) {
            presion = bmp180.readPressure();
            bmpTemp = bmp180.readTemperature();
        }

        // Selección de temperatura/humedad con fallback
        float temp_ambiente = 0.0;
        float hum_ambiente = 0.0;
        
        if (!isnan(dhtTemp)) {
            temp_ambiente = dhtTemp;
        } else if (bmpConectado) {
            temp_ambiente = bmpTemp; // Fallback al BMP180
        } else {
            temp_ambiente = 25.0; // Valor por defecto si todo falla
        }

        if (!isnan(dhtHum)) {
            hum_ambiente = dhtHum;
        } else {
            hum_ambiente = 50.0; // Valor por defecto si falla
        }

        // 3. Lectura de Luz (BH1750) y mapeo LDR simulado
        float lux = -1.0;
        float simulated_ldr = 4095.0; // Oscuridad total por defecto
        
        if (bh1750Conectado) {
            lux = lightMeter.readLightLevel();
            if (lux >= 0) {
                // Ecuación de saturación para simular LDR (0 lux -> 4095, alta luz -> 0)
                simulated_ldr = 4095.0 - (4095.0 * (lux / (lux + 500.0)));
                simulated_ldr = constrain(simulated_ldr, 0.0, 4095.0);
            }
        }

        // 4. Lectura de Temperatura del Suelo (DS18B20)
        ds18b20.requestTemperatures();
        float tempSuelo = ds18b20.getTempCByIndex(0);

        // --- SALIDA SERIAL (Compatible con serial_bridge.py) ---
        Serial.println(F("\n=================================================="));
        Serial.println(F("               LECTURAS DEL SISTEMA               "));
        Serial.println(F("=================================================="));
        
        Serial.print(F("Temperatura: ")); Serial.println(temp_ambiente);
        Serial.print(F("Humedad Aire: ")); Serial.println(hum_ambiente);
        Serial.print(F("Presión: ")); Serial.println((int)presion);
        Serial.print(F("Humedad Suelo: ")); Serial.println(valorRawPromedio);
        Serial.print(F("Luz (LDR): ")); Serial.println((int)simulated_ldr);
        
        // Información adicional de depuración (no leída por serial_bridge.py)
        Serial.println(F("\n[ DETALLES DE SENSORES ]"));
        if (bh1750Conectado) {
            Serial.print(F("  BH1750 Luz   : ")); Serial.print(lux); Serial.println(F(" lx"));
        } else {
            Serial.println(F("  BH1750 Luz   : NO CONECTADO"));
        }
        if (tempSuelo != DEVICE_DISCONNECTED_C) {
            Serial.print(F("  Temp. Suelo  : ")); Serial.print(tempSuelo); Serial.println(F(" °C"));
        } else {
            Serial.println(F("  Temp. Suelo  : NO CONECTADO / ERROR RESISTENCIA"));
        }
        Serial.print(F("  Hum. Suelo % : ")); Serial.print(porcHumedadSuelo); Serial.println(F(" %"));
        if (bmpConectado) {
            Serial.print(F("  Altitud Aprox: ")); Serial.print(bmp180.readAltitude(101325)); Serial.println(F(" m"));
        }
        
        Serial.println(F("----------------------------------"));

        // 5. Enviar datos a Backend vía HTTP POST
        if (!isnan(temp_ambiente) && !isnan(hum_ambiente)) {
            sendDataToServer(temp_ambiente, hum_ambiente, presion, valorRawPromedio, simulated_ldr, tempSuelo);
        } else {
            Serial.println(F("Lecturas de ambiente inválidas. Saltando envío HTTP."));
        }
    }
}
