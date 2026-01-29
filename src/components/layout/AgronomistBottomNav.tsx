import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, PenSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/agronomist', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/agronomist/queue', icon: ClipboardList, label: 'Queue' },
  { path: '/agronomist/articles', icon: PenSquare, label: 'Articles' },
  { path: '/agronomist/profile', icon: User, label: 'Profile' },
];

export function AgronomistBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-elevated safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                isActive
                  ? 'text-accent'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('w-5 h-5 mb-1', isActive && 'stroke-[2.5]')} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
