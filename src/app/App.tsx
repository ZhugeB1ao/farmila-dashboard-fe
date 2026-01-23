import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { UsersRolesPage } from './pages/UsersRolesPage';
import { ProfilePage } from './pages/ProfilePage';
import { TopNav } from './components/layout/TopNav';
import { Sidebar, PageType } from './components/layout/Sidebar';

type ViewType = PageType | 'login';

// HR Management Dashboard Application
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('login');

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const handleNavigate = (page: PageType) => {
    setCurrentView(page);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentPage={currentView as PageType}
        onNavigate={handleNavigate}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav onLogout={handleLogout} userName="Admin User" />
        <main className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && <DashboardPage />}
          {currentView === 'employees' && <EmployeesPage />}
          {currentView === 'departments' && <DepartmentsPage />}
          {currentView === 'users' && <UsersRolesPage />}
          {currentView === 'profile' && <ProfilePage />}
        </main>
      </div>
    </div>
  );
}

export default App;