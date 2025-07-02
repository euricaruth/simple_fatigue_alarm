#include <ESP8266WiFi.h>
#include <ArduinoWebsockets.h>

using namespace websockets;

const char* ssid = "Tara family"; //ganti wifinya sesuai yang terhubung di device
const char* password = "tarabeurna"; //ganti passwordnya 
const char* websocket_server = "ws://192.168.1.4:8080"; 

const int pinLDR = 5;      //D1
const int pinPIR = 4;      //D2
const int pinBuzzer = 0;   //D3 (buzzer pasif)
const int buzzerFreq = 1000;

bool alarmConditionActive = false;
unsigned long alarmConditionStartTime = 0;
const long alarmDelay = 3000; 

WebsocketsClient wsClient;

void connectWiFi() {
  Serial.print("Menghubungkan ke WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  int retry = 0;
  while (WiFi.status() != WL_CONNECTED && retry < 20) {
    delay(500);
    Serial.print(".");
    retry++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi terhubung!");
    Serial.print("IP ESP8266: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nGagal konek WiFi");
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(pinLDR, INPUT);
  pinMode(pinPIR, INPUT);
  pinMode(pinBuzzer, OUTPUT);
  noTone(pinBuzzer); 

  connectWiFi();

  if (wsClient.connect(websocket_server)) {
    Serial.println("WebSocket terhubung!");
  } else {
    Serial.println("Gagal konek WebSocket");
  }
  
  wsClient.onMessage([](WebsocketsMessage message) {
    Serial.print("Pesan dari server: ");
    Serial.println(message.data());
  });
}

void loop() {
  wsClient.poll();

  int pirVal = digitalRead(pinPIR);
  int ldrVal = digitalRead(pinLDR);

  Serial.print("PIR: ");
  Serial.print(pirVal);
  Serial.print(" | LDR: ");
  Serial.println(ldrVal);

  bool isAlarmConditionMet = (ldrVal == HIGH && pirVal == LOW);

  if (isAlarmConditionMet) {
    
    if (!alarmConditionActive) {
      alarmConditionActive = true;
      alarmConditionStartTime = millis();
      Serial.println("Kondisi alarm terdeteksi, memulai timer 2 detik...");
    } else {
      if (millis() - alarmConditionStartTime >= alarmDelay) {
        Serial.println("Timer 2 detik selesai, BUZZER NYALA!");
        tone(pinBuzzer, buzzerFreq);
      }
    }
  } else {
    alarmConditionActive = false;
    noTone(pinBuzzer);
  }

  String json = "{\"pir\": " + String(pirVal) + ", \"ldr\": " + String(ldrVal) + "}";
  wsClient.send(json);

  delay(250); 
}