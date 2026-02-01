import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { UserDashboard } from './components/user/UserDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { WelcomePage } from './components/WelcomePage';

function AppContent() {
  const { currentView, user, adminUser } = useApp();
  const [hasSelectedView, setHasSelectedView] = useState(false);
  
  // Show welcome page if no one is logged in and view hasn't been selected
  if (!hasSelectedView && !user && !adminUser) {
    return (
      <div onClick={() => setHasSelectedView(true)}>
        <WelcomePage />
      </div>
    );
  }
  
  return currentView === 'user' ? <UserDashboard /> : <AdminDashboard />;
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
