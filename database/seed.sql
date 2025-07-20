-- Seed data for the Voice-Driven Smart Logistics Assistant

-- Users & Drivers
INSERT INTO users (id, email, name, role, created_at) VALUES
('user-001', 'driver@example.com', 'John Doe', 'driver', '2023-10-27T10:00:00Z');

INSERT INTO vehicles (id, make, model, year, license_plate, telemetry_enabled) VALUES
('vehicle-001', 'Freightliner', 'Cascadia', 2022, 'TRUCK1', 1);

INSERT INTO drivers (id, vehicle_id, preferences) VALUES
('user-001', 'vehicle-001', '{"avoid_tolls": true}');

-- Available Loads
INSERT INTO loads (id, origin_location, destination_location, payload_description, payout_amount, status, created_at) VALUES
('load-101', 'Los Angeles, CA', 'Phoenix, AZ', 'Consumer Electronics', 2500.00, 'available', '2023-10-27T11:00:00Z'),
('load-102', 'San Francisco, CA', 'Reno, NV', 'Medical Supplies', 1800.50, 'available', '2023-10-27T11:05:00Z'),
('load-103', 'Seattle, WA', 'Portland, OR', 'Frozen Goods', 1200.75, 'available', '2023-10-27T11:10:00Z');

-- A booked load and active trip for the driver
INSERT INTO loads (id, origin_location, destination_location, payload_description, payout_amount, status, booked_by_driver_id, booked_at, created_at) VALUES
('load-201', 'Denver, CO', 'Salt Lake City, UT', 'Building Materials', 3200.00, 'in_transit', 'user-001', '2023-10-26T08:00:00Z', '2023-10-26T07:00:00Z');

INSERT INTO trips (id, driver_id, load_id, start_time, current_location, route_polyline, estimated_arrival_time, status, created_at) VALUES
('trip-001', 'user-001', 'load-201', '2023-10-26T09:00:00Z', '{"lat": 40.7, "lon": -111.8}', '...encoded_polyline_string...', '2023-10-27T18:00:00Z', 'active', '2023-10-26T08:00:00Z');

-- Alerts
INSERT INTO alerts (id, type, description, location, severity, triggered_at, driver_id, trip_id, status) VALUES
('alert-001', 'traffic', 'Heavy congestion on I-15 North near Provo.', '{"lat": 40.2, "lon": -111.6}', 'medium', '2023-10-27T12:00:00Z', 'user-001', 'trip-001', 'active'),
('alert-002', 'fuel_low', 'Fuel level at 15%. Recommend refueling soon.', NULL, 'low', '2023-10-27T12:30:00Z', 'user-001', 'trip-001', 'active');

-- Notifications
INSERT INTO notifications (id, driver_id, message_content, source_system, status, received_at) VALUES
('notif-001', 'user-001', 'Reminder: Mandatory safety briefing at 08:00 tomorrow.', 'Dispatch System', 'new', '2023-10-27T09:00:00Z');

-- Documents
INSERT INTO documents (id, driver_id, trip_id, type, filename, storage_url, tags, uploaded_at) VALUES
('doc-001', 'user-001', 'trip-001', 'bill_of_lading', 'bol_load-201.pdf', '/documents/bol_load-201.pdf', '["bol", "denver"]', '2023-10-26T09:05:00Z');

