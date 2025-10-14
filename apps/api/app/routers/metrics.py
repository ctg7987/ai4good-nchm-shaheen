"""Metrics collection router."""

import os
import json
import csv
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import io

from app.models.schemas import MetricsRequest
from app.core.settings import settings

router = APIRouter()

# Metrics file path
METRICS_FILE = Path("metrics.jsonl")
METRICS_DIR = Path("metrics_data")


def ensure_metrics_dir():
    """Ensure metrics directory exists."""
    METRICS_DIR.mkdir(exist_ok=True)


def append_metric(event: str, count: int, timestamp: str = None):
    """Append a metric to the rolling JSON file."""
    if not settings.allow_telemetry:
        return
    
    ensure_metrics_dir()
    
    if timestamp is None:
        timestamp = datetime.utcnow().isoformat() + "Z"
    
    metric_entry = {
        "event": event,
        "count": count,
        "timestamp": timestamp,
        "session_id": "anonymous"  # No personal data
    }
    
    # Append to rolling JSON file
    with open(METRICS_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(metric_entry, ensure_ascii=False) + "\n")


def get_metrics_summary() -> Dict[str, Any]:
    """Get aggregated metrics summary."""
    if not METRICS_FILE.exists():
        return {"total_events": 0, "events": {}}
    
    events = {}
    total_events = 0
    
    with open(METRICS_FILE, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                try:
                    metric = json.loads(line)
                    event = metric.get("event", "unknown")
                    count = metric.get("count", 1)
                    
                    if event not in events:
                        events[event] = 0
                    events[event] += count
                    total_events += count
                except json.JSONDecodeError:
                    continue
    
    return {
        "total_events": total_events,
        "events": events,
        "last_updated": datetime.utcnow().isoformat() + "Z"
    }


def export_metrics_csv() -> str:
    """Export metrics as CSV string."""
    if not METRICS_FILE.exists():
        return "event,count,timestamp\n"
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["event", "count", "timestamp", "session_id"])
    
    with open(METRICS_FILE, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                try:
                    metric = json.loads(line)
                    writer.writerow([
                        metric.get("event", ""),
                        metric.get("count", 0),
                        metric.get("timestamp", ""),
                        metric.get("session_id", "")
                    ])
                except json.JSONDecodeError:
                    continue
    
    return output.getvalue()


@router.post("/metrics")
async def collect_metrics(request: MetricsRequest) -> Dict[str, Any]:
    """Collect anonymous metrics if telemetry is enabled."""
    if not settings.allow_telemetry:
        return {"message": "Telemetry disabled", "collected": False}
    
    # Validate event type
    valid_events = ["session_start", "task_complete", "ncmh_click", "feather_earned", "narrative_generated"]
    if request.event not in valid_events:
        raise HTTPException(status_code=400, detail=f"Invalid event type. Must be one of: {valid_events}")
    
    # Append metric to file
    append_metric(request.event, request.count)
    
    return {
        "message": "Metrics collected",
        "collected": True,
        "event": request.event,
        "count": request.count,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }


@router.get("/metrics/summary")
async def get_metrics_summary():
    """Get metrics summary (if telemetry is enabled)."""
    if not settings.allow_telemetry:
        raise HTTPException(status_code=403, detail="Telemetry disabled")
    
    summary = get_metrics_summary()
    return summary


@router.get("/metrics/export")
async def export_metrics():
    """Export metrics as CSV for judges."""
    if not settings.allow_telemetry:
        raise HTTPException(status_code=403, detail="Telemetry disabled")
    
    csv_content = export_metrics_csv()
    
    # Create streaming response
    def generate():
        yield csv_content
    
    return StreamingResponse(
        generate(),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=metrics_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        }
    )


@router.delete("/metrics")
async def clear_metrics():
    """Clear all metrics (for testing/reset)."""
    if not settings.allow_telemetry:
        raise HTTPException(status_code=403, detail="Telemetry disabled")
    
    if METRICS_FILE.exists():
        METRICS_FILE.unlink()
    
    return {"message": "Metrics cleared", "cleared": True}
