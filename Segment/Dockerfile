# syntax=docker/dockerfile:1

FROM python:3.10-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1
ENV NUMBA_DISABLE_CACHING=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY . .

ARG UID=10001

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt

EXPOSE 8001

CMD ["python3", "main.py"]