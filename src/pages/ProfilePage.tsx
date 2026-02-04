import { useNavigate } from 'react-router-dom';
import { User, Settings, Bell, HelpCircle, LogOut, ChevronRight, Shield } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/appStore';
import { toast } from 'sonner';

const menuItems = [
  { icon: Bell, label: 'Notifications', badge: '3' },
  { icon: Settings, label: 'Settings' },
  { icon: Shield, label: 'Privacy & Security' },
  { icon: HelpCircle, label: 'Help & Support' },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAppStore();

  const handleMenuClick = (label: string) => {
    toast.info(`${label} - Ready for backend integration`);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/auth/farmer');
  };

  return (
    <div className="min-h-screen pb-20">
      <PageHeader title="Profile" />

      <div className="px-5 py-6 space-y-6">
        {/* User Card */}
        <Card className="animate-fade-up">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{user?.name || 'Farmer User'}</h2>
                <p className="text-sm text-muted-foreground">{user?.email || 'farmer@example.com'}</p>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-card rounded-xl p-4 text-center shadow-soft">
            <p className="text-2xl font-bold text-primary">12</p>
            <p className="text-xs text-muted-foreground">Total Scans</p>
          </div>
          <div className="bg-card rounded-xl p-4 text-center shadow-soft">
            <p className="text-2xl font-bold text-status-approved">8</p>
            <p className="text-xs text-muted-foreground">Treated</p>
          </div>
          <div className="bg-card rounded-xl p-4 text-center shadow-soft">
            <p className="text-2xl font-bold text-accent-foreground">92%</p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </div>
        </div>

        {/* Menu */}
        <Card className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-2">
            {menuItems.map(({ icon: Icon, label, badge }) => (
              <button
                key={label}
                onClick={() => handleMenuClick(label)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="flex-1 text-left font-medium">{label}</span>
                {badge && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                    {badge}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 animate-fade-up"
          style={{ animationDelay: '0.3s' }}
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <p>AgriScan v1.0.0</p>
          <p>Made with 🌱 for farmers</p>
        </div>
      </div>
    </div>
  );
}
