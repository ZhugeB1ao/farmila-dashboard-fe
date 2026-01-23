import { LayoutDashboard, Users, Building2, UserCog, Settings, User } from 'lucide-react';
import { cn } from '../ui/utils';

export type PageType = 'dashboard' | 'employees' | 'departments' | 'users' | 'profile';

interface SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

const menuItems = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'employees' as const, label: 'Employees', icon: Users },
  { id: 'departments' as const, label: 'Departments', icon: Building2 },
  { id: 'users' as const, label: 'Users & Roles', icon: UserCog },
];

const bottomItems = [
  { id: 'profile' as const, label: 'Profile', icon: User },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="h-16 border-b border-border flex items-center px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground">HR</span>
          </div>
          <span className="text-lg">HR Portal</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
