FROM python:3.11-slim
WORKDIR /app
COPY src/ /app/src/
RUN pip install --no-cache-dir requests
ENTRYPOINT ["python3", "src/solana_order_analyzer.py"]
CMD ["--slots", "5", "--dry-run"]
