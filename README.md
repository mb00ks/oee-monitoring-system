# 🏭 OEE Monitoring System (Microservices + MQTT + Kafka + PostgreSQL + Next.js)

Sistem ini memonitor performa mesin industri dan menghitung OEE (Overall Equipment Effectiveness) secara real-time.

## 📦 Teknologi yang Digunakan

- **Sensor**: Simulasi 3 sensor (berat, kecepatan, status) via MQTT
- **Broker**: Mosquitto MQTT Broker
- **Middleware**: Apache Kafka
- **Processor**: Python Kafka Consumer + PostgreSQL
- **API Service**: FastAPI (untuk perhitungan OEE)
- **Dashboard**: Next.js (React) + Tailwind + Chart.js
- **Database**: PostgreSQL

---

## 🧱 Arsitektur

```
Sensor (MQTT) --> mqtt-broker --> mqtt-bridge --> Kafka --> processor-service --> PostgreSQL
                                                             |
                                                        oee-service --> frontend-dashboard (Next.js)
```

---

## 🚀 Cara Menjalankan

### 1. Clone repo ini:

```bash
git clone https://github.com/your-org/oee-monitoring-system.git
cd oee-monitoring-system
```

### 2. Jalankan semua service:

```bash
docker-compose up --build
```

### 3. Akses:

- Dashboard (Next.js): http://localhost:3000
- API OEE: http://localhost:8000/oee
- MQTT Broker: `mqtt://localhost:1883`
- PostgreSQL: `localhost:5432` (user: `user`, pass: `pass`, db: `sensor_db`)

---

## 📂 Struktur Project

```
.
├── sensor-berat/
├── sensor-kecepatan/
├── sensor-status/
├── mqtt-bridge/
├── processor-service/
├── oee-service/
├── frontend-dashboard/
├── postgres/
│   └── init.sql
├── mosquitto/
│   └── mosquitto.conf
└── docker-compose.yml
```

---

## 🧪 Endpoints API

- `/oee`: ambil nilai OEE terkini
- `/oee/trend?group_by=day|hour|shift`: ambil tren historis OEE

---

## 📊 Visualisasi

- **Cards**: Menampilkan Availability, Performance, Quality, dan OEE real-time
- **Chart**: Tren OEE per hari, jam, shift

---

## 📌 Catatan

- Sistem ini tahan terhadap downtime Kafka, MQTT, dan PostgreSQL
- Mendukung retry dan buffering
- Bisa ditambahkan fitur notifikasi dan export PDF

---

## 🛠 Konfigurasi Tambahan

- MQTT topic: `sensor/berat`, `sensor/kecepatan`, `sensor/status`
- Kafka topic: `sensor-data`

---

## 🧠 Lisensi

Open Source – Gunakan dan modifikasi untuk kebutuhan industri Anda.
