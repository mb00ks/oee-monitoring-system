# Dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY . .

RUN pip install paho-mqtt

CMD ["python", "main.py"]