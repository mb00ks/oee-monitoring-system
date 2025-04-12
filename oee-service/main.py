from fastapi import FastAPI
import psycopg2
from datetime import datetime
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Query
from typing import Literal
import pandas as pd

app = FastAPI()

# Allow cross-origin (for dashboard)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# ENV
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")

# Connect to PostgreSQL
conn = psycopg2.connect(
    host=POSTGRES_HOST,
    dbname="sensor_db",
    user="user",
    password="pass"
)
cursor = conn.cursor()

@app.get("/oee")
def get_oee():
    cursor.execute("""
        SELECT timestamp, berat, kecepatan, status
        FROM sensor_data
        ORDER BY timestamp DESC
        LIMIT 1000
    """)
    rows = cursor.fetchall()

    if not rows:
        return {"message": "No data available"}

    total = len(rows)
    running = [r for r in rows if r[3] == "running"]
    availability = len(running) / total if total else 0

    performance = len([r for r in running if r[2] > 0]) / len(running) if running else 0
    quality = len([r for r in running if 9.5 <= r[1] <= 10.5]) / len(running) if running else 0

    oee = availability * performance * quality

    return {
        "availability": round(availability * 100, 2),
        "performance": round(performance * 100, 2),
        "quality": round(quality * 100, 2),
        "oee": round(oee * 100, 2)
    }

@app.get("/oee/trend")
def get_oee_trend(group_by: Literal["day", "hour", "shift"] = Query("day")):
    if group_by == "day":
        cursor.execute("""
            SELECT DATE(timestamp) as date, 
                   COUNT(*) FILTER (WHERE status = 'running')::float / COUNT(*) as availability,
                   COUNT(*) FILTER (WHERE status = 'running' AND kecepatan > 0)::float /
                   NULLIF(COUNT(*) FILTER (WHERE status = 'running'), 0) as performance,
                   COUNT(*) FILTER (WHERE status = 'running' AND berat BETWEEN 9.5 AND 10.5)::float /
                   NULLIF(COUNT(*) FILTER (WHERE status = 'running'), 0) as quality
            FROM sensor_data
            GROUP BY DATE(timestamp)
            ORDER BY DATE(timestamp)
        """)
    elif group_by == "hour":
        cursor.execute("""
            SELECT DATE_TRUNC('hour', timestamp) as hour,
                   COUNT(*) FILTER (WHERE status = 'running')::float / COUNT(*) as availability,
                   COUNT(*) FILTER (WHERE status = 'running' AND kecepatan > 0)::float /
                   NULLIF(COUNT(*) FILTER (WHERE status = 'running'), 0) as performance,
                   COUNT(*) FILTER (WHERE status = 'running' AND berat BETWEEN 9.5 AND 10.5)::float /
                   NULLIF(COUNT(*) FILTER (WHERE status = 'running'), 0) as quality
            FROM sensor_data
            GROUP BY hour
            ORDER BY hour
        """)
    else:  # shift
        cursor.execute("""
            SELECT shift,
                   COUNT(*) FILTER (WHERE status = 'running')::float / COUNT(*) as availability,
                   COUNT(*) FILTER (WHERE status = 'running' AND kecepatan > 0)::float /
                   NULLIF(COUNT(*) FILTER (WHERE status = 'running'), 0) as performance,
                   COUNT(*) FILTER (WHERE status = 'running' AND berat BETWEEN 9.5 AND 10.5)::float /
                   NULLIF(COUNT(*) FILTER (WHERE status = 'running'), 0) as quality
            FROM sensor_data
            GROUP BY shift
            ORDER BY shift
        """)

    result = cursor.fetchall()
    labels = ["label", "availability", "performance", "quality"]
    data = []

    for row in result:
        label = row[0]
        a, p, q = row[1:4]
        oee = (a or 0) * (p or 0) * (q or 0)
        data.append({
            "label": str(label),
            "availability": round((a or 0) * 100, 2),
            "performance": round((p or 0) * 100, 2),
            "quality": round((q or 0) * 100, 2),
            "oee": round(oee * 100, 2)
        })

    return data