# 📘 TECHNICAL DOCUMENTATION – OEE Monitoring System

## 🔧 Service Breakdown

| Service             | Language | Description                                                           |
|---------------------|----------|-----------------------------------------------------------------------|
| sensor-berat        | Python   | Simulates weight sensor data to MQTT topic `sensor/berat`            |
| sensor-kecepatan    | Python   | Simulates speed sensor to `sensor/kecepatan`                         |
| sensor-status       | Python   | Simulates machine status (`running`, `idle`, `error`) to `sensor/status` |
| mqtt-broker         | MQTT     | Mosquitto broker for receiving sensor data                           |
| mqtt-bridge         | Python   | MQTT subscriber → Kafka producer (`sensor-data`) with retry buffer   |
| kafka               | Kafka    | Message broker for sensor stream                                     |
| processor-service   | Python   | Kafka consumer → sync per timestamp → insert to PostgreSQL           |
| postgres            | SQL      | Stores `sensor_data`, `oee_log`, `downtime_log`                      |
| oee-service         | FastAPI  | Calculate OEE (Availability, Performance, Quality)                   |
| frontend-dashboard  | Next.js  | React-based dashboard visualizing real-time OEE                      |

---

## 🧱 Database Schema

### `sensor_data`
- `id` SERIAL
- `timestamp` TIMESTAMPTZ
- `shift` VARCHAR
- `berat`, `kecepatan` REAL
- `status` VARCHAR

### `downtime_log`
- `start_time`, `end_time`: TIMESTAMPTZ
- `duration_secs`: INTEGER
- `type`: VARCHAR (e.g. `sensor`)
- `reason`: TEXT

### `oee_log` (optional)
- `timestamp`, `shift`
- `availability`, `performance`, `quality`, `oee`

---

## 🔄 Data Flow

```
Sensor MQTT → Mosquitto → mqtt-bridge → Kafka → processor → PostgreSQL → oee-service → frontend-dashboard
```

---

## 🧪 API Endpoints

- `GET /oee`: current OEE values
- `GET /oee/trend?group_by=day|hour|shift`: trend of OEE components

---

## 💡 Shift Logic

```python
if 8 <= hour < 16:
    shift = "Shift 1"
elif 16 <= hour < 24:
    shift = "Shift 2"
else:
    shift = "Shift 3"
```

---

## 🛠 Retry & Resilience

| Component         | Resilience Feature                              |
|-------------------|--------------------------------------------------|
| mqtt-bridge        | Retry buffer, auto-reconnect Kafka              |
| processor-service  | Kafka/DB reconnect                             |
| kafka              | Durable storage                                |
| postgres           | Init with volume & backup                      |

---

## 📈 Visualization

- Card: Real-time metrics (Availability, Performance, Quality, OEE)
- Line Chart: OEE Trend by day/hour/shift
- Bar Chart: A/P/Q components grouped by trend unit

---

## 🧰 Extendable Features

- Add new sensors by duplicating simulator folder
- Add new Kafka topics or API endpoint
- Add email/Slack/Telegram alerts if OEE < threshold
- Export trend to PDF or CSV
