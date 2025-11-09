# Python FastAPI dev image
FROM python:3.11-slim
WORKDIR /app

# Copy pyproject & install deps
COPY pyproject.toml .
RUN pip install --no-cache-dir -U pip setuptools wheel \
    && pip install --no-cache-dir .[dev]

# Copy app source
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
