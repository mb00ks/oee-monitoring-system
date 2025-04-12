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

while True:
    try:
        kecepatan = round(random.uniform(55, 65), 2)
        payload = json.dumps({"value": kecepatan})
        client.publish("sensor/kecepatan", payload)
        print(f"[SENT KECEPATAN] {payload}")
    except Exception as e:
        print(f"[ERROR] MQTT kecepatan: {e}")
        time.sleep(5)
        client = connect_client()

    time.sleep(1)