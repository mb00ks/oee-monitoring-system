import streamlit as st
import requests
import time
import plotly.graph_objects as go

st.set_page_config(layout="wide")
st.title("📊 Realtime OEE Monitoring Dashboard")

api_url = "http://oee-service:8000/oee"

placeholder = st.empty()

while True:
    try:
        response = requests.get(api_url)
        data = response.json()
    except:
        st.warning("❌ Gagal terhubung ke oee-service.")
        time.sleep(5)
        continue

    if "oee" not in data:
        st.warning("⚠️ Data OEE belum tersedia.")
        time.sleep(5)
        continue

    with placeholder.container():
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("📈 Availability", f"{data['availability']} %")
        col2.metric("⚙️ Performance", f"{data['performance']} %")
        col3.metric("✅ Quality", f"{data['quality']} %")
        col4.metric("⭐ OEE", f"{data['oee']} %")

        # (Optional) Tambahkan bar chart
        st.subheader("📊 Komponen OEE")
        fig = go.Figure(go.Bar(
            x=["Availability", "Performance", "Quality", "OEE"],
            y=[data['availability'], data['performance'], data['quality'], data['oee']]
        ))
        st.plotly_chart(fig, use_container_width=True)

    time.sleep(5)
