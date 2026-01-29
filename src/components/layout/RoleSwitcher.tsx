import { useAppStore, UserRole } from '@/stores/appStore';
import { Sprout, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export function RoleSwitcher() {
  const { currentRole, setRole } = useAppStore();
  const navigate = useNavigate();

  const handleRoleChange = (role: UserRole) => {
    setRole(role);
    navigate(role === 'farmer' ? '/' : '/agronomist');
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
    </div>
  );
}
