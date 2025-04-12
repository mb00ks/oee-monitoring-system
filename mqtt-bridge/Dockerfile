FROM python:3.10-slim

WORKDIR /app
COPY . .

RUN pip install paho-mqtt kafka-python

CMD ["python", "main.py"]
