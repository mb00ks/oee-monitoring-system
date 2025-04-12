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
        status = random.choices(["running", "idle", "error"], weights=[85, 10, 5])[0]
        payload = json.dumps({"value": status})
        client.publish("sensor/status", payload)
        print(f"[SENT STATUS] {payload}")
    except Exception as e:
        print(f"[ERROR] MQTT status: {e}")
        time.sleep(5)
        client = connect_client()

    time.sleep(1)
