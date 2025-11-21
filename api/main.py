from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import random
import database as db

app = FastAPI(title="F-Guard API")

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    db.init_db()
    db.seed_initial_data()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============= DATA MODELS =============

class DashboardStats(BaseModel):
    new_alerts_today: int
    alerts_change: str
    total_hectares_saved: int
    hectares_change: str
    avg_response_time: int
    response_time_change: str
    partners_notified: int
    partners_info: str

class Alert(BaseModel):
    id: int
    image: str
    title: str
    coords: str
    date: str
    time: str
    confidence: int
    area: str
    status: str

class AlertCreate(BaseModel):
    title: str
    coords: str
    confidence: int
    area: str
    status: str = "New"

class AlertUpdate(BaseModel):
    status: Optional[str] = None
    title: Optional[str] = None
    coords: Optional[str] = None

class ReportStats(BaseModel):
    total_alerts: int
    alerts_change: str
    area_affected: str
    area_change: str
    avg_response: str
    response_change: str
    resolved_percentage: int
    resolved_change: str

class Settings(BaseModel):
    notifications_enabled: bool
    email_alerts: bool
    sms_alerts: bool
    confidence_threshold: int
    auto_notify_partners: bool

# ============= ENDPOINTS =============

@app.get("/")
async def root():
    return {"message": "F-Guard API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Dashboard endpoints
@app.get("/api/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """Get dashboard statistics"""
    return DashboardStats(
        new_alerts_today=7,
        alerts_change="+2 from yesterday",
        total_hectares_saved=1267,
        hectares_change="+89 this month",
        avg_response_time=23,
        response_time_change="-5 min improvement",
        partners_notified=34,
        partners_info="KWS, NGOs, Communities"
    )

# Alerts endpoints
@app.get("/api/alerts", response_model=List[Alert])
async def get_alerts(status: Optional[str] = None, search: Optional[str] = None):
    """Get all alerts with optional filtering"""
    alerts = db.get_all_alerts(status=status, search=search)
    return alerts

@app.get("/api/alerts/{alert_id}", response_model=Alert)
async def get_alert(alert_id: int):
    """Get a specific alert by ID"""
    alert = db.get_alert_by_id(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@app.post("/api/alerts", response_model=Alert)
async def create_alert(alert: AlertCreate):
    """Create a new alert"""
    new_alert = db.create_alert(
        title=alert.title,
        coords=alert.coords,
        confidence=alert.confidence,
        area=alert.area,
        status=alert.status
    )
    return new_alert

@app.patch("/api/alerts/{alert_id}", response_model=Alert)
async def update_alert(alert_id: int, alert_update: AlertUpdate):
    """Update an alert's status or other fields"""
    updated_alert = db.update_alert(
        alert_id=alert_id,
        status=alert_update.status,
        title=alert_update.title,
        coords=alert_update.coords
    )
    if not updated_alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return updated_alert

@app.delete("/api/alerts/{alert_id}")
async def delete_alert(alert_id: int):
    """Delete an alert"""
    success = db.delete_alert(alert_id)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": "Alert deleted successfully"}

# Reports endpoints
@app.get("/api/reports/stats", response_model=ReportStats)
async def get_report_stats(range: str = "Month"):
    """Get report statistics for a time range"""
    # Different stats based on range
    ranges_data = {
        "Week": {
            "total_alerts": 45,
            "alerts_change": "↓ 8% from last week",
            "area_affected": "234 ha",
            "area_change": "↓ 12% improvement",
            "avg_response": "19 min",
            "response_change": "↓ 21% improvement",
            "resolved_percentage": 92,
            "resolved_change": "↑ 3% increase"
        },
        "Month": {
            "total_alerts": 342,
            "alerts_change": "↓ 12% from last period",
            "area_affected": "1,248 ha",
            "area_change": "↓ 8% improvement",
            "avg_response": "23 min",
            "response_change": "↓ 18% improvement",
            "resolved_percentage": 89,
            "resolved_change": "↑ 5% increase"
        },
        "Year": {
            "total_alerts": 4123,
            "alerts_change": "↓ 15% from last year",
            "area_affected": "15,678 ha",
            "area_change": "↓ 10% improvement",
            "avg_response": "27 min",
            "response_change": "↓ 15% improvement",
            "resolved_percentage": 87,
            "resolved_change": "↑ 7% increase"
        }
    }
    
    data = ranges_data.get(range, ranges_data["Month"])
    return ReportStats(**data)

# Settings endpoints
@app.get("/api/settings", response_model=Settings)
async def get_settings():
    """Get current settings"""
    settings = db.get_settings()
    return Settings(**settings)

@app.put("/api/settings", response_model=Settings)
async def update_settings(settings: Settings):
    """Update settings"""
    updated_settings = db.update_settings(
        notifications_enabled=settings.notifications_enabled,
        email_alerts=settings.email_alerts,
        sms_alerts=settings.sms_alerts,
        confidence_threshold=settings.confidence_threshold,
        auto_notify_partners=settings.auto_notify_partners
    )
    return Settings(**updated_settings)

