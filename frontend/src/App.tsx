import { useEffect, useState } from 'react';
import { Database } from 'sql.js';
import { initDb } from './services/db';
import Layout from './components/Layout';
import VoiceControl from './components/VoiceControl';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import NavigationView from './components/NavigationView';
import LoadsList from './components/LoadsList';
import DocumentUpload from './components/DocumentUpload';
import AlertsDisplay from './components/AlertsDisplay';

type View = 'dashboard' | 'navigation' | 'loads' | 'documents';

function App() {
  const [db, setDb] = useState<Database | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    assistantResponse,
    setAssistantResponse,
  } = useVoiceAssistant({ db, setCurrentView });

  useEffect(() => {
    // Initialize the in-browser SQLite database
    initDb()
      .then(database => {
        setDb(database);
        console.log("Local SQLite DB initialized successfully.");
        setAssistantResponse("Welcome, driver. The system is ready. How can I help you?");
      })
      .catch(err => {
        console.error("DB init error:", err);
        setDbError("Failed to initialize local database. Some features may not work.");
        setAssistantResponse("Warning: Local database failed to load.");
      });
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'navigation':
        return <NavigationView db={db} />;
      case 'loads':
        return <LoadsList db={db} />;
      case 'documents':
        return <DocumentUpload />;
      case 'dashboard':
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-brand-accent">Dashboard</h2>
            <p>Say "Show available loads" or "Show my documents" to get started.</p>
          </div>
        );
    }
  };

  if (dbError) {
    return <div className="flex items-center justify-center h-screen text-red-400">{dbError}</div>;
  }

  if (!db) {
    return <div className="flex items-center justify-center h-screen">Loading Assistant...</div>;
  }

  return (
    <>
      <Layout>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-brand-light p-6 rounded-lg shadow-lg">
            {renderView()}
          </div>
          <div className="lg:col-span-1 bg-brand-light p-6 rounded-lg shadow-lg">
            <AlertsDisplay db={db} />
          </div>
        </div>
      </Layout>
      <VoiceControl
        isListening={isListening}
        startListening={startListening}
        stopListening={stopListening}
        transcript={transcript}
        assistantResponse={assistantResponse}
      />
    </>
  );
}

export default App;

