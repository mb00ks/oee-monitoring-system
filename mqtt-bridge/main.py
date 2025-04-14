import os
import json
import time
import threading
from collections import deque
import paho.mqtt.client as mqtt
from kafka import KafkaProducer
from kafka.errors import KafkaError

# Konfigurasi
MQTT_BROKER = os.getenv("MQTT_BROKER", "localhost")
MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))
KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
KAFKA_TOPIC = "sensor-data"

# Inisialisasi Kafka Producer
def create_kafka_producer():
    return KafkaProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP,
        value_serializer=lambda v: json.dumps(v).encode("utf-8")
    )

producer = create_kafka_producer()
retry_buffer = deque()

# Kirim ke Kafka dengan retry
def send_to_kafka(data):
    global producer
    try:
        producer.send(KAFKA_TOPIC, value=data)
        print(f"[✓] Sent to Kafka: {data}")
    except KafkaError as e:
        print(f"[X] Kafka error: {e}")
        retry_buffer.append(data)
        time.sleep(1)
        producer = create_kafka_producer()

# MQTT callback
def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT with result code {rc}")
    client.subscribe("sensor/#")

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        payload["sensor_type"] = msg.topic.split("/")[-1]
        payload["timestamp"] = time.time()
        send_to_kafka(payload)
    except Exception as e:
        print("[!] Error processing MQTT message:", e)

# Retry loop
def retry_loop():
    while True:
        if retry_buffer:
            data = retry_buffer.popleft()
            print("[↻] Retrying Kafka send...")
            send_to_kafka(data)
        time.sleep(2)

# MQTT Client setup
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect(MQTT_BROKER, MQTT_PORT, 60)

# Jalankan retry buffer thread
threading.Thread(target=retry_loop, daemon=True).start()

# Start MQTT loop
client.loop_forever()
