import { useAppStore, UserRole } from '@/stores/appStore';
import { Sprout, Stethoscope, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

export function RoleSwitcher() {
  const { currentRole, setRole } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide role switcher on admin pages
  const isAdminRoute = location.pathname.startsWith('/admin');
  if (isAdminRoute) return null;

  const handleRoleChange = (role: UserRole) => {
    setRole(role);
    if (role === 'farmer') {
      navigate('/');
    } else if (role === 'agronomist') {
      navigate('/agronomist');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex bg-card border border-border rounded-full p-1 shadow-elevated">
      <button
        onClick={() => handleRoleChange('farmer')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
          currentRole === 'farmer'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Sprout className="w-3.5 h-3.5" />
        Farmer
      </button>
      <button
        onClick={() => handleRoleChange('agronomist')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
          currentRole === 'agronomist'
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Stethoscope className="w-3.5 h-3.5" />
        Agronomist
      </button>
      <button
        onClick={() => handleRoleChange('admin')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
          currentRole === 'admin'
            ? 'bg-destructive text-destructive-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Shield className="w-3.5 h-3.5" />
        Admin
      </button>
    </div>
  );
}
