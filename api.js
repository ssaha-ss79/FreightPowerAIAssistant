import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Middleware to check for DB connection
router.use((req, res, next) => {
  if (!req.db) {
    return res.status(500).json({ error: 'Database not available' });
  }
  next();
});

/**
 * 5.2. Load Management
 * GET /api/v1/loads?status=available
 */
router.get('/loads', (req, res) => {
  try {
    const status = req.query.status || 'available';
    const stmt = req.db.prepare('SELECT id, origin_location, destination_location, payout_amount, status FROM loads WHERE status = ?');
    const loads = stmt.all(status);
    res.json(loads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 5.2. Load Management
 * POST /api/v1/loads/{load_id}/book
 */
router.post('/loads/:load_id/book', (req, res) => {
    const { load_id } = req.params;
    const { driver_id } = req.body; // Assuming driver_id is sent in the request body

    if (!driver_id) {
        return res.status(400).json({ error: 'driver_id is required' });
    }

    try {
        // Update load status
        const updateStmt = req.db.prepare("UPDATE loads SET status = 'booked', booked_by_driver_id = ?, booked_at = ? WHERE id = ? AND status = 'available'");
        const info = updateStmt.run(driver_id, new Date().toISOString(), load_id);

        if (info.changes === 0) {
            return res.status(404).json({ error: 'Load not found or already booked' });
        }

        // Create a new trip
        const trip_id = `trip-${uuidv4()}`;
        const tripStmt = req.db.prepare("INSERT INTO trips (id, driver_id, load_id, start_time, status, created_at) VALUES (?, ?, ?, ?, 'active', ?)");
        tripStmt.run(trip_id, driver_id, load_id, new Date().toISOString(), new Date().toISOString());

        res.json({ status: 'success', trip_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * 5.7. Notifications
 * GET /api/v1/notifications/driver/{driver_id}
 */
router.get('/notifications/driver/:driver_id', (req, res) => {
  try {
    const { driver_id } = req.params;
    const status = req.query.status || 'new';
    const stmt = req.db.prepare('SELECT id, message_content, source_system, received_at FROM notifications WHERE driver_id = ? AND status = ?');
    const notifications = stmt.all(driver_id, status);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 5.8. Document Management
 * GET /api/v1/documents/driver/{driver_id}
 */
router.get('/documents/driver/:driver_id', (req, res) => {
    try {
      const { driver_id } = req.params;
      const stmt = req.db.prepare('SELECT id, filename, type, uploaded_at FROM documents WHERE driver_id = ?');
      const documents = stmt.all(driver_id);
      res.json(documents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

// Mock other endpoints for completeness
router.post('/route/plan', (req, res) => res.json({ trip_id: `trip-${uuidv4()}`, route_polyline: 'mock_polyline_string', eta: '2 hours', distance: '120 miles' }));
router.post('/checkin', (req, res) => res.json({ status: 'success', log_id: `log-${uuidv4()}` }));
router.post('/documents/upload', (req, res) => res.status(201).json({ status: 'success', document_id: `doc-${uuidv4()}`, storage_url: '/mock/path/to/document.pdf' }));

export default router;

