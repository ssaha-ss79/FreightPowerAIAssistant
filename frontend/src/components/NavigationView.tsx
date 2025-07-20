import { useState, useEffect } from 'react';
import { Database } from 'sql.js';
import { MapPin, Flag, Clock } from 'lucide-react';

interface Trip {
  id: string;
  origin_location: string;
  destination_location: string;
  estimated_arrival_time: string;
}

const NavigationView = ({ db }: { db: Database | null }) => {
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);

  useEffect(() => {
    if (db) {
      const res = db.exec("SELECT t.id, l.origin_location, l.destination_location, t.estimated_arrival_time FROM trips t JOIN loads l ON t.load_id = l.id WHERE t.status = 'active' LIMIT 1");
      if (res.length > 0 && res[0].values.length > 0) {
        const row = res[0].values[0];
        setActiveTrip({ id: row[0] as string, origin_location: row[1] as string, destination_location: row[2] as string, estimated_arrival_time: row[3] as string });
      }
    }
  }, [db]);

  if (!activeTrip) {
    return <div>No active trip. Say "Show available loads" to start a new trip.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-brand-accent">Active Navigation</h2>
      <div className="space-y-4 text-lg">
        <div className="flex items-center gap-3"><MapPin className="text-green-400"/> <span>From: <strong>{activeTrip.origin_location}</strong></span></div>
        <div className="flex items-center gap-3"><Flag className="text-red-400"/> <span>To: <strong>{activeTrip.destination_location}</strong></span></div>
        <div className="flex items-center gap-3"><Clock className="text-blue-400"/> <span>ETA: <strong>{new Date(activeTrip.estimated_arrival_time).toLocaleTimeString()}</strong></span></div>
      </div>
      <div className="mt-6 p-4 bg-gray-900 rounded-lg text-center text-gray-400">Map Placeholder</div>
    </div>
  );
};

export default NavigationView;

