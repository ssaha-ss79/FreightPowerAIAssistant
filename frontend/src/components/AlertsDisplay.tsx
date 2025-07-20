import { useState, useEffect } from 'react';
import { Database } from 'sql.js';
import { AlertTriangle, Fuel, CloudDrizzle } from 'lucide-react';

interface Alert {
  id: string;
  type: 'fuel_low' | 'weather' | 'traffic';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

const AlertIcon = ({ type }: { type: Alert['type'] }) => {
  switch (type) {
    case 'fuel_low': return <Fuel className="w-5 h-5 text-yellow-400" />;
    case 'traffic': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
    case 'weather': return <CloudDrizzle className="w-5 h-5 text-blue-400" />;
    default: return <AlertTriangle className="w-5 h-5" />;
  }
};

const AlertsDisplay = ({ db }: { db: Database | null }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (db) {
      try {
        const res = db.exec("SELECT id, type, description, severity FROM alerts WHERE status = 'active'");
        if (res.length > 0) {
          const data = res[0].values.map(row => ({ id: row[0], type: row[1], description: row[2], severity: row[3] })) as Alert[];
          setAlerts(data);
        }
      } catch (e) {
        console.error("Failed to fetch alerts from local DB", e);
      }
    }
  }, [db]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-brand-accent">Active Alerts</h2>
      {alerts.length > 0 ? (
        <ul className="space-y-3">
          {alerts.map(alert => (
            <li key={alert.id} className="flex items-start gap-3 p-3 bg-gray-700 rounded-md">
              <AlertIcon type={alert.type} />
              <span>{alert.description}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No active alerts.</p>
      )}
    </div>
  );
};

export default AlertsDisplay;

