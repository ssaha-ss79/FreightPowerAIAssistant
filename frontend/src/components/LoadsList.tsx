import { useState, useEffect } from 'react';
import { Database } from 'sql.js';
import { getAvailableLoads } from '../services/api';
import { Package } from 'lucide-react';

interface Load {
  id: string;
  origin_location: string;
  destination_location: string;
  payout_amount: number;
}

const LoadsList = ({ db }: { db: Database | null }) => {
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSyncLoads = async () => {
      try {
        setLoading(true);
        const availableLoads = await getAvailableLoads();
        setLoads(availableLoads);

        // Sync with local DB
        if (db) {
          availableLoads.forEach(load => {
            db.run('INSERT OR REPLACE INTO loads (id, origin_location, destination_location, payout_amount, status, created_at) VALUES (?, ?, ?, ?, ?, ?)', [
              load.id, load.origin_location, load.destination_location, load.payout_amount, 'available', new Date().toISOString()
            ]);
          });
          console.log('Synced available loads to local DB.');
        }
      } catch (err) {
        setError('Failed to fetch loads.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSyncLoads();
  }, [db]);

  if (loading) return <div>Loading available loads...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-brand-accent">Available Loads</h2>
      <ul className="space-y-4">
        {loads.map(load => (
          <li key={load.id} className="p-4 bg-gray-700 rounded-lg flex items-center gap-4">
            <Package className="w-8 h-8 text-brand-accent flex-shrink-0" />
            <div className="flex-grow">
              <p className="font-semibold">{load.origin_location} to {load.destination_location}</p>
              <p className="text-sm text-gray-400">Payout: <span className="text-green-400">${load.payout_amount.toFixed(2)}</span></p>
            </div>
            <p className="text-xs text-gray-500">ID: {load.id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LoadsList;

