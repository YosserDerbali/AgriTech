import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  action?: React.ReactNode;
  leftAction?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, showBack = false, action, leftAction, className }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        'sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {leftAction}
          {showBack && !leftAction && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-9 w-9 -ml-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {action}
      </div>
    </header>
  );
}
