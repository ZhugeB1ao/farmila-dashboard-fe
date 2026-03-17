import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { DepartmentsPage } from './pages/DepartmentsPage';

import { TopNav } from './components/layout/TopNav';
import { Sidebar, PageType } from './components/layout/Sidebar';
import { AuthProvider, useAuth } from './context/AuthContext';

type ViewType = PageType | 'login';

function AppContent() {
  const { user, logOut, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<PageType>('dashboard');

  const handleLogout = () => {
    logOut();
  };

  const handleNavigate = (page: PageType) => {
    setCurrentView(page);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentPage={currentView}
        onNavigate={handleNavigate}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav onLogout={handleLogout} userName={user.email.split('@')[0]} />
        <main className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && <DashboardPage />}
          {currentView === 'employees' && <EmployeesPage />}
          {currentView === 'departments' && <DepartmentsPage />}

        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;