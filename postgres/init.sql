-- Tabel utama untuk menyimpan data sinkron dari sensor
CREATE TABLE IF NOT EXISTS sensor_data (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    shift VARCHAR(10) NOT NULL,
    berat REAL NOT NULL,
    kecepatan REAL NOT NULL,
    status VARCHAR(10) NOT NULL
);

-- Tabel log histori downtime
CREATE TABLE IF NOT EXISTS downtime_log (
    id SERIAL PRIMARY KEY,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_secs INTEGER,
    type VARCHAR(20),       -- sensor / jaringan / manual
    reason TEXT
);

-- (Opsional) Tabel log histori OEE
CREATE TABLE IF NOT EXISTS oee_log (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    shift VARCHAR(10),
    availability REAL,
    performance REAL,
    quality REAL,
    oee REAL
);
