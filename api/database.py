import sqlite3
from contextlib import contextmanager
from datetime import datetime
import os

DATABASE_PATH = os.path.join(os.path.dirname(__file__), "fguard.db")

@contextmanager
def get_db():
    """Context manager for database connections"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def init_db():
    """Initialize the database with tables"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Alerts table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                image TEXT NOT NULL,
                title TEXT NOT NULL,
                coords TEXT NOT NULL,
                date TEXT NOT NULL,
                time TEXT NOT NULL,
                confidence INTEGER NOT NULL,
                area TEXT NOT NULL,
                status TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Settings table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                notifications_enabled BOOLEAN DEFAULT 1,
                email_alerts BOOLEAN DEFAULT 1,
                sms_alerts BOOLEAN DEFAULT 0,
                confidence_threshold INTEGER DEFAULT 85,
                auto_notify_partners BOOLEAN DEFAULT 1,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Insert default settings if not exists
        cursor.execute("""
            INSERT OR IGNORE INTO settings (id, notifications_enabled, email_alerts, sms_alerts, confidence_threshold, auto_notify_partners)
            VALUES (1, 1, 1, 0, 85, 1)
        """)
        
        conn.commit()

def seed_initial_data():
    """Seed the database with initial alert data"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check if alerts already exist
        cursor.execute("SELECT COUNT(*) as count FROM alerts")
        count = cursor.fetchone()["count"]
        
        if count == 0:
            alerts = [
                ("/images/alert1.jpg", "Mau Complex, Nakuru County", "-0.4833, 35.6167", "2025-11-17", "09:23 AM", 94, "12.4 ha", "New"),
                ("/images/alert2.jpg", "Aberdare Range, Nyandarua County", "-0.4000, 36.7167", "2025-11-17", "07:15 AM", 87, "8.2 ha", "Investigating"),
                ("/images/alert3.jpg", "Kakamega Forest, Kakamega County", "0.2667, 34.8667", "2025-11-16", "03:42 PM", 91, "15.6 ha", "New"),
                ("/images/alert4.jpg", "Cherangani Hills, Trans Nzoia County", "1.2000, 35.4000", "2025-11-15", "11:30 AM", 88, "6.7 ha", "Resolved"),
                ("/images/alert5.jpg", "Mount Kenya Forest, Nyeri County", "-0.1521, 37.3084", "2025-11-14", "02:15 PM", 76, "4.2 ha", "False Positive")
            ]
            
            cursor.executemany("""
                INSERT INTO alerts (image, title, coords, date, time, confidence, area, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, alerts)
            
            conn.commit()
            print(f"Seeded {len(alerts)} alerts into database")

# Database helper functions
def get_all_alerts(status=None, search=None):
    """Get all alerts with optional filtering"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        query = "SELECT * FROM alerts WHERE 1=1"
        params = []
        
        if status and status != "All Alerts":
            query += " AND status = ?"
            params.append(status)
        
        if search:
            query += " AND title LIKE ?"
            params.append(f"%{search}%")
        
        query += " ORDER BY created_at DESC"
        
        cursor.execute(query, params)
        return [dict(row) for row in cursor.fetchall()]

def get_alert_by_id(alert_id):
    """Get a single alert by ID"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM alerts WHERE id = ?", (alert_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

def create_alert(title, coords, confidence, area, status="New"):
    """Create a new alert"""
    now = datetime.now()
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO alerts (image, title, coords, date, time, confidence, area, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, ("/images/alert_default.jpg", title, coords, now.strftime("%Y-%m-%d"), 
             now.strftime("%I:%M %p"), confidence, area, status))
        
        alert_id = cursor.lastrowid
        conn.commit()
        return get_alert_by_id(alert_id)

def update_alert(alert_id, status=None, title=None, coords=None):
    """Update an alert"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        updates = []
        params = []
        
        if status:
            updates.append("status = ?")
            params.append(status)
        if title:
            updates.append("title = ?")
            params.append(title)
        if coords:
            updates.append("coords = ?")
            params.append(coords)
        
        if updates:
            updates.append("updated_at = CURRENT_TIMESTAMP")
            params.append(alert_id)
            
            query = f"UPDATE alerts SET {', '.join(updates)} WHERE id = ?"
            cursor.execute(query, params)
            conn.commit()
        
        return get_alert_by_id(alert_id)

def delete_alert(alert_id):
    """Delete an alert"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM alerts WHERE id = ?", (alert_id,))
        conn.commit()
        return cursor.rowcount > 0

def get_settings():
    """Get current settings"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM settings WHERE id = 1")
        row = cursor.fetchone()
        return dict(row) if row else None

def update_settings(notifications_enabled, email_alerts, sms_alerts, confidence_threshold, auto_notify_partners):
    """Update settings"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE settings 
            SET notifications_enabled = ?,
                email_alerts = ?,
                sms_alerts = ?,
                confidence_threshold = ?,
                auto_notify_partners = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = 1
        """, (notifications_enabled, email_alerts, sms_alerts, confidence_threshold, auto_notify_partners))
        conn.commit()
        return get_settings()

# Initialize database on module import
if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    seed_initial_data()
    print("Database initialized successfully!")
