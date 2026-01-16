import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: 'primary' | 'accent' | 'approved' | 'pending';
}

const colorClasses = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent-foreground',
  approved: 'bg-status-approved/10 text-status-approved',
  pending: 'bg-status-pending/10 text-status-pending-foreground',
};

export function StatCard({ icon: Icon, label, value, color = 'primary' }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl p-4 shadow-soft">
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', colorClasses[color])}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold mb-0.5">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
