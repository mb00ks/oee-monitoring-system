import os
import json
import time
import psycopg2
from kafka import KafkaConsumer
from datetime import datetime
from collections import defaultdict

# ENV
KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")

# DB Connect
conn = psycopg2.connect(
    host=POSTGRES_HOST,
    dbname="sensor_db",
    user="user",
    password="pass"
)
cursor = conn.cursor()

# Kafka consumer
consumer = KafkaConsumer(
    "sensor-data",
    bootstrap_servers=KAFKA_BOOTSTRAP,
    value_deserializer=lambda m: json.loads(m.decode("utf-8")),
    auto_offset_reset="earliest",
    group_id="processor-group"
)

buffer = defaultdict(dict)
last_data_time = time.time()
in_downtime = False

def detect_shift(ts: datetime):
    hour = ts.hour
    if 8 <= hour < 16:
        return "Shift 1"
    elif 16 <= hour < 24:
        return "Shift 2"
    return "Shift 3"

def log_downtime(start, end, reason="no data", type_="sensor"):
    duration = int(end - start)
    cursor.execute("""
        INSERT INTO downtime_log (start_time, end_time, duration_secs, reason, type)
        VALUES (%s, %s, %s, %s, %s)
    """, (datetime.fromtimestamp(start), datetime.fromtimestamp(end), duration, reason, type_))
    conn.commit()
    print(f"[!] Downtime logged: {duration}s")

# Loop data dari Kafka
for msg in consumer:
    now = time.time()

    # Selesaikan downtime jika ada
    if in_downtime:
        log_downtime(downtime_start, now)
        in_downtime = False

    data = msg.value
    timestamp = round(data["timestamp"])
    sensor_type = data["sensor_type"]
    value = data["value"]

    buffer[timestamp][sensor_type] = value
    last_data_time = now

    if {"berat", "kecepatan", "status"} <= buffer[timestamp].keys():
        dt = datetime.fromtimestamp(timestamp)
        shift = detect_shift(dt)

        print(f"[✓] Sinkron data @ {dt} | Shift: {shift}")

        cursor.execute("""
            INSERT INTO sensor_data (timestamp, shift, berat, kecepatan, status)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            dt, shift,
            buffer[timestamp]["berat"],
            buffer[timestamp]["kecepatan"],
            buffer[timestamp]["status"]
        ))
        conn.commit()
        del buffer[timestamp]

    # Cek downtime
    if now - last_data_time > 30 and not in_downtime:
        in_downtime = True
        downtime_start = last_data_time
