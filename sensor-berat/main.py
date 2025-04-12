import os
import time
import json
import random
import paho.mqtt.client as mqtt

MQTT_BROKER = os.getenv("MQTT_BROKER", "localhost")
MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))

def connect_client():
    client = mqtt.Client()
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    return client

client = connect_client()

cycle = 0
while True:
    cycle += 1

    if cycle % 60 == 0:
        print("=== [DOWNTIME SENSOR BERAT] ===")
        time.sleep(20)
        print("=== [AKTIF LAGI] ===")
        continue

    try:
        berat = round(random.gauss(10.0, 0.3), 2)
        payload = json.dumps({"value": berat})
        client.publish("sensor/berat", payload)
        print(f"[SENT BERAT] {payload}")
    except Exception as e:
        print(f"[ERROR] MQTT berat: {e}")
        time.sleep(5)
        client = connect_client()

    time.sleep(1)