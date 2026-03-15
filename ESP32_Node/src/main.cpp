#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP085.h>
#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// --- DEFINICIÓN DE PINES (Basado en tu Arduino IDE) ---
#define DHTPIN 5        // DHT11 en D5
#define DHTTYPE DHT11   // Tipo de sensor DHT
#define LDR_PIN 32      // LDR en D32 (Salida AO)
#define SUELO_PIN 34    // Humedad Suelo en D34 (Capacitivo)

// --- INICIALIZACIÓN DE OBJETOS ---
DHT dht(DHTPIN, DHTTYPE);
Adafruit_BMP085 bmp;

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

void sendDataToServer(float temp, float hum, float pres, float soil_analog, float light_analog) {
    // Ya no verificamos WiFi.status() == WL_CONNECTED porque en modo AP, 
    // el ESP32 siempre esta "conectado" a su propia red.
    HTTPClient http;
    http.begin(api_url);
    http.addHeader("Content-Type", "application/json");

        // Construir JSON de envio usando los campos exactos del Backend:
        // device_id, temperature_c, humidity_air_pct, pressure_pa, soil_m_analog, light_analog
        StaticJsonDocument<256> doc;
        doc["device_id"] = device_id;
        doc["temperature_c"] = temp;
        doc["humidity_air_pct"] = hum;
        doc["pressure_pa"] = pres;
        doc["soil_m_analog"] = soil_analog;
        doc["light_analog"] = light_analog;

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
    Serial.println("\n==================================");
    Serial.println("   SISTEMA AGROTECH INTEGRADO IA");
    Serial.println("==================================");

    // 1. Configurar Resolucion Analogica
    analogReadResolution(12);

    // 2. Iniciar DHT11
    dht.begin();
    Serial.println("DHT11: Iniciado");

    // 3. Iniciar BMP180 (I2C)
    Wire.begin();
    if (!bmp.begin()) {
      Serial.println("⚠️ BMP180: NO DETECTADO (Revisa D21/D22)");
      bmpConectado = false;
    } else {
      Serial.println("BMP180: OK (Lectura de precision)");
      bmpConectado = true;
    }

    Serial.println("Suelo y LDR: Listos (Analogicos)");
    Serial.println("----------------------------------");
    
    // Conectar a Internet para la IA
    setupWiFi();
}

void loop() {
    unsigned long now = millis();
    if (now - lastMsg > interval) {
        lastMsg = now;

        // A. Sensores Analogicos crudos (0-4095)
        float luz_analog = analogRead(LDR_PIN);
        float humedad_suelo_analog = analogRead(SUELO_PIN);

        // B. Humedad del Aire (DHT11)
        float hum_aire = dht.readHumidity();

        // C. Clima de Precision (BMP180) y backup
        float temp_precisa = 0.0;
        float presion = 0.0;
        
        if (bmpConectado) {
          temp_precisa = bmp.readTemperature(); 
          presion = bmp.readPressure(); // En pascales directamente
        } else {
          temp_precisa = dht.readTemperature(); 
          presion = 101325.0; // Presion ATM promedio si es null
        }

        Serial.println("\n--- NUEVA LECTURA ---");
        Serial.print("Temperatura: "); Serial.print(temp_precisa); Serial.println(" °C");
        Serial.print("Humedad Relativa: "); Serial.print(hum_aire); Serial.println(" %");
        Serial.print("Presion: "); Serial.print(presion); Serial.println(" Pa");
        Serial.print("Humedad del Suelo (Crudo): "); Serial.println(humedad_suelo_analog);
        Serial.print("Luz (Crudo): "); Serial.println(luz_analog);

        // Enviar al Backend (FastAPI + IA)
        if(!isnan(temp_precisa) && !isnan(hum_aire)) {
            sendDataToServer(temp_precisa, hum_aire, presion, humedad_suelo_analog, luz_analog);
        } else {
            Serial.println("Lecturas de temperatura/humedad invalidas (NaN). Saltando envio.");
        }
    }
}
