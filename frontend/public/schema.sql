-- Voice-Driven Smart Logistics Assistant: SQLite Schema
-- This schema is used for both the local (in-browser) cache and the backend database.

-- 4.1. users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT CHECK(role IN ('driver', 'dispatcher')),
    created_at TEXT NOT NULL
);

-- 4.3. vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    make TEXT,
    model TEXT,
    year INTEGER,
    license_plate TEXT UNIQUE,
    telemetry_enabled INTEGER DEFAULT 1
);

-- 4.2. drivers Table
CREATE TABLE IF NOT EXISTS drivers (
    id TEXT PRIMARY KEY,
    vehicle_id TEXT,
    preferences TEXT, -- JSON string
    FOREIGN KEY (id) REFERENCES users(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- 4.4. loads Table
CREATE TABLE IF NOT EXISTS loads (
    id TEXT PRIMARY KEY,
    origin_location TEXT NOT NULL,
    destination_location TEXT NOT NULL,
    payload_description TEXT,
    payout_amount REAL,
    status TEXT CHECK(status IN ('available', 'booked', 'in_transit', 'completed', 'cancelled')) NOT NULL,
    booked_by_driver_id TEXT,
    booked_at TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (booked_by_driver_id) REFERENCES drivers(id)
);

-- 4.5. trips Table
CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    driver_id TEXT NOT NULL,
    load_id TEXT NOT NULL,
    start_time TEXT,
    end_time TEXT,
    current_location TEXT, -- JSON string for lat/lon
    route_polyline TEXT,
    estimated_arrival_time TEXT,
    status TEXT CHECK(status IN ('active', 'completed', 'rerouted')) NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (load_id) REFERENCES loads(id)
);

-- 4.6. vehicle_telemetry_logs Table
CREATE TABLE IF NOT EXISTS vehicle_telemetry_logs (
    id TEXT PRIMARY KEY,
    vehicle_id TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    fuel_level_percent REAL,
    odometer_km REAL,
    latitude REAL,
    longitude REAL,
    speed_kph REAL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

-- 4.7. alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    type TEXT CHECK(type IN ('fuel_low', 'weather', 'traffic')) NOT NULL,
    description TEXT NOT NULL,
    location TEXT, -- JSON string for lat/lon
    severity TEXT CHECK(severity IN ('low', 'medium', 'high')) NOT NULL,
    triggered_at TEXT NOT NULL,
    driver_id TEXT,
    trip_id TEXT,
    status TEXT CHECK(status IN ('active', 'dismissed')) NOT NULL,
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (trip_id) REFERENCES trips(id)
);

-- 4.8. checkin_checkout_logs Table
CREATE TABLE IF NOT EXISTS checkin_checkout_logs (
    id TEXT PRIMARY KEY,
    driver_id TEXT NOT NULL,
    trip_id TEXT,
    type TEXT CHECK(type IN ('yard_checkin', 'yard_checkout', 'load_dropoff')) NOT NULL,
    location TEXT, -- JSON string for lat/lon
    timestamp TEXT NOT NULL,
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (trip_id) REFERENCES trips(id)
);

-- 4.9. notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    driver_id TEXT NOT NULL,
    message_content TEXT NOT NULL,
    source_system TEXT,
    status TEXT CHECK(status IN ('new', 'read', 'archived')) NOT NULL,
    received_at TEXT NOT NULL,
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

-- 4.10. documents Table
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    driver_id TEXT NOT NULL,
    trip_id TEXT,
    type TEXT,
    filename TEXT NOT NULL,
    storage_url TEXT NOT NULL,
    tags TEXT, -- JSON string for array of strings
    uploaded_at TEXT NOT NULL,
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (trip_id) REFERENCES trips(id)
);

-- NOTE: dispatch_messages and emergency_logs are omitted for this initial implementation but would follow the same pattern.

